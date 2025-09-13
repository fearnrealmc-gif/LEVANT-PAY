LEVENT Pay — Patch Only
=======================

انسخ هذه الملفات فوق مشروعك، بالمسارات نفسها:

- netlify.toml
- netlify/functions/health.js
- netlify/functions/telegram-notify.js
- LEVENTPAY V2/assets/js/tg_shim.js
- LEVENTPAY V2/assets/js/tg_bridge.js
- LEVENTPAY V2/assets/js/tg_publish.js
- LEVENTPAY V2/assets/js/tg_unified.js

ملاحظات:
- تأكد من إضافة متغير البيئة TELEGRAM_BOT_TOKEN على Netlify ثم إعادة النشر.
- في صفحات شام كاش/سيريتل/إيداع، حمّل السكربتات التالية داخل <head> قبل أي سكربت يرسل:
    <script src="assets/js/tg_shim.js?v=4"></script>
    <script src="assets/js/tg_bridge.js?v=4"></script>
    <script src="assets/js/tg_publish.js?v=4"></script>
    <script src="assets/js/tg_unified.js?v=4"></script>
- استخدم الدوال: sendTG / sendDeposit / sendShamCash / sendSyriatel