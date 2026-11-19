// Real-time timer backend (also used by the Purchase Orders API): production server.
export const TIMER_ORIGIN = 'https://jdpbackend.prorevv.com';
export const TIMER_API_URL = `${TIMER_ORIGIN}/api`;
// Extra headers were only needed for the temporary ngrok tunnel.
export const TIMER_EXTRA_HEADERS = {};

// Backstop polling of GET /timers/active while a timer screen is open
export const TIMER_POLL_MS = 30000;
