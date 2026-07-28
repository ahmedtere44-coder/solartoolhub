/* SolarToolHub — Save & Share results.
   Generic, self-contained: works on any tool page that has a form whose id ends
   with "-calc-form". Adds a "Share result" button that builds a URL carrying the
   current input values, and on page load applies any values from the URL and
   triggers the calculator to recompute. No per-tool code needed. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('form[id$="-calc-form"]');
    if (!form) return;
    var fields = form.querySelectorAll('input, select');
    if (!fields.length) return;

    // 1) Apply values from the URL (if any) and recompute
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

    // 2) Build the Share button
    var card = form.closest('.calc-card') || form.parentNode;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'share-result-btn';
    btn.className = 'btn btn-share';
    btn.style.marginTop = '12px';
    btn.style.marginLeft = '8px';
    btn.textContent = '🔗 Share result';

    var pdfBtn = card.querySelector('[id$="-pdf-btn"]');
    if (pdfBtn && pdfBtn.parentNode) {
      pdfBtn.insertAdjacentElement('afterend', btn);
    } else {
      card.appendChild(btn);
    }

    var msg = document.createElement('span');
    msg.id = 'share-msg';
    msg.textContent = 'Link copied!';
    btn.insertAdjacentElement('afterend', msg);

    // 3) On click: build URL from current values, update address bar, copy to clipboard
    btn.addEventListener('click', function () {
      var parts = [];
      fields.forEach(function (f) {
        if (f.id) parts.push(encodeURIComponent(f.id) + '=' + encodeURIComponent(f.value));
      });
      var url = window.location.origin + window.location.pathname + '?' + parts.join('&');
      try { history.replaceState(null, '', url); } catch (e) {}
      copy(url);
    });

    function showCopied() {
      msg.classList.add('show');
      setTimeout(function () { msg.classList.remove('show'); }, 2500);
    }
    function copy(url) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(showCopied, function () { fallback(url); });
      } else {
        fallback(url);
      }
    }
    function fallback(url) {
      var t = document.createElement('textarea');
      t.value = url;
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.focus(); t.select();
      try { document.execCommand('copy'); showCopied(); }
      catch (e) { window.prompt('Copy this link:', url); }
      document.body.removeChild(t);
    }
  });
})();
