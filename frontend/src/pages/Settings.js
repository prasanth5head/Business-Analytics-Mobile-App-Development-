import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    LinearProgress,
    Chip,
    IconButton,
    InputAdornment
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    Save as SaveIcon,
    PictureAsPdf as PdfIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import api from '../api';

const Settings = () => {
    const [user, setUser] = useState({
        name: '',
        age: '',
        businessKnowledge: '',
        technologiesKnown: [],
        resumeUrl: '',
        businessScore: 0
    });
    const [techInput, setTechInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState('');

    const fileInputRef = useRef();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const getAuthHeaders = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return {
            Authorization: `Bearer ${userInfo?.token}`
        };
    };

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/users/profile', {
                headers: getAuthHeaders()
            });
            setUser({
                name: data.name || '',
                age: data.age || '',
                businessKnowledge: data.businessKnowledge || '',
                technologiesKnown: data.technologiesKnown || [],
                resumeUrl: data.resumeUrl || '',
                businessScore: data.businessScore || 0
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleTechAdd = (e) => {
        e.preventDefault();
        if (techInput.trim() && !user.technologiesKnown.includes(techInput.trim())) {
            setUser({
                ...user,
                technologiesKnown: [...user.technologiesKnown, techInput.trim()]
            });
            setTechInput('');
        }
    };

    const handleTechDelete = (techToDelete) => {
        setUser({
            ...user,
            technologiesKnown: user.technologiesKnown.filter((tech) => tech !== techToDelete)
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            setError('Please upload an image (JPG/PNG) or a PDF file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB.');
            return;
        }

        setSelectedFile(file);
        setError('');

        // Preview
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFilePreview('pdf');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setUploadProgress(0);
            const { data } = await api.post('/api/upload', formData, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            setUser({ ...user, resumeUrl: data.fileUrl });
            setSuccess('File uploaded successfully!');
            setSelectedFile(null);
            setFilePreview('');
            setUploadProgress(0);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload file');
            setUploadProgress(0);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await api.put('/api/users/profile', user, {
                headers: getAuthHeaders()
            });

            // Update local storage
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            localStorage.setItem('userInfo', JSON.stringify({
                ...userInfo,
                name: data.name,
                businessScore: data.businessScore
            }));

            // Force refresh to update layout
            window.dispatchEvent(new Event('storage'));

            setUser({
                name: data.name || '',
                age: data.age || '',
                businessKnowledge: data.businessKnowledge || '',
                technologiesKnown: data.technologiesKnown || [],
                resumeUrl: data.resumeUrl || '',
                businessScore: data.businessScore || 0
            });
            setSuccess('Profile saved successfully! Your Business Score has been updated.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, letterSpacing: '-0.02em' }}>
                Settings & Profile
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Profile Information</Typography>

                        <form onSubmit={handleSaveProfile}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        fullWidth
                                        label="Profile Name"
                                        value={user.name}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Age"
                                        type="number"
                                        value={user.age}
                                        onChange={(e) => setUser({ ...user, age: e.target.value })}
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Knowledge about Business"
                                        multiline
                                        rows={4}
                                        value={user.businessKnowledge}
                                        onChange={(e) => setUser({ ...user, businessKnowledge: e.target.value })}
                                        placeholder="Describe your understanding of business, strategy, and domain expertise..."
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Technologies Known for Business"
                                            value={techInput}
                                            onChange={(e) => setTechInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleTechAdd(e)}
                                            placeholder="e.g., Data Analytics, AI Tools, Marketing Tools"
                                        />
                                        <Button variant="outlined" onClick={handleTechAdd}>Add</Button>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {user.technologiesKnown.map((tech, index) => (
                                            <Chip
                                                key={index}
                                                label={tech}
                                                onDelete={() => handleTechDelete(tech)}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<SaveIcon />}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Profile'}
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Upload Resume / File</Typography>

                        <input
                            type="file"
                            accept=".pdf,image/jpeg,image/png,image/jpg"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        <Box sx={{
                            border: '2px dashed rgba(255,255,255,0.2)',
                            borderRadius: 2,
                            p: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
                        }} onClick={() => fileInputRef.current?.click()}>
                            <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                Click to select Image or PDF
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                Max size: 5MB
                            </Typography>
                        </Box>

                        {selectedFile && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>Preview:</Typography>
                                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    {filePreview === 'pdf' ? (
                                        <PdfIcon sx={{ fontSize: 40, color: '#f40f02' }} />
                                    ) : (
                                        <Box component="img" src={filePreview} sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }} />
                                    )}
                                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                                        <Typography variant="body2" noWrap>{selectedFile.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</Typography>
                                    </Box>
                                    <IconButton size="small" onClick={() => setSelectedFile(null)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Paper>

                                {uploadProgress > 0 && uploadProgress < 100 && (
                                    <Box sx={{ width: '100%', mb: 2 }}>
                                        <LinearProgress variant="determinate" value={uploadProgress} />
                                        <Typography variant="caption" color="text.secondary" align="right" display="block">
                                            {uploadProgress}%
                                        </Typography>
                                    </Box>
                                )}

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleUpload}
                                    disabled={uploadProgress > 0 && uploadProgress < 100}
                                >
                                    Upload File
                                </Button>
                            </Box>
                        )}

                        {user.resumeUrl && !selectedFile && (
                            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Current Resume Uploaded
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap display="block" sx={{ mt: 1, wordBreak: 'break-all' }}>
                                    {user.resumeUrl}
                                </Typography>
                            </Box>
                        )}
                    </Paper>

                    <Paper elevation={0} sx={{
                        p: 4,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(30,144,255,0.1), rgba(0,255,255,0.1))',
                        border: '1px solid rgba(0,255,255,0.2)'
                    }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Your Business Score</Typography>
                        <Box sx={{ textAlign: 'center', my: 3 }}>
                            <Typography variant="h2" sx={{ fontWeight: 900, color: 'primary.main' }}>
                                {user.businessScore}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">out of 100</Typography>
                        </Box>
                        <Box sx={{ width: '100%', mb: 2 }}>
                            <LinearProgress
                                variant="determinate"
                                value={user.businessScore}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </Box>
                        <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 600 }}>
                            {user.businessScore <= 30 ? 'Beginner' :
                                user.businessScore <= 60 ? 'Developing Entrepreneur' :
                                    user.businessScore <= 80 ? 'Advanced Business Thinker' : 'Strategic Business Leader'}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Settings;
