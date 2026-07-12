const OLD_DOMAINS = ['emirs-banking.com', 'www.emirs-banking.com', 'ameris-economy.com', 'www.ameris-economy.com', 'amerisglobal.online'];
const NEW_DOMAIN = 'www.amerisglobal.online';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  if (OLD_DOMAINS.includes(url.hostname)) {
    url.hostname = NEW_DOMAIN;
    return Response.redirect(url.toString(), 301);
  }

  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';

  const headers = new Headers(response.headers);
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (contentType.includes('javascript') || contentType.includes('x-javascript')) {
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}