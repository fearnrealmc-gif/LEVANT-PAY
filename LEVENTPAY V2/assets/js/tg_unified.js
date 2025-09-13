// tg_unified.js — unified helpers for Telegram sending via Netlify Function
(function(){
  const ENDPOINT = '/.netlify/functions/telegram-notify';

  async function postJSON(url, data){
    const r = await fetch(url, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data||{})
    });
    const ct = (r.headers.get('content-type')||'').toLowerCase();
    const j = ct.includes('application/json') ? await r.json() : { ok:false, html: await r.text(), status: r.status };
    if(!r.ok || !j.ok) throw new Error(j.error || ('HTTP '+r.status));
    return j;
  }

  window.currentChatId = function(){
    try{
      return (window.LEVENT_TG_CHAT_ID || (window.__LEV_TG_STORE__ && __LEV_TG_STORE__.loadChat()) || '').trim();
    }catch(_){ return ''; }
  };

  window.sendTG = async function(text, chatId){
    const chat = (chatId || window.currentChatId());
    if(!chat) throw new Error('Missing chat_id');
    return await postJSON(ENDPOINT, { chat_id: chat, text: (text||'').toString().slice(0,4096), parse_mode:'HTML' });
  };

  window.fileToDataUrl = async function(file){
    if(!file) return null;
    return await new Promise((resolve, reject)=>{
      const fr = new FileReader();
      fr.onerror = ()=>reject(new Error('file read error'));
      fr.onload = ()=>resolve(fr.result);
      fr.readAsDataURL(file);
    });
  };

  window.sendDeposit = async function(opts){
    const q = (id)=>document.getElementById(id);
    const name  = (opts?.name)  || (q('fullName')?.value||'').trim();
    const phone = (opts?.phone) || (q('phone')?.value||'').trim();
    const pp    = (opts?.pp)    || (q('ppAccount')?.value||'').trim();
    const amt   = (opts?.amt)   || (q('amount')?.value||'').trim();
    const file  = (opts?.file)  || (q('depReceipt')?.files?.[0]||null);

    if(!name || !phone || !pp || !amt) throw new Error('يرجى تعبئة جميع الحقول');

    const text = [
      '📨 طلب إيداع جديد',
      '👤 الاسم: ' + name,
      '📞 هاتف: ' + phone,
      '💳 PayPal: ' + pp,
      '💲 المبلغ: ' + amt,
      file ? '📎 إيصال: مرفق' : null
    ].filter(Boolean).join('\\n');

    const payload = { chat_id: window.currentChatId(), text, parse_mode:'HTML' };
    if(!payload.chat_id) throw new Error('لا يوجد Chat ID — احفظه من settings.html');

    if(file){
      payload.file = {
        name: file.name,
        type: file.type || 'application/octet-stream',
        dataUrl: await window.fileToDataUrl(file),
        mode: 'document'
      };
    }
    return await postJSON(ENDPOINT, payload);
  };

  window.sendShamCash = async function(form){
    const f = form || document.getElementById('shamcashForm') || document.forms.shamcashForm;
    const name  = (f?.name?.value || '').trim();
    const phone = (f?.phone?.value || '').trim();
    const amount= (f?.amount?.value|| '').trim();
    const note  = (f?.note?.value  || '').trim();
    const text = [
      '💸 طلب شام كاش',
      '👤 الاسم: ' + name,
      '📞 الهاتف: ' + phone,
      '💰 المبلغ: ' + amount,
      note ? ('📝 ملاحظة: ' + note) : null
    ].filter(Boolean).join('\\n');
    return await window.sendTG(text);
  };

  window.sendSyriatel = async function(form){
    const f = form || document.getElementById('syriatelForm') || document.forms.syriatelForm;
    const name  = (f?.name?.value || '').trim();
    const phone = (f?.phone?.value || '').trim();
    const amount= (f?.amount?.value|| '').trim();
    const note  = (f?.note?.value  || '').trim();
    const text = [
      '⚡️ طلب سيريتل كاش',
      '👤 الاسم: ' + name,
      '📞 الهاتف: ' + phone,
      '💰 المبلغ: ' + amount,
      note ? ('📝 ملاحظة: ' + note) : null
    ].filter(Boolean).join('\\n');
    return await window.sendTG(text);
  };
})();