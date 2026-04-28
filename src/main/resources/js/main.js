// ══════════════ DATE DISPLAY ══════════════
const currentDate = new Date();
document.getElementById('topbar-date').textContent =
  currentDate.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });

// ══════════════ SIDEBAR TOGGLE ══════════════
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
let isMobile = window.innerWidth < 1024;

function toggleSidebar() {
  if (isMobile) {
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('show');
  } else {
    sidebar.classList.toggle('collapsed');
  }
}

function closeSidebar() {
  sidebar.classList.remove('mobile-open');
  overlay.classList.remove('show');
}

window.addEventListener('resize', () => {
  isMobile = window.innerWidth < 1024;
  if (!isMobile) {
    overlay.classList.remove('show');
    sidebar.classList.remove('mobile-open');
  }
});

// ══════════════ PROGRESS BARS ANIMATION ══════════════
setTimeout(() => {
  document.querySelectorAll('.progress-fill').forEach(bar => {
    bar.style.width = bar.dataset.target + '%';
  });
}, 400);

// ══════════════ MODULE CARD CLICK EFFECT ══════════════
document.querySelectorAll('.module-card').forEach(card => {
  card.addEventListener('click', function () {
    this.style.transform = 'scale(.96)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
  });
});
