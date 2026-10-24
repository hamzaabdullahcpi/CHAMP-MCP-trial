const fs = require('fs');
const https = require('https');

const fetchJson = (url) => new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Accept': 'application/vnd.sdmx.data+json; charset=utf-8; version=2.0' }, timeout: 15000 }, (resp) => {
        let data = '';
        resp.on('data', (chunk) => { data += chunk; });
        resp.on('end', () => {
            try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
        });
    }).on('error', reject);
});

async function run() {
    const structUrl = 'https://sdmx.oecd.org/public/rest/data/OECD.CFE.RDG,DSD_SNG_WOFI@DF_SNG_STRUCT,1.0/all?startPeriod=2018&dimensionAtObservation=AllDimensions';
    const socioUrl = 'https://sdmx.oecd.org/public/rest/data/OECD.CFE.RDG,DSD_SNG_WOFI@DF_SOCIO,1.0/all?startPeriod=2018&dimensionAtObservation=AllDimensions';
    const financeUrl = 'https://sdmx.oecd.org/public/rest/data/OECD.CFE.RDG,DSD_SNG_WOFI@DF_FINANCE,1.0/all?startPeriod=2020&dimensionAtObservation=AllDimensions';

    console.log("Fetching SDMX data...");
    const [struct, socio, finance] = await Promise.all([fetchJson(structUrl), fetchJson(socioUrl), fetchJson(financeUrl)]);

    console.log("Parsing...");
    const extract = (json) => {
        if(!json || !json.data) return { obs: {}, dims: [], dataset: {} };
        const dims = json.data.structures[0].dimensions.observation;
        const refAreaDimIndex = dims.findIndex(d => d.id === 'REF_AREA');
        const refAreaVals = dims[refAreaDimIndex].values.map(v => v.name);
        const refAreaIds = dims[refAreaDimIndex].values.map(v => v.id);

        const dataset = json.data.dataSets[0].observations;
        return { dataset, refAreaVals, refAreaIds, dims };
    };

    const s = extract(struct);
    const so = extract(socio);
    const f = extract(finance);

    const out = {};

    const getValue = (ext, areaIdx, reqIds = {}) => {
        let latestTimeIdx = -1;
        let latestVal = null;
        
        for (let key in ext.dataset) {
            const parts = key.split(':');
            
            let match = true;
            let tIdx = -1;
            
            for (let dimIdx = 0; dimIdx < ext.dims.length; dimIdx++) {
                const dim = ext.dims[dimIdx];
                const valIdx = parseInt(parts[dimIdx]);
                
                if (dim.id === 'REF_AREA') {
                    if (valIdx !== areaIdx) match = false;
                } else if (dim.id === 'TIME_PERIOD') {
                    tIdx = valIdx;
                } else if (reqIds[dim.id]) {
                    const reqValId = reqIds[dim.id];
                    const actualValId = dim.values[valIdx] ? dim.values[valIdx].id : null;
                    if (actualValId !== reqValId) match = false;
                }
            }
            
            if (match) {
                if (tIdx > latestTimeIdx) {
                    latestTimeIdx = tIdx;
                    latestVal = ext.dataset[key][0];
                }
            }
        }
        return latestVal;
    };

    for (let i = 0; i < f.refAreaVals.length; i++) {
        let name = f.refAreaVals[i];
        if (!name) continue;
        const norm = name === "United States" ? "United States of America" : name;
        if (norm.includes("OECD") || norm.includes("Memo")) continue;

        let sIdx = s.refAreaVals ? s.refAreaVals.indexOf(name) : -1;
        let soIdx = so.refAreaVals ? so.refAreaVals.indexOf(name) : -1;
        
        let avgSize = sIdx>-1 ? getValue(s, sIdx, { 'MEASURE': 'MUN_SIZE' }) : null;
        let population = soIdx>-1 ? getValue(so, soIdx, { 'MEASURE': 'POP', 'UNIT_MEASURE': 'PS' }) : null;
        let gdpPerCapita = soIdx>-1 ? getValue(so, soIdx, { 'MEASURE': 'GDP_PS', 'UNIT_MEASURE': 'USD_PPP_PS' }) : null;
        let urgPopRaw = soIdx>-1 ? getValue(so, soIdx, { 'MEASURE': 'URB_POP', 'UNIT_MEASURE': 'PT_POP' }) : null;
        let urbPop = urgPopRaw !== null ? (urgPopRaw <= 1.0 ? urgPopRaw * 100 : urgPopRaw) : null;

        // SECTOR: S13M (State and Local Government) OR S1313 (Local Government) if S13M not available
        let exp = getValue(f, i, { 'MEASURE': 'E1', 'UNIT_MEASURE': 'PT_OTE_S13_TRANSACT', 'SECTOR': 'S13M' });
        if(exp === null) exp = getValue(f, i, { 'MEASURE': 'E1', 'UNIT_MEASURE': 'PT_OTE_S13_TRANSACT', 'SECTOR': 'S1313' });
        
        let rev = getValue(f, i, { 'MEASURE': 'R1', 'UNIT_MEASURE': 'PT_OTR_S13_CAT', 'SECTOR': 'S13M' });
        if(rev === null) rev = getValue(f, i, { 'MEASURE': 'R1', 'UNIT_MEASURE': 'PT_OTR_S13_CAT', 'SECTOR': 'S1313' });
        
        let debt = getValue(f, i, { 'MEASURE': 'D1', 'UNIT_MEASURE': 'PT_B1GQ', 'SECTOR': 'S13M' });
        if(debt === null) debt = getValue(f, i, { 'MEASURE': 'D1', 'UNIT_MEASURE': 'PT_B1GQ', 'SECTOR': 'S1313' });
        
        let inv = getValue(f, i, { 'MEASURE': 'E121', 'UNIT_MEASURE': 'PT_OTE_S13_TRANSACT', 'SECTOR': 'S13M' });
        if(inv === null) inv = getValue(f, i, { 'MEASURE': 'E121', 'UNIT_MEASURE': 'PT_OTE_S13_TRANSACT', 'SECTOR': 'S1313' });

        if (urbPop !== null || exp !== null || population !== null) {
            
            out[name] = { 
                population: population ? Math.round(population) : '-', 
                gdpPerCapita: gdpPerCapita ? '$' + Math.round(gdpPerCapita).toLocaleString() : '-', 
                averageMunicipalitySize: avgSize ? Math.round(avgSize).toLocaleString() + ' pop.' : '-',
                urbPop: urbPop ? urbPop.toFixed(1) + '%' : '-', 
                sngExpenditure: exp ? exp.toFixed(1) + '%' : '-',
                sngRevenue: rev ? rev.toFixed(1) + '%' : '-',
                sngDebt: debt ? debt.toFixed(1) + '%' : '-',
                sngInvestment: inv ? inv.toFixed(1) + '%' : '-'
            };
            if(name === "United States") {
                out["United States of America"] = out[name];
            }
        }
    }
    fs.mkdirSync('public/api', { recursive: true });
    fs.writeFileSync('public/api/oecd.json', JSON.stringify(out, null, 2));
    console.log("Done. Output to public/api/oecd.json. Keys: ", Object.keys(out).length);
}
run();
