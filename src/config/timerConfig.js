// Real-time timer backend.
// Testing: ngrok tunnel. Switch TIMER_ORIGIN to https://jdpbackend.prorevv.com once the
// timer API/socket is deployed to production (then the ngrok headers are not needed).
export const TIMER_ORIGIN = 'https://landed-platypus-subtype.ngrok-free.dev';
export const TIMER_API_URL = `${TIMER_ORIGIN}/api`;
export const TIMER_EXTRA_HEADERS = {'ngrok-skip-browser-warning': '1'};

// Backstop polling of GET /timers/active while a timer screen is open
export const TIMER_POLL_MS = 30000;
