# 🪐 Gravity Study — Complete Feature Overview

<p align="center">
  <img src="./logo.png" width="150" alt="Gravity Study Logo"/>
</p>

<p align="center">
  <b><i>"Your gaps, our gravity. Pull yourself towards progress."</i></b>
</p>

<p align="center">
  <a href="#-the-problem">Problem</a> •
  <a href="#-the-solution">Solution</a> •
  <a href="#-core-features">Features</a> •
  <a href="#-demo-mode">Demo</a> •
  <a href="#-tech-stack">Tech</a>
</p>

---

## 🎬 Welcome to Gravity Study

Ever found yourself sitting between lectures, endlessly scrolling through social media while that DSA assignment looms overhead? We get it. That's exactly why we built **Gravity Study** — an AI-powered productivity companion that transforms those "dead zones" in your schedule into opportunities for growth.

Built for **Hack'Vento 2026 | PS-5: Adaptive Student Time Utilization**, Gravity Study is designed specifically for the IET DAVV campus, but its concept is universal to any student life.

![App Landing Screenshot - Add your screenshot here]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of the landing/login page -->

---

## 🚨 The Problem

Students waste an estimated **2+ hours daily** in unplanned gaps between classes. When lectures get cancelled, when your friend is running late, or when schedules just don't align — this downtime usually becomes:

- 📱 Mindless social media scrolling
- 😴 Unplanned naps
- 🎮 Gaming sessions that eat hours
- 💭 Just... waiting around

What if you could reclaim that time? What if an AI could suggest the *perfect* activity for those 45 free minutes?

---

## 💡 The Solution

**Gravity Study** takes a physics-inspired approach to productivity:

> Like gravity pulls objects towards a center, our app pulls students towards **productivity, connection, and growth**.

### Here's the magic formula:

```
📅 Your Timetable  +  🤖 Gemini AI  +  🗺️ Nearby Peers  =  🚀 Supercharged Productivity
```

---

## 📱 App Flow — From Login to Leaderboard

Let's walk through the entire user journey, step by step.

---

### 1️⃣ Authentication — Seamless Login

Your journey begins with a beautiful, minimal login experience. We use **Google Authentication** via Firebase for one-tap access.

![Login Page Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of the Login page with Google Auth button -->

**Features:**
- 🔐 Secure Google OAuth 2.0
- ⚡ Instant profile creation on first login
- 🌐 Works across Web, Android, and Desktop

---

### 2️⃣ Profile Setup — Customize Your Identity

After login, you'll be greeted with your **Profile Page**. This is your mission control center — showing your avatar, stats, subjects, and progression.

![Profile Page Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of the Profile page -->

**What you can see:**
- 🎓 Your name, avatar, and college year
- 📊 XP progress bar and current level
- 📚 Your subjects (math, physics, DSA, etc.)
- 🏆 Current streak and total quests completed

---

### 3️⃣ Edit Profile — Make It Yours

Hit the edit button to personalize your profile!

![Profile Form Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of the Profile Edit form -->

**Customization options:**
- 📸 Upload a custom avatar
- ✏️ Set your display name
- 🎓 Select your year of study
- 📚 Add your subjects (crucial for AI-powered suggestions!)
- 🎯 Toggle your visibility settings

---

### 4️⃣ Timetable Input — Tell Us Your Schedule

This is where the magic begins. Input your weekly class schedule, and our **Gap Detection Algorithm** does the rest.

![Timetable Input Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of the Timetable Input modal -->

**Features:**
- 📅 Weekly schedule grid view
- ⏰ Add classes with start/end times
- 📍 Include locations (optional)
- 🔄 Auto-detects gaps between classes
- 💾 Synced to Firebase for persistence

---

### 5️⃣ Gap Navigator — AI-Powered Quest Suggestions

**This is the heart of Gravity Study.** When you have free time, the Gap Navigator shows you exactly how long your gap is and suggests **personalized micro-quests** using **Google Gemini AI**.

![Gap Navigator Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of the Gap Navigator panel -->

**How it works:**
1. 🕐 Detects your current free time slot
2. ⏱️ Shows remaining minutes in the gap
3. 🤖 Gemini analyzes your subjects & time
4. 📝 Generates 3-5 micro-quests tailored to you!

**Example Quests:**
| Quest | Duration | XP |
|-------|----------|-----|
| "Watch a DSA arrays tutorial on YouTube" | 20 min | 150 XP |
| "Review calculus limits from notes" | 15 min | 100 XP |
| "Quick quiz on data structures" | 10 min | 80 XP |

---

### 6️⃣ BlackHole Timer — Deep Focus Mode

When you start a quest, the **BlackHole Timer** activates. This is an immersive focus countdown that helps you enter deep work mode.

![BlackHole Timer Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of the BlackHole Timer running -->

**Features:**
- 🕳️ Dramatic "black hole" visual aesthetic
- ⏳ Countdown timer with pulsing animations
- 🚫 Discourages interruptions
- ✅ Auto-completes quest and awards XP on finish
- 🔔 Notification when timer ends

---

### 7️⃣ Gravity Map — Find Your Study Buddies

See **nearby students** and **campus study hotspots** in real-time on an interactive map!

![Gravity Map Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of the Gravity Map with users and hotspots -->

**What you'll find:**
- 👥 **Student Markers** — See who's nearby and their orbit status
- 📚 **Campus Hotspots** — Pre-mapped locations like:
  - IET Central Library
  - CS Lab Block
  - IET Canteen
  - Campus Garden
  - Seminar Hall Area
  - Main Building Lobby
- 📍 **Your Location** — Always centered on you
- 🔍 **Tap to interact** — View profiles, send study requests

---

### 8️⃣ Orbit Status — Set Your Availability

Let others know if you're available to study! The **Orbit Status** system uses a traffic-light metaphor:

![Orbit Status Selector Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of Orbit Status selection -->

**Status Types:**
| Status | Meaning | Icon |
|--------|---------|------|
| 🟢 **Available** | "I'm free! Let's study together" | Open orbit |
| 🟡 **Maybe** | "Busy, but open to quick interactions" | Partial orbit |
| 🔴 **Busy** | "Deep work mode, please don't disturb" | Closed orbit |

Your orbit status is visible to others on the Gravity Map!

---

### 9️⃣ Collision System — Study Session Requests

When you find a peer on the map, you can **request a study session** — we call it a "Collision" in our space-themed vocabulary!

![Collision Request Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of the Collision Request popup -->

**How it works:**
1. 👆 Tap on a student marker on the map
2. 📤 Send a collision request
3. ⏳ Wait for their response
4. 🎉 If accepted, you both get connected!

**Collision View** shows a cool animation when two students "collide" for a study session.

![Collision View Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of the Collision View animation -->

---

### 🔟 Chat — Real-time Messaging

Once connected, you can chat with your study buddies! Full real-time messaging powered by Firebase.

![Chat Page Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of the Chat Page -->

**Features:**
- 💬 Real-time message sync
- 🔍 Search conversations
- 📱 Mobile-friendly design
- 💬 Group chats (coming soon!)

---

### 1️⃣1️⃣ Leaderboard — Compete & Climb

See how you stack up against other students! The **Leaderboard** tracks XP, levels, and study streaks.

![Leaderboard Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of the Leaderboard page -->

**Gamification Elements:**
- 🏆 Weekly Top Performers
- 📊 Your rank among all students
- 🔥 Streak bonuses for consistent study
- ⬆️ Level up with XP from completed quests

---

### 1️⃣2️⃣ Radar Mode — Discover Nearby Peers

A quick-glance radar view showing students in your vicinity!

![Radar Mode Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of Radar Mode -->

**Use case:** Perfect for quickly scanning who's around before heading to the library!

---

### 1️⃣3️⃣ Study Buddy Matching

Get matched with compatible study partners based on:
- 📚 Similar subjects
- ⏰ Overlapping free time
- 📍 Geographic proximity

![Study Buddy Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of Study Buddy feature -->

---

### 1️⃣4️⃣ Wormhole — Quick Navigation

**Wormhole** is our navigation hub — quickly jump between different sections of the app!

![Wormhole Navigation Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of Wormhole quick nav -->

---

### 1️⃣5️⃣ Settings & Preferences

Configure notifications, privacy, and app preferences.

![Settings Page Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot of Settings page -->

**Available Settings:**
- 🔔 Notification preferences
- 👁️ Privacy controls (visibility on map)
- 🌙 Theme preferences
- 📍 Location sharing toggles

---

## 🎮 Demo Mode

Can't test with real users? No problem! **Demo Mode** populates the map with simulated students so you can explore all features.

![Demo Mode Screenshot]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a screenshot showing Demo Mode with multiple simulated users -->

**Demo Mode Features:**
- 👥 5+ simulated student profiles
- 📍 Spread across the IET DAVV campus
- 🟢 Various orbit statuses
- 🔄 Randomized but realistic behavior

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | Core UI framework |
| **Bundler** | Vite | Lightning-fast dev server |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **State** | Zustand | Simple state management |
| **AI** | Google Gemini 2.0 Flash | Quest generation |
| **Backend** | Firebase | Auth, Firestore, Realtime DB |
| **Maps** | Leaflet + OpenStreetMap | Interactive mapping |
| **Mobile** | Capacitor | Android app |
| **Desktop** | Electron | Windows desktop app |

---

## 🏫 Built for IET DAVV, Indore

This app is designed specifically for the **Institute of Engineering & Technology, DAVV** campus!

**Pre-configured Campus Hotspots:**
| Location | Type | Best For |
|----------|------|----------|
| 📚 IET Central Library | Library | Deep study sessions |
| 💻 CS Lab Block | Lab | Coding practice |
| ☕ IET Canteen | Cafeteria | Group discussions |
| 🌳 Campus Garden | Outdoors | Light reading |
| 📝 Seminar Hall Area | Indoor | Presentations prep |
| 🎯 Main Building Lobby | Indoor | Quick meetups |

**Coordinates:** `22.6811°N, 75.8800°E`

---

## 📊 Impact Metrics

| Metric | Target Impact |
|--------|---------------|
| ⏰ Dead Time Converted | 2+ hours/day |
| 📚 Quests per Gap | 3-4 micro-quests |
| 🤝 Social Connections | 5+ new study buddies/week |
| 🎮 User Engagement | 80% daily active users |

---

## 🚀 Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| 🌐 **Web** | ✅ Ready | Fully responsive |
| 📱 **Android** | ✅ Ready | Via Capacitor |
| 🖥️ **Windows** | ✅ Ready | Via Electron |
| 🍎 **iOS** | 🔜 Planned | Coming soon |
| 🍏 **macOS** | 🔜 Planned | Coming soon |

---

## 🎨 Design Philosophy — Aura Light

Our UI follows the **Aura Light** design system:

- ☀️ Clean, light backgrounds
- 🫧 Frosted glass effects
- ✨ Subtle micro-animations
- 📱 Mobile-first responsive design
- 🎯 Focus on content, not chrome

![Aura Light Design Showcase]
<!-- 📸 SCREENSHOT PLACEHOLDER: Add a collage/showcase of the Aura Light design across different screens -->

---

## 👥 Meet the Team

Built with ❤️ for **Hack'Vento 2026** by:

| Avatar | Name | Role | Focus |
|--------|------|------|-------|
| 👨‍💻 | **Pratham** | Lead Software Engineer | Full Stack & Architecture |
| 🤖 | **Prashray** | AI & Data Specialist | Gemini Algorithms & Logic |
| 🎨 | **Samarth** | Product Designer | UI/UX & Frontend Interaction |

---

## 📸 Screenshots Gallery

### Mobile Experience

![Mobile Home]
<!-- 📸 SCREENSHOT PLACEHOLDER: Mobile home screen -->

![Mobile Map]
<!-- 📸 SCREENSHOT PLACEHOLDER: Mobile map view -->

![Mobile Timer]
<!-- 📸 SCREENSHOT PLACEHOLDER: Mobile timer view -->

---

### Desktop Experience

![Desktop Dashboard]
<!-- 📸 SCREENSHOT PLACEHOLDER: Desktop full dashboard -->

![Desktop Map View]
<!-- 📸 SCREENSHOT PLACEHOLDER: Desktop map expanded -->

---

## 🎯 Quick Start Commands

```bash
# Development
npm run dev              # Start web dev server

# Mobile
npm run capacitor:android  # Run on Android

# Desktop  
npm run electron:dev     # Run Electron dev
npm run electron:build   # Build Windows app

# Production
npm run build            # Build for deployment
```

---

## 🔮 Future Roadmap

- [ ] 📅 Google Calendar integration
- [ ] 🔔 Push notifications for gap detection
- [ ] 👥 Study group chat rooms
- [ ] 📊 Weekly productivity reports
- [ ] 🏅 Achievement badges system
- [ ] 🌍 Multi-campus support

---

<p align="center">
  <img src="./logo.png" width="80" alt="Gravity Study Logo"/>
</p>

<p align="center">
  <b>🪐 Gravity Study</b><br/>
  <i>Transform dead time into productive study time</i>
</p>

<p align="center">
  Made with 💜 for <b>Hack'Vento 2026</b> | GDG on Campus IET DAVV
</p>

---

<p align="center">
  <sub>© 2026 Gravity Study Team. MIT License.</sub>
</p>
