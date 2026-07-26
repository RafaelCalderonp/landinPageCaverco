export function checkAuth(request, env) {
  if (!env.ADMIN_USER || !env.ADMIN_PASSWORD) {
    return { ok: false, configured: false };
  }
  const auth = request.headers.get('Authorization') || '';
  const expected = 'Basic ' + btoa(`${env.ADMIN_USER}:${env.ADMIN_PASSWORD}`);
  return { ok: auth === expected, configured: true };
}

export function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
