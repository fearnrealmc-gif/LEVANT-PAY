// Netlify Function (CJS): telegram-notify
// Env:
//   TELEGRAM_BOT_TOKEN (required)
//   TELEGRAM_CHAT_ID   (optional default)
//   ALLOWED_ORIGINS    (optional CSV allowlist)

exports.handler = async (event) => {
  const cors = (status, bodyObj) => {
    const allowed = process.env.ALLOWED_ORIGINS;
    const origin = event.headers?.origin || "*";
    const isAllowed = !allowed || allowed.split(",").map(s=>s.trim()).includes(origin);
    return {
      statusCode: status,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "access-control-allow-origin": isAllowed ? origin : "null",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type, authorization",
        "vary": "Origin"
      },
      body: JSON.stringify(bodyObj)
    };
  };

  if (event.httpMethod === "OPTIONS") return cors(204, { ok: true });
  if (event.httpMethod !== "POST")   return cors(405, { ok: false, error: "Method Not Allowed" });

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (!TOKEN) return cors(500, { ok: false, error: "Missing TELEGRAM_BOT_TOKEN env var" });

  let payload = {};
  try { payload = JSON.parse(event.body || "{}"); }
  catch { return cors(400, { ok: false, error: "Invalid JSON" }); }

  const text = (payload.text || "").toString().slice(0, 4096);
  const chatId = (payload.chat_id || process.env.TELEGRAM_CHAT_ID || "").toString();
  const parseMode = (payload.parse_mode || "HTML");
  const disablePreview = payload.disable_web_page_preview ?? true;
  const file = payload.file;

  if (!text)   return cors(400, { ok: false, error: "Missing 'text' field" });
  if (!chatId) return cors(400, { ok: false, error: "Missing 'chat_id' (and no TELEGRAM_CHAT_ID default)" });

  try {
    // If there's a file, send as document/photo
    if (file && file.dataUrl) {
      const m = String(file.dataUrl).split(',');
      if (m.length < 2) throw new Error("Invalid dataUrl");
      const meta = m[0];
      const b64 = m[1];
      const mime = (file.type || (meta.match(/^data:(.*?);base64$/)?.[1]) || 'application/octet-stream');
      const bin = Buffer.from(b64, 'base64');
      const blob = new Blob([bin], { type: mime });

      const form = new FormData();
      form.append('chat_id', chatId);
      form.append('caption', text);
      form.append('parse_mode', parseMode);

      const field = (file.mode === 'photo') ? 'photo' : 'document';
      form.append(field, blob, file.name || (field + '.bin'));

      const sendUrl = `https://api.telegram.org/bot${TOKEN}/send${field === 'photo' ? 'Photo' : 'Document'}`;
      const tgRes = await fetch(sendUrl, { method: 'POST', body: form });
      const data = await tgRes.json();
      if (!data.ok) return cors(502, { ok: false, error: "Telegram API error", details: data });
      return cors(200, { ok: true, result: data.result });
    }

    // Fallback: sendMessage
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
        disable_web_page_preview: disablePreview
      })
    });
    const data = await tgRes.json();
    if (!data.ok) return cors(502, { ok: false, error: "Telegram API error", details: data });
    return cors(200, { ok: true, result: data.result });
  } catch (err) {
    return cors(500, { ok: false, error: err.message || String(err) });
  }
};