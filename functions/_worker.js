const USERNAME = 'emirs';
const PASSWORD = 'bank2026';

export async function onRequest(context) {
  const { request } = context;

  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Basic ')) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Emirs Bank — Authorized Access Only"' },
    });
  }

  let credentials;
  try {
    credentials = atob(auth.slice(6));
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const idx = credentials.indexOf(':');
  if (idx === -1) {
    return new Response('Bad Request', { status: 400 });
  }

  const username = credentials.slice(0, idx);
  const password = credentials.slice(idx + 1);

  if (username !== USERNAME || password !== PASSWORD) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Emirs Bank — Authorized Access Only"' },
    });
  }

  return fetch(request);
}
