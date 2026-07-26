function unauthorized() {
  return new Response('Autenticación requerida.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Caverco Partners - Panel de contactos"' },
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!env.ADMIN_USER || !env.ADMIN_PASSWORD) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Panel no configurado: faltan credenciales de administrador.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const auth = request.headers.get('Authorization') || '';
  const expected = 'Basic ' + btoa(`${env.ADMIN_USER}:${env.ADMIN_PASSWORD}`);
  if (auth !== expected) {
    return unauthorized();
  }

  try {
    const { results } = await env.DB.prepare(
      'SELECT id, name, email, phone, message, created_at FROM contacts ORDER BY created_at DESC'
    ).all();
    return new Response(JSON.stringify({ ok: true, contacts: results }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: 'No se pudo leer la base de datos.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
