const STORAGE_KEY = 'spieleabend-data';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/data') {
      if (request.method === 'GET') {
        const data = await env.SPIELE_KV.get(STORAGE_KEY);
        return new Response(data || '{}', {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });
      }
      if (request.method === 'POST') {
        let body;
        try {
          body = await request.text();
          JSON.parse(body);
        } catch (e) {
          return new Response(JSON.stringify({ ok: false, error: 'invalid json' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        await env.SPIELE_KV.put(STORAGE_KEY, body);
        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response('Method not allowed', { status: 405 });
    }

    // Alle anderen Anfragen: statische Dateien ausliefern (index.html etc.)
    return env.ASSETS.fetch(request);
  }
};
