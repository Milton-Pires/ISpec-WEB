// ═══════════════════════════════════════
// iSpec – Main Page Scripts
// ═══════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── Sidebar toggle ──────────────────────
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');

  function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    overlay.classList.toggle('hidden');
  }

  function closeSidebar() {
    sidebar.classList.remove('collapsed');
    overlay.classList.add('hidden');
  }

  toggleBtn?.addEventListener('click', toggleSidebar);
  overlay?.addEventListener('click', closeSidebar);

  // ── Date display ────────────────────────
  const dateElement = document.getElementById('topbar-date');
  if (dateElement) {
    const now = new Date();
    const options = { day: 'numeric', month: 'short' };
    dateElement.textContent = now.toLocaleDateString('pt-BR', options);
  }

  // ── Progress bars animation ────────────
  const progressBars = document.querySelectorAll('.progress-fill');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.getAttribute('data-target');
        entry.target.style.width = target + '%';
      }
    });
  }, observerOptions);

  progressBars.forEach(bar => progressObserver.observe(bar));

  // ── Card animations ────────────────────
  const cards = document.querySelectorAll('.card-anim');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.animation = 'fadeUp 0.6s ease-out forwards';
        }, index * 100);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => cardObserver.observe(card));

  // ── Module cards hover effect ──────────
  const moduleCards = document.querySelectorAll('.module-card');
  moduleCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.module-icon-wrap').style.backgroundColor = '#8B0012';
      card.querySelector('.module-icon-wrap svg').style.stroke = 'white';
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('.module-icon-wrap').style.backgroundColor = '';
      card.querySelector('.module-icon-wrap svg').style.stroke = '#8B0012';
    });
  });

  // ── Search functionality ───────────────
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      searchInput.style.backgroundColor = 'white';
      searchInput.style.boxShadow = '0 0 0 3px rgba(139, 0, 18, 0.1)';
    });
    searchInput.addEventListener('blur', () => {
      searchInput.style.backgroundColor = '';
      searchInput.style.boxShadow = '';
    });
  }

});