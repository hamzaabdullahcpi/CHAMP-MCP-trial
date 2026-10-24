const fs = require('fs');

const unpop = {};
const rawLines = fs.readFileSync('unpopulation_dataportal_20260501142809.csv', 'utf-8').split('\n');
const lines = Array.from(new Set(rawLines));

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  
  // Quick parse by assuming format and taking advantage of quotes where needed.  
  // Or better, use a regex to split avoiding commas inside quotes
  const parts = [];
  let inQuotes = false;
  let currentWord = '';
  for (let char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(currentWord);
      currentWord = '';
    } else {
      currentWord += char;
    }
  }
  parts.push(currentWord);
  
  const loc = parts[7];
  const time = parts[11];
  const category = parts[21];
  const value = parseInt(parts[26], 10);
  
  if (time !== '2026') continue;
  
  let name = loc;
  if (name === "United States of America") name = "United States";
  else if (name === "United Kingdom of Great Britain and Northern Ireland") name = "United Kingdom";
  else if (name === "Turkiye") name = "Türkiye";
  else if (name === "Bolivia (Plurinational State of)") name = "Bolivia";
  else if (name === "Venezuela (Bolivarian Republic of)") name = "Venezuela";
  else if (name === "Russian Federation") name = "Russia";

  if (!unpop[name]) {
    unpop[name] = { megaCities: 0, largeCities: 0, smallCities: 0, totalCities: 0 };
  }
  
  if (!isNaN(value)) {
    if (category === "Cities with 10 millions or more inhabitants") {
      unpop[name].megaCities += value;
      unpop[name].totalCities += value;
    } else if (category.includes("to 10 millions") || category.includes("to 5 millions") || category.includes("1 to 2.5 millions")) {
      unpop[name].largeCities += value;
      unpop[name].totalCities += value;
    } else if (category.includes("500,000 to 1 million") || category.includes("250,000 to 500,000") || category.includes("100,000 to 250,000") || category.includes("50,000 to 100,000")) {
      unpop[name].smallCities += value;
      unpop[name].totalCities += value;
    }
  }
}

// Calculate percentages
for (let name in unpop) {
  let stats = unpop[name];
  if (stats.totalCities > 0) {
    stats.largeCitiesPct = ((stats.largeCities / stats.totalCities) * 100).toFixed(1);
    stats.smallCitiesPct = ((stats.smallCities / stats.totalCities) * 100).toFixed(1);
  } else {
    stats.largeCitiesPct = '0.0';
    stats.smallCitiesPct = '0.0';
  }
}

fs.writeFileSync('public/api/unpop.json', JSON.stringify(unpop, null, 2));
console.log("Processed UN Population Data for " + Object.keys(unpop).length + " locations.");
