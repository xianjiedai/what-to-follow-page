document.addEventListener('DOMContentLoaded', function () {
  function tryPlay(v) {
    var p = v.play();
    if (p && p.catch) { p.catch(function () { /* autoplay blocked: controls remain */ }); }
  }

  // Segmented controls that switch between video panels.
  document.querySelectorAll('.seg[data-tab-group]').forEach(function (seg) {
    var group = seg.getAttribute('data-tab-group');
    seg.querySelectorAll('button[data-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        seg.querySelectorAll('button').forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        document.querySelectorAll('[data-tab-panel^="' + group + ':"]').forEach(function (p) {
          var on = p.getAttribute('data-tab-panel') === group + ':' + btn.getAttribute('data-tab');
          p.classList.toggle('is-active', on);
          var v = p.querySelector('video');
          if (v) { if (on) { v.currentTime = 0; tryPlay(v); } else { v.pause(); } }
        });
      });
    });
  });

  // Play videos only while they are on screen.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        var panel = v.closest('.video-tab-panel');
        var visible = e.isIntersecting && (!panel || panel.classList.contains('is-active'));
        if (visible) { tryPlay(v); } else { v.pause(); }
      });
    }, { threshold: 0.35 });
    document.querySelectorAll('video[data-autoplay]').forEach(function (v) { io.observe(v); });
  }

  // Copy BibTeX.
  var btn = document.getElementById('copy-bibtex');
  if (btn) {
    btn.addEventListener('click', function () {
      var text = document.getElementById('bibtex-text').innerText;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'Copied';
          setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
        });
      }
    });
  }

  // Links that are not available yet do nothing.
  document.querySelectorAll('a.is-pending').forEach(function (a) {
    a.addEventListener('click', function (ev) { ev.preventDefault(); });
  });
});
