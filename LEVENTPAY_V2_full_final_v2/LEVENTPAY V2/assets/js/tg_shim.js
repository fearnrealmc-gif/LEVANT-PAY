// tg_shim.js — normalize telegram-notify endpoint (defensive)
(function(){
  try{
    const ENDPOINT = '/.netlify/functions/telegram-notify';
    const _fetch = window.fetch;
    window.fetch = function(input, init){
      try{
        if (typeof input === 'string' && input.includes('/.netlify/functions/telegram-notify')){
          input = ENDPOINT; // strip any extras
          if (!init) init = {};
          if (!init.method) init.method = 'POST';
          if (!init.headers) init.headers = {'Content-Type':'application/json'};
        }
      }catch(_){}
      return _fetch.apply(this, arguments);
    };
  }catch(_){}
})();