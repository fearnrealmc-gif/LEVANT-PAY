
# Telegram Hardened Setup

1) **Environment (Netlify → Site settings → Environment):**
   - TELEGRAM_BOT_TOKEN  (required)
   - TELEGRAM_CHAT_ID    (optional default)
   - ALLOWED_ORIGINS     (optional CSV, e.g. https://your-site.netlify.app)

2) **Deploy via GitHub or Netlify CLI** (Drag&Drop alone won't publish functions).

3) **Redirects**
   - Added `LEVENTPAY V2/_redirects` to rewrite any broken URL like
     `/.netlify/functions/telegram-notifyREDACTED/sendMessage` → `/.netlify/functions/levtg`

4) **Client usage**
   ```html
   <script src="assets/js/levtg_helper.js"></script>
   <script>
     LEV.sendTG({ text: 'Hello ✅' /*, chat_id: '-100xxxx' (optional)*/ }).then(console.log);
   </script>
   ```

5) **Health test**
   Send from console:
   ```js
   fetch('/.netlify/functions/levtg',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:'Ping ✅',chat_id:'-100...'})}).then(r=>r.json()).then(console.log)
   ```
