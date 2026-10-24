const https = require('https');
https.get('https://sdmx.oecd.org/public/rest/data/OECD.CFE.RDG,DSD_SNG_WOFI@DF_SOCIO,1.0/all?startPeriod=2016&dimensionAtObservation=AllDimensions', { headers: { 'Accept': 'application/vnd.sdmx.data+json; charset=utf-8; version=2.0' } }, (resp) => {
  let data = '';
  resp.on('data', (c) => data += c);
  resp.on('end', () => { 
      let dim = JSON.parse(data).data.structures[0].dimensions.observation;
      let measure = dim.find(d => d.id === 'MEASURE' || d.id === 'INDICATOR' || d.id.includes('IND'));
      let um = dim.find(d => d.id === 'UNIT_MEASURE');
      console.log("MEASURE:\\n", measure.values.map(v => v.id + '=' + v.name).join('\\n'));
      console.log("UNIT_MEASURE:\\n", um.values.map(v => v.id + '=' + v.name).join('\\n'));
  });
});
