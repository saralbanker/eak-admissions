/**
 * Entry point. Scripts are loaded with `defer` in dependency order:
 * data -> icons -> dates -> render -> forms -> ui -> main.
 */
(function () {
  const EAK = window.EAK;
  EAK.render.all(); // build every data-driven section first...
  initVideos();
  EAK.forms.init(); // ...then wire behaviour to the finished DOM.
  EAK.ui.init();

  function initVideos() {
    const heroVideo = document.querySelector('#hero video');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (heroVideo && prefersReducedMotion) {
      heroVideo.pause();
      heroVideo.removeAttribute('autoplay');
      heroVideo.querySelectorAll('source').forEach((source) => source.removeAttribute('src'));
      heroVideo.load();
    }

    if (prefersReducedMotion) return;

    document.querySelectorAll('[data-hover-video]').forEach((video) => {
      const card = video.closest('li');
      let loaded = false;
      const play = () => {
        if (!loaded) {
          video.src = video.dataset.videoSrc;
          loaded = true;
        }
        video.play().catch(() => {});
        card.classList.add('is-playing');
      };
      const pause = () => {
        video.pause();
        card.classList.remove('is-playing');
      };
      card.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'touch') play();
      });
      card.addEventListener('pointerleave', pause);
      card.addEventListener('focusin', play);
      card.addEventListener('focusout', (event) => {
        if (!card.contains(event.relatedTarget)) pause();
      });
    });
  }
})();
