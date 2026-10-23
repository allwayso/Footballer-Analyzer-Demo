const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Duplicate each strip once so the last card meets the first without a jump.
document.querySelectorAll('.film-row').forEach(row => {
  const set = row.querySelector('.film-set');
  const duplicate = set.cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  row.append(duplicate);
  const measure = () => row.style.setProperty('--film-width', `${set.getBoundingClientRect().width + parseFloat(getComputedStyle(row).gap)}px`);
  new ResizeObserver(measure).observe(set);
  measure();
});

const visibility = new Map();
function syncVideo(video, visible) {
  if (visible && !motion.matches && !document.hidden) {
    if (!video.src) video.src = video.dataset.src;
    video.play().catch(() => { /* A poster remains visible when autoplay is unavailable. */ });
  } else video.pause();
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(({target, isIntersecting}) => {
    visibility.set(target, isIntersecting);
    syncVideo(target, isIntersecting);
  });
}, {threshold: 0.08});
document.querySelectorAll('video[data-src]').forEach(video => observer.observe(video));
function syncMotion() {
  visibility.forEach((visible, video) => syncVideo(video, visible));
  document.querySelectorAll('.film-row').forEach(row => row.style.animationPlayState = document.hidden || motion.matches ? 'paused' : 'running');
}
motion.addEventListener('change', syncMotion);
document.addEventListener('visibilitychange', syncMotion);
