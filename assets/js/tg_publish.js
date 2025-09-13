// tg_publish.js — optional: publish chat id only (no token storage)
(function(){
  if(!window.__LEV_TG_STORE__){
    window.__LEV_TG_STORE__ = {
      saveChat: function(chat){ try{ localStorage.setItem('LEV_TG_CHAT_ID', chat||''); }catch(_){}},
      loadChat: function(){ try{ return localStorage.getItem('LEV_TG_CHAT_ID') || ''; }catch(_){ return ''; } }
    };
  }
  try{
    if(window.LEVENT_TG_CHAT_ID){ __LEV_TG_STORE__.saveChat(window.LEVENT_TG_CHAT_ID); }
  }catch(_){}
})();