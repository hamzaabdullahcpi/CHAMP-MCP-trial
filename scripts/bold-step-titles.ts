import dotenv from 'dotenv';
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

const headers = {
  Authorization: `Bearer ${pat}`,
  'Content-Type': 'application/json'
};

async function boldStepTitlesInAirtable() {
  console.log('=== Updating Step Title in Airtable Implementation Guidance Table to Bold ===');

  let allRecords: any[] = [];
  let offset: string | undefined;

  do {
    const url = `https://api.airtable.com/v0/${baseId}/Implementation%20Guidance${offset ? `?offset=${offset}` : ''}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${await res.text()}`);
    }
    const data = await res.json();
    allRecords = allRecords.concat(data.records || []);
    offset = data.offset;
  } while (offset);

  console.log(`Found ${allRecords.length} records in Implementation Guidance.`);

  let updatedCount = 0;
  // Airtable allows batch updates of up to 10 records per request
  for (let i = 0; i < allRecords.length; i += 10) {
    const batch = allRecords.slice(i, i + 10);
    const recordsToUpdate: any[] = [];

    for (const record of batch) {
      const currentTitle = String(record.fields['Step Title'] || '').trim();
      if (!currentTitle) continue;

      // Remove existing surrounding ** if any to normalize, then wrap in **
      const unbolded = currentTitle.replace(/^\*\*+|\*\*+$/g, '').trim();
      const boldedTitle = `**${unbolded}**`;

      if (currentTitle !== boldedTitle) {
        recordsToUpdate.push({
          id: record.id,
          fields: {
            'Step Title': boldedTitle
          }
        });
      }
    }

    if (recordsToUpdate.length > 0) {
      const patchRes = await fetch(`https://api.airtable.com/v0/${baseId}/Implementation%20Guidance`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ records: recordsToUpdate })
      });

      if (!patchRes.ok) {
        const errText = await patchRes.text();
        console.error(`Batch update error:`, errText);
      } else {
        updatedCount += recordsToUpdate.length;
        console.log(`Updated batch of ${recordsToUpdate.length} records (${updatedCount} total).`);
      }
    }
  }

  console.log(`=== Finished: Successfully updated ${updatedCount} step titles in Airtable! ===`);
}

boldStepTitlesInAirtable();
