/* SolarToolHub — Save & Share results.
   Generic: works on any tool page with a form whose id ends "-calc-form".
   - On load: applies input values from the URL and recomputes.
   - Share button: on mobile opens the native share sheet (WhatsApp, Messages,
     Email, etc.); on desktop opens a modal with WhatsApp/Email/Telegram/X/
     Facebook/Copy-link options. The shared URL carries the current inputs. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('form[id$="-calc-form"]');
    if (!form) return;
    var fields = form.querySelectorAll('input, select');
    if (!fields.length) return;

    // 1) Apply values from the URL and recompute
    var params = new URLSearchParams(window.location.search);
    var hasParams = false;
    params.forEach(function () { hasParams = true; });
    if (hasParams) {
      fields.forEach(function (f) {
        if (f.id && params.has(f.id)) {
          f.value = params.get(f.id);
          f.dispatchEvent(new Event('input', { bubbles: true }));
          f.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }

    function buildUrl() {
      var parts = [];
      fields.forEach(function (f) {
        if (f.id) parts.push(encodeURIComponent(f.id) + '=' + encodeURIComponent(f.value));
      });
      return window.location.origin + window.location.pathname + '?' + parts.join('&');
    }

    // 2) Share button
    var card = form.closest('.calc-card') || form.parentNode;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'share-result-btn';
    btn.className = 'btn btn-share';
    btn.style.marginTop = '12px';
    btn.style.marginLeft = '8px';
    btn.textContent = '🔗 Share result';
    var pdfBtn = card.querySelector('[id$="-pdf-btn"]');
    if (pdfBtn && pdfBtn.parentNode) pdfBtn.insertAdjacentElement('afterend', btn);
    else card.appendChild(btn);

    var shareText = 'Check this solar result on SolarToolHub';

    btn.addEventListener('click', function () {
      var url = buildUrl();
      try { history.replaceState(null, '', url); } catch (e) {}
      if (navigator.share) {
        navigator.share({ title: document.title, text: shareText, url: url }).catch(function () {});
        return;
      }
      openModal(url);
    });

    // 3) Desktop modal
    var overlay = null;
    function openModal(url) {
      closeModal();
      var u = encodeURIComponent(url);
      var t = encodeURIComponent(shareText + ' — ');
      var tPlain = encodeURIComponent(shareText);
      var targets = [
        { label: 'WhatsApp', href: 'https://wa.me/?text=' + t + u, cls: 'wa' },
        { label: 'Email', href: 'mailto:?subject=' + encodeURIComponent('Solar result — SolarToolHub') + '&body=' + t + u, cls: 'em' },
        { label: 'Telegram', href: 'https://t.me/share/url?url=' + u + '&text=' + tPlain, cls: 'tg' },
        { label: 'X (Twitter)', href: 'https://twitter.com/intent/tweet?url=' + u + '&text=' + tPlain, cls: 'tw' },
        { label: 'Facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=' + u, cls: 'fb' }
      ];
      overlay = document.createElement('div');
      overlay.className = 'share-overlay';
      var html = '<div class="share-modal"><button class="share-close" aria-label="Close">&times;</button>'
        + '<h3>Share this result</h3><div class="share-opts">';
      targets.forEach(function (x) {
        html += '<a class="share-opt ' + x.cls + '" href="' + x.href + '" target="_blank" rel="noopener">' + x.label + '</a>';
      });
      html += '<button class="share-opt copy" type="button">Copy link</button>';
      html += '</div><div class="share-url">' + url + '</div></div>';
      overlay.innerHTML = html;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
      overlay.querySelector('.share-close').addEventListener('click', closeModal);
      overlay.querySelector('.copy').addEventListener('click', function () { copy(url, this); });
    }
    function closeModal() { if (overlay && overlay.parentNode) { overlay.parentNode.removeChild(overlay); overlay = null; } }

    function copy(url, el) {
      function done() { if (el) { el.textContent = 'Copied!'; setTimeout(function () { el.textContent = 'Copy link'; }, 2000); } }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { fallback(url, done); });
      } else { fallback(url, done); }
    }
    function fallback(url, done) {
      var ta = document.createElement('textarea');
      ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      try { document.execCommand('copy'); if (done) done(); } catch (e) { window.prompt('Copy this link:', url); }
      document.body.removeChild(ta);
    }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  });
})();
