const https = require('https');
const fs = require('fs');

const fetchSdgPage = (indicator, page = 1) => {
  return new Promise((resolve, reject) => {
    https.get(`https://unstats.un.org/SDGAPI/v1/sdg/Indicator/Data?indicator=${indicator}&page=${page}&pageSize=50000`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

const fetchAllSdgData = async (indicator) => {
    let allData = [];
    let page = 1;
    while (true) {
        let res = await fetchSdgPage(indicator, page);
        if (res.data && res.data.length > 0) {
            allData = allData.concat(res.data);
            if (res.data.length < 50000) break; // Finished
            page++;
        } else {
            break;
        }
    }
    return allData;
};

(async () => {
  console.log("Fetching SDG 11.3.2...");
  const participation = await fetchAllSdgData('11.3.2');
  console.log("Fetching SDG 11.b.2...");
  const disaster = await fetchAllSdgData('11.b.2');

  const out = {};
  
  // Get latest value per country for 11.3.2 (Direct participation)
  for (let record of participation) {
    if (!record.geoAreaName || record.series !== "SG_URB_CSPART") continue;
    let name = record.geoAreaName;
    if (name === "United States of America") name = "United States";
    else if (name === "United Kingdom of Great Britain and Northern Ireland") name = "United Kingdom";
    else if (name === "Turkiye") name = "Türkiye";
    else if (name === "Bolivia (Plurinational State of)") name = "Bolivia";
    else if (name === "Venezuela (Bolivarian Republic of)") name = "Venezuela";
    else if (name === "Russian Federation") name = "Russia";
    
    // Some regions are not countries, simple heuristic filtering
    if (record.geoAreaCode.length > 3) continue;

    if (!out[name]) out[name] = {};
    if (!out[name].participationYear || record.timePeriodStart > out[name].participationYear) {
      out[name].participation = parseFloat(record.value).toFixed(1) + '%';
      out[name].participationYear = record.timePeriodStart;
    }
  }

  // Get latest value per country for 11.b.2 (Local DRR strategies)
  for (let record of disaster) {
    if (!record.geoAreaName || record.series !== "SG_DSR_SILS") continue;
    let name = record.geoAreaName;
    if (name === "United States of America") name = "United States";
    else if (name === "United Kingdom of Great Britain and Northern Ireland") name = "United Kingdom";
    else if (name === "Turkiye") name = "Türkiye";
    else if (name === "Bolivia (Plurinational State of)") name = "Bolivia";
    else if (name === "Venezuela (Bolivarian Republic of)") name = "Venezuela";
    else if (name === "Russian Federation") name = "Russia";

    if (record.geoAreaCode.length > 3) continue;

    if (!out[name]) out[name] = {};
    if (!out[name].localDrrYear || record.timePeriodStart > out[name].localDrrYear) {
      out[name].localDrr = parseFloat(record.value).toFixed(1) + '%';
      out[name].localDrrYear = record.timePeriodStart;
    }
  }

  fs.writeFileSync('public/api/sdg.json', JSON.stringify(out, null, 2));
  console.log("Done. Keys: " + Object.keys(out).length);
})();
