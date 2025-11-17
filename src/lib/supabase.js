import 'react-native-url-polyfill/auto';

// Add WebSocket + EventSource polyfill for React Native
if (typeof global.WebSocket === 'undefined') {
  global.WebSocket = require('react-native/Libraries/WebSocket/WebSocket');
}

// if (typeof global.EventSource === 'undefined') {
//   global.EventSource = require('react-native/Libraries/Network/EventSource');
// }

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://buluqwfuujaiaxmqqpxa.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1bHVxd2Z1dWphaWF4bXFxcHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzkzMDcsImV4cCI6MjA3ODY1NTMwN30.2OHMkkbkqnWPDZX_-zsOp9vfkX-UOzj5UmJ8tKfxXrI';

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
