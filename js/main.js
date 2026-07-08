// Capture Chrome's install prompt so we can trigger it from our own button
var deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  deferredInstallPrompt = e;
});

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // Sticky header blur-on-scroll
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Reveal-on-scroll
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  // FAQ accordion
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      faqItems.forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Newsletter form (no backend — friendly confirmation only)
  var newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = newsletterForm.querySelector('button');
      if (btn) btn.textContent = 'Subscribed';
    });
  }

  // Mini hero calculator (Panel estimate) — home page only
  var miniForm = document.getElementById('mini-calc-form');
  if (miniForm) {
    var usage = document.getElementById('mini-usage');
    var sunLevel = document.getElementById('mini-sun');
    var result = document.getElementById('mini-result-num');

    function calcMini() {
      var kwh = parseFloat(usage.value) || 0;
      var sunHours = parseFloat(sunLevel.value) || 4.5;
      var panelWatt = 400;
      var dailyKwh = kwh / 30;
      var panels = dailyKwh / (sunHours * panelWatt / 1000);
      panels = Math.ceil(panels);
      result.textContent = panels > 0 ? panels : 0;
    }

    miniForm.addEventListener('input', calcMini);
    calcMini();
  }

  // Full panel calculator — tools/panel-calculator.html
  var panelForm = document.getElementById('panel-calc-form');
  if (panelForm) {
    var pUsage = document.getElementById('panel-usage');
    var pSun = document.getElementById('panel-sun');
    var pWatt = document.getElementById('panel-watt');
    var pCountOut = document.getElementById('panel-count-result');
    var pAreaOut = document.getElementById('panel-area-result');

    function calcPanels() {
      var kwh = parseFloat(pUsage.value) || 0;
      var sunHours = parseFloat(pSun.value) || 4.5;
      var watt = parseFloat(pWatt.value) || 400;

      var dailyKwh = kwh / 30;
      var dailyPanelOutputKwh = (sunHours * watt) / 1000;
      var panelsNeeded = dailyPanelOutputKwh > 0 ? dailyKwh / dailyPanelOutputKwh : 0;
      panelsNeeded = Math.ceil(panelsNeeded);

      var areaPerPanel = 1.8;
      var totalArea = Math.round(panelsNeeded * areaPerPanel * 10) / 10;

      pCountOut.textContent = panelsNeeded > 0 ? panelsNeeded : 0;
      pAreaOut.textContent = totalArea > 0 ? totalArea : 0;
    }

    panelForm.addEventListener('input', calcPanels);
    calcPanels();
  }

  // Full inverter calculator — tools/inverter-calculator.html
  var inverterTable = document.getElementById('inverter-table');
  if (inverterTable) {
    var runningOut = document.getElementById('inverter-running-result');
    var sizeOut = document.getElementById('inverter-size-result');
    var standardSizes = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000, 6000, 7500, 8000, 10000, 15000, 20000, 25000, 30000, 40000, 50000];

    function calcInverter() {
      var rows = inverterTable.querySelectorAll('tbody tr');
      var totalRunning = 0;
      var maxSurgeExtra = 0;

      rows.forEach(function (row) {
        var checkbox = row.querySelector('.app-include');
        if (!checkbox || !checkbox.checked) return;
        var watts = parseFloat(row.querySelector('.app-watts').value) || 0;
        var qty = parseFloat(row.querySelector('.app-qty').value) || 0;
        var surge = parseFloat(row.getAttribute('data-surge')) || 1;

        var running = watts * qty;
        totalRunning += running;
        var surgeExtra = running * (surge - 1);
        if (surgeExtra > maxSurgeExtra) maxSurgeExtra = surgeExtra;
      });

      var peak = totalRunning + maxSurgeExtra;
      var withMargin = peak * 1.2;
      var recommended = standardSizes.find(function (s) { return s >= withMargin; });

      runningOut.textContent = Math.round(totalRunning);
      if (recommended) {
        sizeOut.textContent = (recommended / 1000) + ' kW';
      } else {
        sizeOut.textContent = (standardSizes[standardSizes.length - 1] / 1000) + '+ kW';
      }
    }

    inverterTable.addEventListener('input', calcInverter);
    inverterTable.addEventListener('change', calcInverter);
    calcInverter();
  }

  // Full battery calculator — tools/battery-calculator.html
  var batteryForm = document.getElementById('battery-calc-form');
  if (batteryForm) {
    var bUsage = document.getElementById('battery-usage');
    var bBackup = document.getElementById('battery-backup-pct');
    var bVoltage = document.getElementById('battery-voltage');
    var liKwhOut = document.getElementById('li-kwh');
    var liAhOut = document.getElementById('li-ah');
    var laKwhOut = document.getElementById('la-kwh');
    var laAhOut = document.getElementById('la-ah');

    function calcBattery() {
      var dailyKwh = parseFloat(bUsage.value) || 0;
      var pct = parseFloat(bBackup.value) || 50;
      var voltage = parseFloat(bVoltage.value) || 24;

      var targetKwh = dailyKwh * (pct / 100);
      var liKwh = targetKwh / 0.9;
      var laKwh = targetKwh / 0.5;
      var liAh = (liKwh * 1000) / voltage;
      var laAh = (laKwh * 1000) / voltage;

      liKwhOut.textContent = liKwh > 0 ? liKwh.toFixed(1) : 0;
      laKwhOut.textContent = laKwh > 0 ? laKwh.toFixed(1) : 0;
      liAhOut.textContent = liAh > 0 ? Math.round(liAh) : 0;
      laAhOut.textContent = laAh > 0 ? Math.round(laAh) : 0;
    }

    batteryForm.addEventListener('input', calcBattery);
    calcBattery();
  }

  // Full charge controller calculator — tools/charge-controller-calculator.html
  var ccForm = document.getElementById('cc-calc-form');
  if (ccForm) {
    var ccWatts = document.getElementById('cc-watts');
    var ccVoltage = document.getElementById('cc-voltage');
    var ccSafety = document.getElementById('cc-safety');
    var ccMpptOut = document.getElementById('cc-mppt-amps');
    var ccPwmOut = document.getElementById('cc-pwm-amps');
    var ccMpptSizeOut = document.getElementById('cc-mppt-size');
    var ccPwmSizeOut = document.getElementById('cc-pwm-size');
    var ccStandardSizes = [10, 20, 30, 40, 50, 60, 80, 100, 120, 150];

    function ccRecommend(amps) {
      var size = ccStandardSizes.find(function (s) { return s >= amps; });
      return size ? size + 'A standard size recommended' : 'Multiple controllers or a larger unit required';
    }

    function calcCC() {
      var watts = parseFloat(ccWatts.value) || 0;
      var voltage = parseFloat(ccVoltage.value) || 24;
      var safety = parseFloat(ccSafety.value) || 1.25;

      var amps = (watts / voltage) * safety;

      ccMpptOut.textContent = amps > 0 ? amps.toFixed(1) : 0;
      ccPwmOut.textContent = amps > 0 ? amps.toFixed(1) : 0;
      ccMpptSizeOut.textContent = amps > 0 ? ccRecommend(amps) : '';
      ccPwmSizeOut.textContent = amps > 0 ? ccRecommend(amps) : '';
    }

    ccForm.addEventListener('input', calcCC);
    calcCC();
  }

  // Full cable calculator — tools/cable-calculator.html
  var cableForm = document.getElementById('cable-calc-form');
  if (cableForm) {
    var cWatts = document.getElementById('cable-watts');
    var cVoltage = document.getElementById('cable-voltage');
    var cLength = document.getElementById('cable-length');
    var cDrop = document.getElementById('cable-drop');
    var cSizeOut = document.getElementById('cable-size-result');
    var cDropOut = document.getElementById('cable-actual-drop');

    // [mm2, AWG label]
    var standardSizes = [
      [1.5, '16 AWG'], [2.5, '14 AWG'], [4, '12 AWG'], [6, '10 AWG'],
      [10, '8 AWG'], [16, '6 AWG'], [25, '4 AWG'], [35, '2 AWG'],
      [50, '1/0 AWG'], [70, '2/0 AWG'], [95, '3/0 AWG'], [120, '4/0 AWG']
    ];
    var resistivity = 0.0175; // ohm*mm2/m for copper

    function calcCable() {
      var watts = parseFloat(cWatts.value) || 0;
      var voltage = parseFloat(cVoltage.value) || 12;
      var length = parseFloat(cLength.value) || 0;
      var dropPct = parseFloat(cDrop.value) || 3;

      var current = voltage > 0 ? watts / voltage : 0;
      var allowedDropV = voltage * (dropPct / 100);
      var requiredArea = allowedDropV > 0 ? (2 * length * current * resistivity) / allowedDropV : 0;

      var chosen = standardSizes.find(function (s) { return s[0] >= requiredArea; });
      if (!chosen) chosen = standardSizes[standardSizes.length - 1];

      var actualDropV = (2 * length * current * resistivity) / chosen[0];
      var actualDropPct = voltage > 0 ? (actualDropV / voltage) * 100 : 0;

      cSizeOut.textContent = chosen[0] + ' mm² (' + chosen[1] + ')';
      cDropOut.textContent = actualDropPct.toFixed(1) + '%';
    }

    cableForm.addEventListener('input', calcCable);
    calcCable();
  }

  // Full ROI calculator — tools/roi-calculator.html
  var roiForm = document.getElementById('roi-calc-form');
  if (roiForm) {
    var rCost = document.getElementById('roi-cost');
    var rMonthly = document.getElementById('roi-monthly-savings');
    var rEscalation = document.getElementById('roi-escalation');
    var rPaybackOut = document.getElementById('roi-payback-result');
    var rNetOut = document.getElementById('roi-net25-result');

    function calcROI() {
      var cost = parseFloat(rCost.value) || 0;
      var monthlySavings = parseFloat(rMonthly.value) || 0;
      var escalation = parseFloat(rEscalation.value) || 0;
      var currency = '$';

      var annualSavings = monthlySavings * 12;

      // Payback period (accounts for escalating savings year by year)
      var cumulative = 0;
      var year = 0;
      var currentAnnual = annualSavings;
      var paybackYears = null;

      while (year < 50) {
        if (cumulative + currentAnnual >= cost && currentAnnual > 0) {
          var remaining = cost - cumulative;
          var fraction = remaining / currentAnnual;
          paybackYears = year + fraction;
          break;
        }
        cumulative += currentAnnual;
        year += 1;
        currentAnnual *= (1 + escalation / 100);
      }

      // Total savings over 25-year system lifetime
      var total25 = 0;
      var yearlyAmount = annualSavings;
      for (var i = 0; i < 25; i++) {
        total25 += yearlyAmount;
        yearlyAmount *= (1 + escalation / 100);
      }
      var net25 = total25 - cost;

      rPaybackOut.textContent = (paybackYears !== null && annualSavings > 0) ? paybackYears.toFixed(1) + ' yrs' : '—';
      rNetOut.textContent = currency + Math.round(net25).toLocaleString();
    }

    roiForm.addEventListener('input', calcROI);
    calcROI();
  }

  // Register service worker (enables "Install app" on supported browsers)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      var isSubPage = location.pathname.indexOf('/tools/') !== -1 || location.pathname.indexOf('/articles/') !== -1;
      var swPath = isSubPage ? '../sw.js' : 'sw.js';
      navigator.serviceWorker.register(swPath).catch(function () {
        // Fails silently — install prompt just won't be available, no impact on the site itself.
      });
    });
  }

  // One-tap install button (install.html)
  var installBtn = document.getElementById('install-btn');
  if (installBtn) {
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var installNote = document.getElementById('install-note');

    installBtn.addEventListener('click', function () {
      if (deferredInstallPrompt) {
        // Android/Chrome: opens the native install dialog directly
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.finally(function () {
          deferredInstallPrompt = null;
        });
      } else if (isIOS) {
        // iOS gives no way to trigger this programmatically — Safari restricts it
        if (installNote) {
          installNote.style.display = 'block';
          installNote.textContent = 'On iPhone, tap the Share button (square with an arrow, at the bottom of Safari), then scroll down and tap "Add to Home Screen".';
          installNote.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        if (installNote) {
          installNote.style.display = 'block';
          installNote.textContent = 'One-tap install isn\'t available in this browser yet. Look for "Add to Home Screen" or "Install app" in your browser\'s menu (usually the three-dot icon or share icon).';
          installNote.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  // Panel tilt & angle calculator — tools/panel-tilt-calculator.html
  var tiltForm = document.getElementById('tilt-calc-form');
  if (tiltForm) {
    var tiltLat = document.getElementById('tilt-latitude');
    var tiltHemisphere = document.getElementById('tilt-hemisphere');
    var tiltYearOut = document.getElementById('tilt-year');
    var tiltWinterOut = document.getElementById('tilt-winter');
    var tiltSummerOut = document.getElementById('tilt-summer');
    var tiltDirectionOut = document.getElementById('tilt-direction');

    function calcTilt() {
      var lat = parseFloat(tiltLat.value) || 0;
      var yearAngle = lat;
      var winterAngle = Math.min(lat + 15, 90);
      var summerAngle = Math.max(lat - 15, 0);

      tiltYearOut.textContent = yearAngle.toFixed(1);
      tiltWinterOut.textContent = winterAngle.toFixed(1);
      tiltSummerOut.textContent = summerAngle.toFixed(1);
      tiltDirectionOut.textContent = tiltHemisphere.value === 'north' ? 'south' : 'north';
    }

    tiltForm.addEventListener('input', calcTilt);
    calcTilt();
  }

  // Generator sizing calculator — tools/generator-sizing-calculator.html
  var genForm = document.getElementById('gen-calc-form');
  if (genForm) {
    var genRunning = document.getElementById('gen-running');
    var genSurge = document.getElementById('gen-surge');
    var genHeadroom = document.getElementById('gen-headroom');
    var genPeakOut = document.getElementById('gen-peak');
    var genRecommendedOut = document.getElementById('gen-recommended');
    var genStandardSizeOut = document.getElementById('gen-standard-size');
    var genStandardSizesW = [2000, 3000, 3500, 5000, 6500, 8000, 10000, 12000, 15000, 20000];

    function genRecommend(watts) {
      var size = genStandardSizesW.find(function (s) { return s >= watts; });
      return size ? (size / 1000) + ' kW standard size recommended' : 'Multiple units or a custom-sized generator required';
    }

    function calcGen() {
      var running = parseFloat(genRunning.value) || 0;
      var surge = parseFloat(genSurge.value) || 0;
      var headroom = parseFloat(genHeadroom.value) || 1.25;

      var peak = running + surge;
      var recommended = peak * headroom;

      genPeakOut.textContent = Math.round(peak);
      genRecommendedOut.textContent = Math.round(recommended);
      genStandardSizeOut.textContent = recommended > 0 ? genRecommend(recommended) : '';
    }

    genForm.addEventListener('input', calcGen);
    calcGen();
  }

  // Daily energy load calculator — tools/daily-load-calculator.html
  var loadTableBody = document.getElementById('load-table-body');
  if (loadTableBody) {
    var loadAddBtn = document.getElementById('load-add-btn');
    var loadDailyKwhOut = document.getElementById('load-daily-kwh');
    var loadMonthlyKwhOut = document.getElementById('load-monthly-kwh');
    var loadPeakWattsOut = document.getElementById('load-peak-watts');

    var loadAppliances = [
      { name: 'LED lighting', watts: 40, hours: 5 },
      { name: 'Refrigerator', watts: 150, hours: 24 },
      { name: 'TV / laptop', watts: 100, hours: 4 }
    ];

    function renderLoadTable() {
      loadTableBody.innerHTML = '';
      loadAppliances.forEach(function (app, i) {
        var tr = document.createElement('tr');

        var nameTd = document.createElement('td');
        var nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'load-name';
        nameInput.setAttribute('data-index', i);
        nameInput.value = app.name;
        nameInput.placeholder = 'e.g. Refrigerator';
        nameTd.appendChild(nameInput);

        var wattsTd = document.createElement('td');
        var wattsInput = document.createElement('input');
        wattsInput.type = 'number';
        wattsInput.className = 'load-watts app-watts';
        wattsInput.setAttribute('data-index', i);
        wattsInput.min = '0';
        wattsInput.step = '5';
        wattsInput.value = app.watts;
        wattsTd.appendChild(wattsInput);

        var hoursTd = document.createElement('td');
        var hoursInput = document.createElement('input');
        hoursInput.type = 'number';
        hoursInput.className = 'load-hours app-hours';
        hoursInput.setAttribute('data-index', i);
        hoursInput.min = '0';
        hoursInput.max = '24';
        hoursInput.step = '0.5';
        hoursInput.value = app.hours;
        hoursTd.appendChild(hoursInput);

        var dailyWhTd = document.createElement('td');
        dailyWhTd.className = 'load-daily-wh';
        dailyWhTd.textContent = Math.round(app.watts * app.hours);

        var removeTd = document.createElement('td');
        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'load-remove-btn';
        removeBtn.setAttribute('data-index', i);
        removeBtn.setAttribute('aria-label', 'Remove appliance');
        removeBtn.textContent = '\u00d7';
        removeTd.appendChild(removeBtn);

        tr.appendChild(nameTd);
        tr.appendChild(wattsTd);
        tr.appendChild(hoursTd);
        tr.appendChild(dailyWhTd);
        tr.appendChild(removeTd);
        loadTableBody.appendChild(tr);
      });
    }

    function calcLoadTotals() {
      var totalWh = 0;
      var peakWatts = 0;
      loadAppliances.forEach(function (app) {
        totalWh += app.watts * app.hours;
        peakWatts += app.watts;
      });
      var dailyKwh = totalWh / 1000;
      var monthlyKwh = dailyKwh * 30;

      loadDailyKwhOut.textContent = dailyKwh.toFixed(2);
      loadMonthlyKwhOut.textContent = monthlyKwh.toFixed(1);
      loadPeakWattsOut.textContent = Math.round(peakWatts);
    }

    function updateRowDailyWh(index) {
      var row = loadTableBody.children[index];
      if (row) {
        var app = loadAppliances[index];
        row.querySelector('.load-daily-wh').textContent = Math.round(app.watts * app.hours);
      }
    }

    loadTableBody.addEventListener('input', function (e) {
      var index = parseInt(e.target.getAttribute('data-index'), 10);
      if (isNaN(index)) return;

      if (e.target.classList.contains('load-name')) {
        loadAppliances[index].name = e.target.value;
      } else if (e.target.classList.contains('load-watts')) {
        loadAppliances[index].watts = parseFloat(e.target.value) || 0;
        updateRowDailyWh(index);
      } else if (e.target.classList.contains('load-hours')) {
        loadAppliances[index].hours = parseFloat(e.target.value) || 0;
        updateRowDailyWh(index);
      }
      calcLoadTotals();
    });

    loadTableBody.addEventListener('click', function (e) {
      if (e.target.classList.contains('load-remove-btn')) {
        var index = parseInt(e.target.getAttribute('data-index'), 10);
        if (!isNaN(index)) {
          loadAppliances.splice(index, 1);
          renderLoadTable();
          calcLoadTotals();
        }
      }
    });

    if (loadAddBtn) {
      loadAddBtn.addEventListener('click', function () {
        loadAppliances.push({ name: '', watts: 0, hours: 0 });
        renderLoadTable();
        calcLoadTotals();
      });
    }

    renderLoadTable();
    calcLoadTotals();
  }
});
