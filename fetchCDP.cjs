const https = require('https');
const url = 'https://www.sng-wofi.org/country_profiles/presentation.html';
https.get(url, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log(body.substring(0, 500));
    const links = [...body.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    console.log("Found links:", links.slice(0, 10));
  });
});
