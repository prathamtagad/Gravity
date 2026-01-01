# 🪐 Gravity Study

> **Transform dead time into productive study time**

## The Problem (PS-5)

Students waste **2+ hours daily** in unplanned gaps between classes. When lectures get cancelled or schedules misalign, this downtime becomes mindless scrolling instead of meaningful learning.

## Our Solution

**Gravity Study** is an AI-powered student productivity platform that:
1. **Detects free time gaps** from your class timetable
2. **Generates personalized micro-quests** using Gemini AI
3. **Connects nearby students** for spontaneous study sessions
4. **Gamifies productivity** with XP, levels, and leaderboards

## Key Features

| Feature | Description | Google Tech |
|---------|-------------|-------------|
| **Gap Navigator** | AI suggests 5-60 min activities | Gemini AI |
| **Timetable Sync** | Input schedule, detect gaps | Firebase |
| **Gravity Map** | See nearby students & study spots | Leaflet + Firebase |
| **Focus Timer** | BlackHole mode for deep work | — |
| **Campus Hotspots** | Library, labs, quiet zones | Firebase Realtime |
| **Social Matching** | Connect with peers in similar gaps | Firebase Auth |

## Demo Flow

```
1. Student logs in → Google Auth
2. Enters timetable → Gap detection
3. Opens Gap Navigator → "You have 45 minutes free!"
4. Gemini suggests: "Review DSA arrays on YouTube (20 min)"
5. Student starts quest → Focus Timer activates
6. Nearby peers appear on Gravity Map
7. Complete quest → Earn 200 XP, climb leaderboard
```

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (Aura Light design)
- **AI**: Google Gemini 2.0 Flash
- **Backend**: Firebase (Auth, Firestore)
- **Maps**: Leaflet + OpenStreetMap
- **Mobile**: Capacitor (Android)
- **Desktop**: Electron (Windows)

## Impact Metrics

- ⏰ **2+ hours/day** of dead time → productive time
- 📚 **3-4 micro-quests** per study gap
- 🤝 **Social discovery** of nearby study partners
- 🎮 **Gamification** drives consistent engagement

## Team

Built for **Hack'Vento 2026** by GDG on Campus IET DAVV

---

*"Your gaps, our gravity. Pull yourself towards progress."*
