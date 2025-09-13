// tg_bridge.js — Clean bridge: client → Netlify Function (no token on client)
(function(){
  if (window.tgSendMessage) return;
  async function postJSON(url, data){
    const r = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data || {})
    });
    const ct = (r.headers.get('content-type')||'').toLowerCase();
    const j = ct.includes('application/json') ? await r.json() : { ok:false, html: await r.text(), status:r.status };
    if(!r.ok || !j.ok) throw new Error(j.error || "Telegram send failed");
    return j;
  }
  window.tgSendMessage = async function(text, chatId){
    return postJSON('/.netlify/functions/telegram-notify', { text, chat_id: chatId });
  };
})();