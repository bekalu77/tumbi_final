import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.tumbi.final',
  appName: 'Tumbi',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'tumbi-backend.bekalu77.workers.dev',
      'ep-late-sea-a4cd0akc-pooler.us-east-1.aws.neon.tech'
    ]
  }
};

export default config;
