import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.gravitystudy.app',
  appName: 'Gravity Study',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Geolocation: {
      permissions: {
        location: {
          description: 'This app needs access to your location to show nearby study partners.',
        },
      },
    },
    Camera: {
      permissions: {
        camera: {
          description: 'This app needs access to your camera to upload profile pictures.',
        },
      },
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '54480158682-p9jh7jamp4275sd07nilgodd4hajjmq5.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
}

export default config

