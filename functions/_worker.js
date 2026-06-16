const OLD_DOMAINS = ['emirs-banking.com', 'www.emirs-banking.com'];
const NEW_DOMAIN = 'www.ameris-economy.com';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  if (OLD_DOMAINS.includes(url.hostname)) {
    url.hostname = NEW_DOMAIN;
    return Response.redirect(url.toString(), 301);
  }

  const response = await context.next();

  const headers = new Headers(response.headers);
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}