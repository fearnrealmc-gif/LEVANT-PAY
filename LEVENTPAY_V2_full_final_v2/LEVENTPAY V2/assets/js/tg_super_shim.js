// tg_super_shim.js — strongest normalization for Telegram endpoint (load FIRST in <head>)
(function(){
  try{
    var ENDPOINT = '/.netlify/functions/telegram-notify';
    function isBad(u){
      return typeof u === 'string' && u.indexOf('/.netlify/functions/telegram-notify') !== -1 && u !== ENDPOINT;
    }
    function normalize(u){
      return ENDPOINT;
    }
    // Global endpoint + benign token/ensureAPI for legacy code
    try { window.TG_ENDPOINT = ENDPOINT; } catch(_){}
    try { window.ensureAPI = function(){ return ENDPOINT; }; } catch(_){}
    try {
      Object.defineProperty(window, 'token', {
        get(){ return ''; },
        set(v){ /* ignore */ },
        configurable: true
      });
    } catch(_){}

    // Patch fetch
    var _fetch = window.fetch;
    window.fetch = function(input, init){
      try{
        if (typeof input === 'string' && isBad(input)){
          console.warn('[tg_shim] normalized fetch URL ->', input, '=>', ENDPOINT);
          input = normalize(input);
        } else if (input && input.url && isBad(input.url)) {
          console.warn('[tg_shim] normalized Request.url ->', input.url, '=>', ENDPOINT);
          input = new Request(normalize(input.url), input);
        }
      }catch(e){}
      return _fetch.apply(this, arguments);
    };

    // Patch Request constructor (best-effort)
    try {
      var _Request = window.Request;
      window.Request = function(input, init){
        if (typeof input === 'string' && isBad(input)) {
          input = normalize(input);
        } else if (input && input.url && isBad(input.url)) {
          input = new _Request(normalize(input.url), input);
        }
        return new _Request(input, init);
      };
      window.Request.prototype = _Request.prototype;
    } catch(_){}

    // Patch XHR open
    try {
      var _open = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url){
        if (isBad(url)) {
          console.warn('[tg_shim] normalized XHR URL ->', url, '=>', ENDPOINT);
          url = normalize(url);
        }
        return _open.apply(this, arguments);
      };
    } catch(_){}

  }catch(e){
    console.error('[tg_super_shim] error', e);
  }
})();