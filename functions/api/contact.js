const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch (err) {
    return jsonResponse({ ok: false, error: 'Solicitud inválida.' }, 400);
  }

  // Honeypot: los bots suelen rellenar todos los campos, incluido este que está oculto.
  if (data.website) {
    return jsonResponse({ ok: true });
  }

  const name = (data.name || '').toString().trim().slice(0, 200);
  const email = (data.email || '').toString().trim().slice(0, 200);
  const phone = (data.phone || '').toString().trim().slice(0, 50);
  const message = (data.message || '').toString().trim().slice(0, 4000);

  if (!name || !email || !message) {
    return jsonResponse({ ok: false, error: 'Faltan campos requeridos.' }, 400);
  }
  if (!EMAIL_REGEX.test(email)) {
    return jsonResponse({ ok: false, error: 'El correo electrónico no es válido.' }, 400);
  }

  try {
    await env.DB.prepare(
      'INSERT INTO contacts (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, ?)'
    )
      .bind(name, email, phone || null, message, new Date().toISOString())
      .run();
  } catch (err) {
    return jsonResponse({ ok: false, error: 'No pudimos guardar tu mensaje. Intenta nuevamente.' }, 500);
  }

  return jsonResponse({ ok: true });
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
