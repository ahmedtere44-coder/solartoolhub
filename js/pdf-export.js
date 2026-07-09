/* SolarToolHub — shared PDF export helper.
   Requires jsPDF + jsPDF-AutoTable to be loaded on the page before this file. */

var STH_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAIAAADdvvtQAAAGV0lEQVR4nO3dvWodRxiH8Vcm9xEHjErdgBuXCQE1uQEXagIhuEkjXIo0AROCIU0KXUACRiDSqvENpBQiH3cgUp4ipBh5vTofu7M7M++878zzNAkJPmfg/PjvOZKlPdpsNqLV8emV2nO57vbi69pHiO2Too+OmBU50iOFAOGmnzIDgk5ivuZHMgKCTp9lAASdXLmbH0kEBB16svpPoidvHudH1i0QdGho8QKhh8YtA4SeQjm9fskiQOih3WIBoYf2FgUIPXSoeUDooYlmAKFHIb/voGUaEHpotoOA0EMxrf9WBpEcAsT8UGR7AKGH4uMSRkltA2J+aFEsECX1CBDzQ0tjgSipj4CYH1oRC0RJPQBifip2/Prn2kdYHwtESQGIknoiXL8oIRaIkgKQify+jy77C6Ym+uv3r2o99VafffHb6j97fnaS8SQeqwDIDp1QOM9SRtAJHT39/FfN57OmZ1y8oUJ6Xj59XuJhi6b6HsiyHok+HtszTg+QcT2h2UMW1XP59/tyD14oPoVRUkqAXMxPaOKoChcvdyPEAlFSADKXrxECECUFIIs5GiEAGc2LIQBRUgCym4sRApDp7BsCkPWMGwKQgywbApCPzBoCkJM295e317UPsScAeWhzH/5p0BCAzPdBT8iaIQDZ7rGekClDADLcPj2hy9trI4wAZLXDeoYsGAKQySL0hKpPUbUfLKSDResZCoZeHn+Z/zCHe/btdwIgcy3XM6TGKNAJAchSCXqGijIa0wkByEw59Axd3l5fvL0Rkbuffkh/tF03QwCyUVY947Ze+0hPE2K2ApCBiunZLV5GZHyMr52inhIBqGrO9QiAauZfjwCoWk3oEQDVqRU9AqAKNaRHAKRdW3oEQKo1p0cApFeLegRASjWqRwCkUbt6BEDFa1qPAKhsresRABWsAz0CoFL1oUcAVKRu9AiA8teTHgFQ5jrTIwDKWX96BEDZ6lKPAChPveoRNUAp9yVVbuKo3//yx57/alJP+KEwhVigtEzq0UwPkIsRmj3koxGyqkdtfkR5gYwbijzegyH0iIj+JcysoUUHu3jzrthBklLWI/q3/R6ycxPMpab/+/fP4d9ff/Mi82nWpk8nVA2Q08Z6SPgUtij07Aag2NCzNwBFhZ5DAWg+9EwEoJnQMx2ApkLPbAA6GHpiqvY7Es/PTmo99VZ7v8ceqeef95l/5eDqPn2e4bexrqjCFxLt0Bk3ZhSjxw6dcfqMtC9hNvXI6GB+9UiNg6kCMqsndH524lpPSPl4eoCM6xER2dzPfnPUuJ6Q5iH5FPYhq3+/x3hKgKzPz0jPxAi5mJ+Q2lFZILYnqe4BoSetvgGhJ7mOAaEnR70CQk+mugSEnnz1Bwg9WesMEHpy1xMg9BSoG0DoKVMfgNBTrA4AoadkrQNCT+GaBoSe8rULCD0qNQoIPVq1CAg9ijUHCD26tQUIPeo1BAg9NWoFEHoq1QQg9NTLPyD0VM05IPTUzjMg9BjILSD02MgnIPSYySEg9FjKGyD0GMsVIPTYyw8g9JjMCSD0WM0DIPQYzjwg9NjONiD0mM8wIPR4yCog9DjJJCD0+MkeIPS4yhgg9HjLEiD0OMwMIPT4zAYg9LjNACD0eK42IPQ4TwnQ3vuS2tRz8fbm0P+qdV/SFakdtd4CmdRDS9MD9GiErOqZmJ+QixHSPKTqAj0YcqsnZNyQ8vG0L2EXb94pP2NkkXpCZg3pH+xos9kcn17pPNn4nsizt7dVaxGdrezcBLOWaT1AMXfUJncpXcLQ02oagNDTcMUBoaftnojI7dVpoUdHT9vd3bwquEDo6aFSgNDTSQ+A8l7F0NNDdzevpMQCoaerPgLKMkLo6aQwP5J3gdDTYY8ApYwQevppmB/JtUDo6bZtQCtGCD1dNZ4fSV8g9HTeHkDxI4Se3tqaHzm0QDGG0NNbu3pk9SUMPRQ6CGhihNDTYXvnR6YXaK8h9HTYIT0yewnbMoSeDpvQIzHvgQZD6OmwaT0Sfioj5oGevfgx/TTkq1k9Ev8pLOaxqKUiX/EFH+Mx1E/xr/WyrwNhqIcWvcqLv5CIobZb+vrGvonejbfVjbVuGtZ/N54paqnVr+b6BRpiilyXOAQZAIVg5K4s15BsgEIwclHGtx+ZAYVgZLbs71yLABpCkpHKfeL5H4b8dfmhy9WlAAAAAElFTkSuQmCC';

function generateSolarToolHubResultsPDF(config) {
  var jsPDFCtor = window.jspdf.jsPDF;
  var doc = new jsPDFCtor();

  // Header: logo + wordmark
  try {
    doc.addImage(STH_LOGO_BASE64, 'PNG', 14, 12, 12, 12);
  } catch (e) { /* logo optional, continue without it if it fails */ }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text('Solar', 30, 21);
  var solarWidth = doc.getTextWidth('Solar');
  doc.setTextColor(249, 115, 22);
  doc.text('Tool', 30 + solarWidth, 21);
  var toolWidth = doc.getTextWidth('Tool');
  doc.setTextColor(30, 58, 138);
  doc.text('Hub', 30 + solarWidth + toolWidth, 21);

  doc.setFontSize(13);
  doc.setTextColor(20, 20, 20);
  doc.text(config.subtitle, 14, 33);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  var now = new Date();
  doc.text('Generated ' + now.toLocaleDateString() + ' at ' + now.toLocaleTimeString(), 14, 39);

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 44, 196, 44);

  var cursorY = 54;

  if (config.inputs && config.inputs.length) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text('Inputs', 14, cursorY);
    doc.autoTable({
      startY: cursorY + 4,
      head: [config.inputsHeaders || ['Field', 'Value']],
      body: config.inputs,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [243, 244, 246], textColor: [80, 80, 80], fontStyle: 'bold' },
      margin: { left: 14, right: 14 }
    });
    cursorY = doc.lastAutoTable.finalY + 12;
  }

  if (config.results && config.results.length) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text('Results', 14, cursorY);
    doc.autoTable({
      startY: cursorY + 4,
      head: [config.resultsHeaders || ['Item', 'Value']],
      body: config.results,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontStyle: 'bold' },
      margin: { left: 14, right: 14 }
    });
    cursorY = doc.lastAutoTable.finalY + 14;
  }

  if (config.nextSteps) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text('Recommended next step', 14, cursorY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(config.nextSteps.text, 14, cursorY + 7);
    doc.setTextColor(30, 58, 138);
    doc.textWithLink(config.nextSteps.linkText, 14, cursorY + 14, { url: config.nextSteps.url });
  }

  // Footer
  var pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(230, 230, 230);
  doc.line(14, pageHeight - 20, 196, pageHeight - 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generated by SolarToolHub — free solar engineering calculators and guides.', 14, pageHeight - 14);
  doc.setTextColor(30, 58, 138);
  doc.textWithLink('https://ahmedtere44-coder.github.io/solartoolhub/', 14, pageHeight - 9, { url: 'https://ahmedtere44-coder.github.io/solartoolhub/' });

  doc.save(config.filename);
}

/* Generic article exporter — walks the .article DOM (headings, paragraphs,
   lists, tables, field-note boxes) and renders it as a formatted PDF. */
function generateSolarToolHubArticlePDF(config) {
  var articleEl = document.querySelector(config.articleSelector || '.article');
  if (!articleEl) return;

  var jsPDFCtor = window.jspdf.jsPDF;
  var doc = new jsPDFCtor();
  var pageWidth = doc.internal.pageSize.getWidth();
  var pageHeight = doc.internal.pageSize.getHeight();
  var marginLeft = 14;
  var marginRight = 14;
  var contentWidth = pageWidth - marginLeft - marginRight;
  var cursorY = 0;

  function sanitize(text) {
    return (text || '').replace(/\u2192/g, '-').replace(/\s+/g, ' ').trim();
  }

  function ensureSpace(neededHeight) {
    if (cursorY + neededHeight > pageHeight - 24) {
      doc.addPage();
      cursorY = 20;
    }
  }

  // Header: logo + wordmark (same as calculator PDFs)
  try {
    doc.addImage(STH_LOGO_BASE64, 'PNG', marginLeft, 12, 12, 12);
  } catch (e) { /* logo optional */ }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text('Solar', marginLeft + 16, 21);
  var solarWidth = doc.getTextWidth('Solar');
  doc.setTextColor(249, 115, 22);
  doc.text('Tool', marginLeft + 16 + solarWidth, 21);
  var toolWidth = doc.getTextWidth('Tool');
  doc.setTextColor(30, 58, 138);
  doc.text('Hub', marginLeft + 16 + solarWidth + toolWidth, 21);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  var now = new Date();
  doc.text('Generated ' + now.toLocaleDateString() + ' at ' + now.toLocaleTimeString(), marginLeft, 39);

  doc.setDrawColor(220, 220, 220);
  doc.line(marginLeft, 44, pageWidth - marginRight, 44);
  cursorY = 54;

  // Article title + subtitle (lede)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  var titleLines = doc.splitTextToSize(sanitize(config.title), contentWidth);
  ensureSpace(titleLines.length * 7 + 4);
  doc.text(titleLines, marginLeft, cursorY);
  cursorY += titleLines.length * 7 + 2;

  if (config.subtitle) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10.5);
    doc.setTextColor(90, 90, 90);
    var subLines = doc.splitTextToSize(sanitize(config.subtitle), contentWidth);
    ensureSpace(subLines.length * 5 + 6);
    doc.text(subLines, marginLeft, cursorY);
    cursorY += subLines.length * 5 + 8;
  }

  // Walk the article's direct children
  var children = articleEl.children;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    var tag = el.tagName;

    if (tag === 'H2') {
      cursorY += 4;
      ensureSpace(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(30, 58, 138);
      var h2Lines = doc.splitTextToSize(sanitize(el.textContent), contentWidth);
      doc.text(h2Lines, marginLeft, cursorY);
      cursorY += h2Lines.length * 6 + 4;

    } else if (tag === 'H3') {
      cursorY += 2;
      ensureSpace(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(20, 20, 20);
      var h3Lines = doc.splitTextToSize(sanitize(el.textContent), contentWidth);
      doc.text(h3Lines, marginLeft, cursorY);
      cursorY += h3Lines.length * 5.5 + 3;

    } else if (tag === 'P') {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      var pLines = doc.splitTextToSize(sanitize(el.textContent), contentWidth);
      ensureSpace(pLines.length * 5 + 4);
      doc.text(pLines, marginLeft, cursorY);
      cursorY += pLines.length * 5 + 5;

    } else if (tag === 'UL' || tag === 'OL') {
      var items = el.querySelectorAll(':scope > li');
      items.forEach(function (li, idx) {
        var bullet = tag === 'OL' ? (idx + 1) + '.' : '-';
        var text = bullet + ' ' + sanitize(li.textContent);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        var liLines = doc.splitTextToSize(text, contentWidth - 4);
        ensureSpace(liLines.length * 5 + 2);
        doc.text(liLines, marginLeft + 2, cursorY);
        cursorY += liLines.length * 5 + 2;
      });
      cursorY += 3;

    } else if (tag === 'TABLE') {
      var headCells = el.querySelectorAll('thead th');
      var head = [];
      headCells.forEach(function (th) { head.push(sanitize(th.textContent)); });
      var bodyRows = [];
      el.querySelectorAll('tbody tr').forEach(function (tr) {
        var row = [];
        tr.querySelectorAll('td').forEach(function (td) { row.push(sanitize(td.textContent)); });
        bodyRows.push(row);
      });
      ensureSpace(20);
      doc.autoTable({
        startY: cursorY,
        head: head.length ? [head] : undefined,
        body: bodyRows,
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontStyle: 'bold' },
        margin: { left: marginLeft, right: marginRight }
      });
      cursorY = doc.lastAutoTable.finalY + 8;

    } else if (tag === 'DIV' && el.classList.contains('field-experience')) {
      var tagEl = el.querySelector('.tag');
      var tagText = tagEl ? sanitize(tagEl.textContent) : 'Field note';
      var noteParas = el.querySelectorAll('p');
      var noteText = '';
      noteParas.forEach(function (p) { noteText += sanitize(p.textContent) + ' '; });
      if (!noteText.trim()) { noteText = sanitize(el.textContent.replace(tagText, '')); }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(16, 185, 129);
      ensureSpace(8);
      doc.text(tagText.toUpperCase(), marginLeft, cursorY);
      cursorY += 5;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      var noteLines = doc.splitTextToSize(noteText.trim(), contentWidth - 4);
      ensureSpace(noteLines.length * 5 + 6);
      doc.text(noteLines, marginLeft + 2, cursorY);
      cursorY += noteLines.length * 5 + 8;
    }
  }

  // Footer on every page
  var pageCount = doc.internal.getNumberOfPages();
  for (var p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(230, 230, 230);
    doc.line(marginLeft, pageHeight - 20, pageWidth - marginRight, pageHeight - 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by SolarToolHub — free solar engineering guides and calculators.', marginLeft, pageHeight - 14);
    doc.setTextColor(30, 58, 138);
    doc.textWithLink('https://ahmedtere44-coder.github.io/solartoolhub/', marginLeft, pageHeight - 9, { url: 'https://ahmedtere44-coder.github.io/solartoolhub/' });
  }

  doc.save(config.filename);
}
