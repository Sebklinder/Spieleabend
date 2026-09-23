// Cloudflare Pages Function: /api/data
// Speichert und lädt den kompletten Spielstand (alle localStorage-Werte
// der Spieleabend-App) als ein JSON-Objekt in Cloudflare KV.
//
// Benötigt eine KV-Namespace-Bindung mit dem Namen SPIELE_KV
// (in Cloudflare Pages -> Settings -> Functions -> KV namespace bindings).

const STORAGE_KEY = 'spieleabend-data';

export async function onRequestGet({ env }) {
  const data = await env.SPIELE_KV.get(STORAGE_KEY);
  return new Response(data || '{}', {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.text();
    JSON.parse(body); // Validierung: muss gültiges JSON sein
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
