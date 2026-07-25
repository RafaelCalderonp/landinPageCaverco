// Caverco Partners — comportamiento compartido del sitio

document.addEventListener('DOMContentLoaded', () => {
  // Menú móvil
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Año dinámico en el footer
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Formulario de contacto
  const form = document.getElementById('contact-form');
  if (form) {
    const status = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Honeypot anti-spam: si el campo oculto viene lleno, se descarta silenciosamente
      const honeypot = form.querySelector('input[name="website"]');
      if (honeypot && honeypot.value) return;

      const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        message: form.message.value.trim(),
        website: honeypot ? honeypot.value : '',
      };

      if (!payload.name || !payload.email || !payload.message) {
        showStatus(status, 'error', 'Por favor completa los campos requeridos.');
        return;
      }

      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.ok) {
          showStatus(status, 'success', 'Gracias, tu mensaje fue enviado. Te contactaremos a la brevedad.');
          form.reset();
        } else {
          showStatus(status, 'error', data.error || 'No pudimos enviar tu mensaje. Intenta nuevamente.');
        }
      } catch (err) {
        showStatus(status, 'error', 'Error de conexión. Intenta nuevamente o escríbenos por WhatsApp.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
});

function showStatus(el, type, message) {
  if (!el) return;
  el.textContent = message;
  el.classList.remove('success', 'error', 'show');
  el.classList.add(type, 'show');
}
