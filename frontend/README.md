# Business Analytics PWA - Setup & Deployment Documentation

This document provides instructions for setting up, running, and deploying the Progressive Web App (PWA).

## 🛠️ Technology Stack
- **Frontend**: React.js (v19)
- **UI Framework**: Material UI (MUI)
- **State Management**: React Context API
- **Networking**: Axios with Interceptors
- **PWA**: Workbox & Service Workers

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:5000
```
Change to your production URL for deployment.

### 3. Run Development Server
```bash
npm start
```

### 4. Build for Production (PWA)
```bash
npm run build
```
The output will be in the `build/` folder.

## ✨ PWA Features (Installable)
- **Manifest**: Located at `public/manifest.json`.
- **Service Worker**: Configured in `src/service-worker.js` for offline caching and background sync.
- **Installation**: Can be installed on mobile (Add to Home Screen) and desktop.

## 📊 Feature Checkmate
1. **Core Dashboard**: `src/pages/Dashboard.js`
2. **Data CRUD**: `src/pages/RevenueEntry.js` & `src/pages/EntryHistory.js`
3. **API Service**: `src/api.js`
4. **File Upload**: `src/pages/Settings.js`
5. **Real-time Updates**: `src/context/MarketContext.js`
6. **Responsive Design**: Mobile-first grid system using MUI.
