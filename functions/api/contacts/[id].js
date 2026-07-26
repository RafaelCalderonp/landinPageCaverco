import { checkAuth, jsonResponse } from '../../_shared/auth.js';

export async function onRequestDelete(context) {
  const { request, env, params } = context;

  const auth = checkAuth(request, env);
  if (!auth.configured) {
    return jsonResponse({ ok: false, error: 'Panel no configurado: faltan credenciales de administrador.' }, 500);
  }
  if (!auth.ok) {
    return jsonResponse({ ok: false, error: 'Usuario o contraseña incorrectos.' }, 401);
  }

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return jsonResponse({ ok: false, error: 'ID inválido.' }, 400);
  }

  try {
    await env.DB.prepare('DELETE FROM contacts WHERE id = ?').bind(id).run();
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: 'No se pudo eliminar el contacto.' }, 500);
  }
}
