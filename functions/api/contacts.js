import { checkAuth, jsonResponse } from '../_shared/auth.js';

export async function onRequestGet(context) {
  const { request, env } = context;

  const auth = checkAuth(request, env);
  if (!auth.configured) {
    return jsonResponse({ ok: false, error: 'Panel no configurado: faltan credenciales de administrador.' }, 500);
  }
  if (!auth.ok) {
    return jsonResponse({ ok: false, error: 'Usuario o contraseña incorrectos.' }, 401);
  }

  try {
    const { results } = await env.DB.prepare(
      'SELECT id, name, email, phone, message, created_at FROM contacts ORDER BY created_at DESC'
    ).all();
    return jsonResponse({ ok: true, contacts: results });
  } catch (err) {
    return jsonResponse({ ok: false, error: 'No se pudo leer la base de datos.' }, 500);
  }
}
