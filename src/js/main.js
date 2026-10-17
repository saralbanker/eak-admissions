/**
 * Entry point. Scripts are loaded with `defer` in dependency order:
 * data -> icons -> dates -> render -> forms -> ui -> main.
 */
(function () {
  const EAK = window.EAK;
  EAK.render.all(); // build every data-driven section first...
  EAK.forms.init(); // ...then wire behaviour to the finished DOM.
  EAK.ui.init();
})();
