# LEVENT Pay — Locked Build

- Endpoint is fixed to `/.netlify/functions/telegram-notify` (POST JSON).
- Any legacy '/sendMessage' or token-appended calls are normalized/removed.
- Service Worker cache bumped to `1757749380` to force clients to fetch latest JS.
- Functions are CommonJS (exports.handler).

## Netlify settings
Publish dir: `LEVENTPAY V2`  
Functions dir: `netlify/functions`

Env vars:
- `TELEGRAM_BOT_TOKEN` (required)
- `TELEGRAM_CHAT_ID` (optional)
- `ALLOWED_ORIGINS` (optional)

## Quick Test
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"text":"LEVANT locked ✅","chat_id":"<CHAT_ID>"}' \
  https://YOUR-SITE.netlify.app/.netlify/functions/telegram-notify