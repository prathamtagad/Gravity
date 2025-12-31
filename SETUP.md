# Gravity Study - Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase and Google Maps API keys

3. **Set Up Firebase**
   - Create a Firebase project
   - Enable Google Authentication
   - Create Firestore database
   - **Note**: No Storage bucket needed - images are stored as Base64 in Firestore (free!)
   - Copy config to `.env.local`

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Firebase Configuration

### Firestore Collections Structure

**users** collection:
```typescript
{
  id: string
  email: string
  displayName: string
  photoURL?: string
  bio?: string
  subjects: string[]
  location?: {
    latitude: number
    longitude: number
    timestamp: number
  }
  orbitStatus?: string
  createdAt: number
  updatedAt: number
}
```

**collisions** collection:
```typescript
{
  id: string
  userId1: string
  userId2: string
  user1Profile: UserProfile
  user2Profile: UserProfile
  status: 'active' | 'expired' | 'completed'
  createdAt: number
  expiresAt: number
  matchedStatus: string
}
```

**sessions** collection:
```typescript
{
  id: string
  collisionId: string
  participants: string[]
  startTime: number
  endTime?: number
  duration: number
}
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Collisions collection
    match /collisions/{collisionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.userId1 == request.auth.uid || 
         resource.data.userId2 == request.auth.uid);
    }
    
    // Sessions collection
    match /sessions/{sessionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Image Storage

**Profile images are stored as Base64 strings directly in Firestore documents.**

- No Storage bucket setup needed
- Images are automatically resized to max 800px and compressed to ~85% quality
- Maximum image size: 1MB (automatically resized if larger)
- Images stored in the `photoURL` field as data URIs (e.g., `data:image/jpeg;base64,...`)

**Benefits:**
- ✅ Completely free (no Firebase Storage subscription)
- ✅ No additional service setup required
- ✅ Works offline with Firestore persistence
- ✅ Simple implementation

## Maps Setup

**No setup needed!** The app uses Leaflet + OpenStreetMap, which is completely free and requires no API key.

- ✅ Free and open-source
- ✅ No API key required
- ✅ No billing or credit card needed
- ✅ Uses OpenStreetMap tiles (community-maintained)
- ✅ Same features as Google Maps (markers, clustering, popups)

## Building for Production

### Web
```bash
npm run build
```
Output: `dist/` directory

### Electron (Windows)
```bash
npm run electron:build
```
Output: `dist-electron/` directory with `.exe` installer

### Capacitor (Android)
```bash
npm run build
npm run capacitor:sync
npm run capacitor:android
```

## Troubleshooting

### Location not working
- Ensure HTTPS (required for geolocation in production)
- Check browser permissions
- For development, use `http://localhost` (allowed exception)

### Firebase errors
- Verify all environment variables are set (no Storage bucket needed)
- Check Firebase project settings
- Ensure Firestore is enabled (Storage is not needed)

### Maps not loading
- Check internet connection (maps load from OpenStreetMap servers)
- Verify Leaflet CSS is imported (should be automatic)
- Check browser console for any errors

## Project Structure

```
gravity-study/
├── electron/              # Electron main process files
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── features/          # Feature modules
│   │   ├── Auth/          # Authentication
│   │   ├── GravityMap/    # Main map view
│   │   ├── OrbitStatus/   # Status system
│   │   ├── EventHorizon/  # Timer component
│   │   ├── Profile/       # User profile
│   │   └── CollisionView/ # Collision/session view
│   ├── services/          # Firebase services
│   ├── stores/            # Zustand state management
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── hooks/             # Custom React hooks
├── .env.example           # Environment template
├── package.json
├── vite.config.ts
└── README.md
```

