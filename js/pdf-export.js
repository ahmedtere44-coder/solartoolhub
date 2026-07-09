/* SolarToolHub — shared PDF export helper.
   Requires jsPDF + jsPDF-AutoTable to be loaded on the page before this file. */

var STH_LOGO_BASE64 = 'data:image/png;base64,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';

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
      head: [['Field', 'Value']],
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
