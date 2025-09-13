(function(){
  window.LEV = window.LEV || {};
  window.LEV.sendTG = async function({text, chat_id, file}){
    const r = await fetch('/.netlify/functions/levtg', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ text, chat_id, file, parse_mode:'HTML' })
    });
    const j = await r.json().catch(()=>({}));
    if(!r.ok || !j.ok) throw new Error(j.error || ('HTTP '+r.status));
    return j;
  };
})();