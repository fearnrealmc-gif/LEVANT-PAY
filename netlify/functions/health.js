exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*"
    },
    body: JSON.stringify({ ok: true, time: new Date().toISOString() })
  };
};