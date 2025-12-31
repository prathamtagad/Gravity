# Gravity Study - Social Study Network

A hackathon MVP for a social study network that connects students based on location proximity and overlapping free time.

## Features

- **Gravity Map**: Visual map showing clusters of students studying nearby
- **Orbit Status**: Set your study status and get matched with nearby students (within 100m) with similar status
- **Event Horizon**: 15-minute countdown timer for study sessions
- **Profile Management**: Create and manage your profile with subjects and bio

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Firebase (Authentication, Firestore) - Images stored as Base64 in Firestore (free!)
- **Maps**: Leaflet + OpenStreetMap (free, no API key needed)
- **Mobile**: Capacitor (Android)
- **Desktop**: Electron (Windows)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled (Storage not needed)
- No maps API key needed (using free Leaflet + OpenStreetMap)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here  # Optional: for Analytics (free)
```

3. Set up Firebase:

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Google Authentication
   - Create a Firestore database
   - **Note**: No Storage bucket needed - profile images are stored as Base64 strings in Firestore (completely free!)
   - Copy your Firebase config to `.env.local`

4. **Note**: No maps setup needed - using free Leaflet + OpenStreetMap (no API key required!)

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

Build for web:

```bash
npm run build
```

### Electron (Windows Desktop)

Run Electron in development:

```bash
npm run electron:dev
```

Build Electron app:

```bash
npm run electron:build
```

### Capacitor (Android)

Sync Capacitor:

```bash
npm run capacitor:sync
```

Run on Android:

```bash
npm run capacitor:android
```

Build for Android:

```bash
npm run capacitor:build
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── features/         # Feature modules (Map, Profile, etc.)
├── services/         # Firebase and external services
├── stores/           # Zustand state management
├── types/            # TypeScript type definitions
├── utils/            # Helper functions
└── hooks/            # Custom React hooks
```

## Firebase Setup

### Firestore Collections

- `users`: User profiles with location and orbit status
- `collisions`: Active matches between users
- `sessions`: Study sessions

### Security Rules

Set up Firestore security rules to allow authenticated users to read/write their own data and read other users' public data.

### Image Storage

Profile images are stored as Base64 strings directly in Firestore documents - no Storage setup needed!

## License

MIT

