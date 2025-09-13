LEVENT Pay — Full Final Build
=============================
- All Telegram calls are routed to '/.netlify/functions/telegram-notify' (POST JSON only).
- No token in client. Provide TELEGRAM_BOT_TOKEN in Netlify Environment variables.
- Functions are CommonJS (exports.handler).
- Shim prevents any accidental '/sendMessage' or token appending to the endpoint.
- 'tg_unified.js' provides helpers for Deposit / ShamCash / Syriatel.

Netlify:
- Publish dir: 'LEVENTPAY V2'
- Functions dir: 'netlify/functions'

Env vars:
- TELEGRAM_BOT_TOKEN (required)
- TELEGRAM_CHAT_ID   (optional)
- ALLOWED_ORIGINS    (optional)

After deploy:
1) Open /.netlify/functions/health → should return JSON ok:true
2) Open /settings.html → Save Chat ID → Health → Send test
3) Your pages should call sendDeposit/sendShamCash/sendSyriatel or sendTG().