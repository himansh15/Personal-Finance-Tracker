// src/utils/ocrParser.js

export const extractFieldsFromText = (text) => {
    const cleanedText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  
    const amountRegexes = [
      /(?:total|amount|grand total|balance due)[^\d]*(\d{1,3}(,\d{3})*(\.\d{2})?)/i,
      /\$?\s?(\d{1,3}(,\d{3})*(\.\d{2}))/
    ];
    let amount = '';
    for (const regex of amountRegexes) {
      const match = cleanedText.match(regex);
      if (match) {
        amount = (match[1] || match[0]).replace(/,/g, '');
        break;
      }
    }
  
    const dateRegexes = [
      /\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/,
      /\b(\d{4}[\/\-]\d{2}[\/\-]\d{2})\b/,
      /\b(\d{2}\s+[A-Za-z]+\s+\d{4})\b/,
      /\b([A-Za-z]+\s+\d{1,2},\s+\d{4})\b/
    ];
    let date = '';
    for (const regex of dateRegexes) {
      const match = cleanedText.match(regex);
      if (match) {
        date = formatDate(match[1]);
        break;
      }
    }
  
    const possibleSources = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 3 && !line.match(/^[\d\/\.\-]+$/))
      .slice(0, 5);
  
    const source = possibleSources[0] || '';
  
    return { amount, date, source };
  };
  
  const formatDate = (rawDate) => {
    if (!rawDate) return '';
  
    if (/\d{2}[\/\-]\d{2}[\/\-]\d{4}/.test(rawDate)) {
      const parts = rawDate.split(/[\/\-]/);
      if (parseInt(parts[0]) > 12) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      } else {
        return `${parts[2]}-${parts[0]}-${parts[1]}`;
      }
    }
  
    if (/\d{4}[\/\-]\d{2}[\/\-]\d{2}/.test(rawDate)) {
      return rawDate.replace(/[\/]/g, '-');
    }
  
    try {
      const parsedDate = new Date(rawDate);
      const year = parsedDate.getFullYear();
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = parsedDate.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };
  