import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

const ReactiveCursor = () => {
    const cursorRef = useRef(null);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;

        const moveCursor = (e) => {
            if (cursor) {
                cursor.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
            }
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
                setHovered(true);
            } else {
                setHovered(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <Box
            ref={cursorRef}
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: hovered ? 40 : 20,
                height: hovered ? 40 : 20,
                backgroundColor: 'primary.main',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 9999,
                mixBlendMode: 'difference',
                transition: 'width 0.2s, height 0.2s, background-color 0.2s',
                opacity: 0.7,
                display: { xs: 'none', md: 'block' } // Hide on mobile
            }}
        />
    );
};

export default ReactiveCursor;
