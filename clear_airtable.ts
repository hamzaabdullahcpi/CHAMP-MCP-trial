import fetch from 'node-fetch';

const baseId = process.env.AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT;
const headers = { 'Authorization': `Bearer ${pat}` };

async function clearTable(tableName: string) {
    let url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
    let records: any[] = [];
    do {
        const res = await fetch(url, { headers });
        const data: any = await res.json();
        if (data && data.records) records.push(...data.records);
        url = data && data.offset ? `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?offset=${data.offset}` : null;
    } while (url);

    for (let i = 0; i < records.length; i += 10) {
        const batch = records.slice(i, i + 10).map((r: any) => `records[]=${r.id}`).join('&');
        await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?${batch}`, {
            method: 'DELETE',
            headers
        });
        await new Promise(r => setTimeout(r, 200));
    }
    console.log(`Cleared ${records.length} from ${tableName}`);
}

async function run() {
    await clearTable('Sub-Examples');
    await clearTable('Illustrative Examples');
    await clearTable('Implementation Guidance');
    await clearTable('Further Resources');
    await clearTable('Pathways');
    await clearTable('Actions');
}
run();
