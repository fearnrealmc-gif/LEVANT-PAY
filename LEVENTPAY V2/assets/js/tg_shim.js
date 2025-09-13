// tg_shim.js — normalize telegram-notify endpoint calls (defensive)
(function(){
  try{
    const ENDPOINT = '/.netlify/functions/telegram-notify';
    const _fetch = window.fetch;
    window.fetch = function(input, init){
      try{
        if (typeof input === 'string' && input.includes('/.netlify/functions/telegram-notify')){
          // If someone appended token or /sendMessage, strip extras.
          // Examples seen: '/.netlify/functions/telegram-notify'
          var clean = input.split('/.netlify/functions/telegram-notify')[0] + ENDPOINT;
          input = clean;
          // Ensure method defaults to POST JSON if not set (common for our use case)
          if (!init) init = {};
          if (!init.method) init.method = 'POST';
          if (init.headers && typeof init.headers === 'object'){
            // keep user headers
          }else{
            init.headers = {'Content-Type':'application/json'};
          }
        }
      }catch(_){}
      return _fetch.apply(this, arguments);
    };
  }catch(_){}
})();