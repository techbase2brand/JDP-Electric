import 'react-native-url-polyfill/auto';

// Add WebSocket + EventSource polyfill for React Native
if (typeof global.WebSocket === 'undefined') {
  global.WebSocket = require('react-native/Libraries/WebSocket/WebSocket');
}

// if (typeof global.EventSource === 'undefined') {
//   global.EventSource = require('react-native/Libraries/Network/EventSource');
// }

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ajjhorzzoajbfownxbgo.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqamhvcnp6b2FqYmZvd254YmdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDU0ODAsImV4cCI6MjA5MjAyMTQ4MH0.ri5WPvKzRXSo-0BEu9raYl5U8cPkKOjhVsHIQUn_C8Y';

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
