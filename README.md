# 🪐 Gravity Study

> **Hack'Vento 2026 | PS-5: Adaptive Student Time Utilization**
>
> Transform dead time into productive study time with AI-powered micro-quests

[![Built with Firebase](https://img.shields.io/badge/Built%20with-Firebase-FFCA28?style=flat&logo=firebase)](https://firebase.google.com/)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4?style=flat&logo=google)](https://ai.google.dev/)
[![Made for GDG](https://img.shields.io/badge/Made%20for-GDG%20on%20Campus-EA4335?style=flat&logo=google)](https://developers.google.com/)

---

## 🎯 The Problem

Students waste **2+ hours daily** in unplanned gaps between classes. When lectures get cancelled or schedules misalign, this downtime becomes mindless scrolling instead of meaningful learning.

## 💡 Our Solution

**Gravity Study** is an AI-powered student productivity platform that:

1. 📅 **Detects free time gaps** from your class timetable
2. ✨ **Generates personalized micro-quests** using Gemini AI
3. 🗺️ **Connects nearby students** for spontaneous study sessions
4. 🎮 **Gamifies productivity** with XP, levels, and leaderboards

---

## ✨ Features

| Feature | Description | Google Tech |
|---------|-------------|-------------|
| **Gap Navigator** | AI suggests activities that fit your available time | Gemini AI |
| **Timetable Sync** | Enter schedule, auto-detect gaps | Firebase |
| **Gravity Map** | See nearby students & campus study spots | Leaflet + Firebase |
| **BlackHole Timer** | Immersive focus mode countdown | — |
| **Orbit Status** | Set availability, match with study partners | Firebase Realtime |
| **Campus Hotspots** | Pre-mapped library, labs, quiet zones | Firebase |
| **XP & Leaderboards** | Gamified progression system | Firestore |

---

## 🚀 Demo Flow

```
1. Student logs in → Google Auth
2. Enters timetable → Gap detection runs
3. Opens Gap Navigator → "You have 45 minutes free!"
4. Gemini suggests: "Review DSA on YouTube (20 min)" 
5. Student starts quest → Focus Timer activates
6. Nearby peers appear on Gravity Map
7. Complete quest → Earn 200 XP, climb leaderboard
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS |
| **State** | Zustand |
| **AI** | Google Gemini 2.0 Flash |
| **Backend** | Firebase (Auth, Firestore) |
| **Maps** | Leaflet + OpenStreetMap |
| **Mobile** | Capacitor (Android) |
| **Desktop** | Electron (Windows) |

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- Firebase project
- Gemini API key (optional, has fallback)

### Installation

```bash
# Clone and install
git clone https://github.com/your-username/gravity-study.git
cd gravity-study
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Firebase and Gemini keys

# Run development server
npm run dev
```

### Environment Variables

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_key  # Optional
```

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── features/         # Feature modules
│   ├── GapNavigator/ # AI-powered quest suggestions
│   ├── Timetable/    # Schedule management
│   ├── GravityMap/   # Map with users & hotspots
│   ├── BlackHole/    # Focus timer
│   └── Profile/      # User profile & settings
├── services/
│   ├── ai/           # Gemini integration
│   ├── firebase/     # Auth, Firestore, etc.
│   └── map/          # Campus hotspots
├── stores/           # Zustand state management
└── types/            # TypeScript definitions
```

---

## 🏫 Campus: IET DAVV, Indore

This app is built for **IET DAVV** campus with pre-configured study hotspots:
- 📚 IET Central Library
- 💻 CS Lab Block  
- ☕ IET Canteen
- 🌳 Campus Garden
- 📝 Seminar Hall Area
- 🎯 Main Building Lobby

Coordinates: `22.6811°N, 75.8800°E`

---

## 🧪 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run electron:dev` | Run Electron app |
| `npm run electron:build` | Build Windows desktop app |
| `npm run capacitor:android` | Run on Android |

---

## 👥 Team

Built for **Hack'Vento 2026** by GDG on Campus IET DAVV

| Name | Role | GitHub |
|------|------|--------|
| Pratham | **Lead Software Engineer** (Full Stack & Architecture) | [@prathamtagad](https://github.com/prathamtagad) |
| Prashray | **AI & Data Specialist** (Gemini Algorithms & Logic) | [@Prashray21](https://github.com/Prashray21) |
| Samarth | **Product Designer** (UI/UX & Frontend Interaction) | [@Samarthpurohit](https://github.com/Samarthpurohit) |
---

## 🌐 Live Demo

- **Web App**: [gravity-study.vercel.app](https://gravity-study.vercel.app) *(Update after deployment)*
- **Demo Video**: [YouTube Link](https://youtube.com/watch?v=xxxxx) *(Add after recording)*
- **APK Download**: [Releases](https://github.com/username/gravity-study/releases)

---

## 📄 License

MIT License - feel free to use for your own campus!

---

<p align="center">
  <i>"Your gaps, our gravity. Pull yourself towards progress."</i>
</p>
