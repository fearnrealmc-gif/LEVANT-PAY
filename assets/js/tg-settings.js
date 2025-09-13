(function(){
  const $ = (id)=>document.getElementById(id);
  function say(msg, ok){
    const el = $("tgStatus");
    if(!el) return;
    el.textContent = msg;
    el.style.color = ok ? "#22c55e" : "#ef4444";
  }
  function loadChat(){ try{ return (window.__LEV_TG_STORE__ && __LEV_TG_STORE__.loadChat()) || window.LEVENT_TG_CHAT_ID || ""; }catch(_){ return ""; } }
  function saveChat(v){ try{ if(window.__LEV_TG_STORE__) window.__LEV_TG_STORE__.saveChat((v||"").trim()); }catch(_){ } }

  document.addEventListener("DOMContentLoaded", () => {
    const chatInput = $("chatIdInput");
    const testText = $("testTextInput");
    if (chatInput) chatInput.value = loadChat();

    const btnSave = $("btnSaveChat");
    const btnSend = $("btnSendTest");
    const btnHealth = $("btnHealth");
    const btnClear = $("btnClear");

    if(btnSave){
      btnSave.onclick = function(){
        const v = (chatInput && chatInput.value || "").trim();
        if(!v) return say("الرجاء إدخال Chat ID", false);
        saveChat(v);
        say("تم الحفظ ✅", true);
      };
    }

    if(btnClear){
      btnClear.onclick = function(){
        try{ localStorage.removeItem("LEV_TG_CHAT_ID"); }catch(_){}
        if(chatInput) chatInput.value = "";
        say("تم مسح التخزين المحلي ✅", true);
      };
    }

    if(btnHealth){
      btnHealth.onclick = async function(){
        try{
          const r = await fetch('/.netlify/functions/health');
          const ct = (r.headers.get('content-type')||'').toLowerCase();
          const j = ct.includes('application/json') ? await r.json() : { ok:false, html: await r.text(), status: r.status };
          say("Health: " + (j.ok? JSON.stringify(j): ("status="+j.status+" | not JSON")), !!j.ok);
        }catch(e){
          say("Health failed: " + (e.message||e), false);
        }
      };
    }

    if(btnSend){
      btnSend.onclick = async function(){
        try{
          const chat = (chatInput && chatInput.value.trim()) || loadChat();
          if(!chat) return say("لا يوجد Chat ID — احفظه أولًا", false);
          const text = (testText && testText.value) || "اختبار ✅";
          const r = await fetch('/.netlify/functions/telegram-notify', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ chat_id: chat, text: text, parse_mode: 'HTML' })
          });
          const j = await r.json().catch(()=>({}));
          if(!r.ok || !j.ok) throw new Error(j.error || "فشل الإرسال");
          say("تم الإرسال ✔️ " + (j.result && j.result.message_id ? ("msg_id="+j.result.message_id) : ""), true);
        }catch(e){
          say("خطأ: " + (e.message||e), false);
        }
      };
    }
  });
})();