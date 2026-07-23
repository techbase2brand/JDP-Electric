import 'react-native-url-polyfill/auto';

// Add WebSocket + EventSource polyfill for React Native
if (typeof global.WebSocket === 'undefined') {
  global.WebSocket = require('react-native/Libraries/WebSocket/WebSocket');
}

// if (typeof global.EventSource === 'undefined') {
//   global.EventSource = require('react-native/Libraries/Network/EventSource');
// }

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkphkaswwihndprhlsfh.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrcGhrYXN3d2lobmRwcmhsc2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5OTg1OTMsImV4cCI6MjA5OTU3NDU5M30.zH-ceC5KyFRTQAekCisNN9wCIKBb2z7rL-fY4A8R5xc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: { schema: 'public' },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});
