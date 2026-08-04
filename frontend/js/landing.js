/* ═══════════════════════════════════════
   iSpec – Landing Page Scripts
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Hamburger menu ──────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });


  // ── Contact form ────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = document.getElementById('form-btn');
      btn.textContent = '✅ Mensagem enviada!';
      btn.classList.replace('bg-brand-red', 'bg-brand-green');
      setTimeout(() => {
        btn.textContent = 'Enviar Mensagem';
        btn.classList.replace('bg-brand-green', 'bg-brand-red');
        contactForm.reset();
      }, 3000);
    });
  }


  // ── Scroll reveal ───────────────────────────────
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

});
