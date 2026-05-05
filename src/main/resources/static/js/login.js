/* ═══════════════════════════════════════
   iSpec – Login Page Scripts
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Toggle senha visível/oculta ─────────────────
  const toggleBtn = document.getElementById('toggle-pass');
  const passInput = document.getElementById('password');
  const eyeIcon   = document.getElementById('eye-icon');

  toggleBtn.addEventListener('click', () => {
    const isHidden = passInput.type === 'password';
    passInput.type = isHidden ? 'text' : 'password';

    eyeIcon.innerHTML = isHidden
        ? `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8
                 a18.45 18.45 0 015.06-5.94"/>
         <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8
                 a18.5 18.5 0 01-2.16 3.19"/>
         <line x1="1" y1="1" x2="23" y2="23"/>`
        : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
         <circle cx="12" cy="12" r="3"/>`;
  });

  // ── Login form ──────────────────────────────────
  const loginForm = document.getElementById('login-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText   = document.getElementById('btn-text');
  const btnArrow  = document.getElementById('btn-arrow');
  const btnSpin   = document.getElementById('btn-spin');
  const errMsg    = document.getElementById('error-msg');
  const errText   = document.getElementById('error-text');

  function showError(msg) {
    errText.textContent = msg;
    errMsg.classList.remove('hidden');
  }

  function setLoading(on) {
    submitBtn.disabled = on;
    btnText.textContent = on ? 'Entrando...' : 'Entrar';
    btnArrow.classList.toggle('hidden', on);
    btnSpin.classList.toggle('hidden', !on);
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errMsg.classList.add('hidden');

    const email    = document.getElementById('email').value.trim();
    const password = passInput.value;

    if (!email) {
      showError('Por favor, informe seu e-mail.');
      document.getElementById('email').focus();
      return;
    }
    if (!password) {
      showError('Por favor, informe sua senha.');
      passInput.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password })
      });

      const data = await response.text();

      if (response.ok) {
        localStorage.setItem('token', data);
        window.location.href = 'main.html';
      } else {
        showError(data);
      }
    } catch (err) {
      showError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  });

});