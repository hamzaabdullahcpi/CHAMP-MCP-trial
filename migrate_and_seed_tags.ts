import dotenv from 'dotenv';
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getTables() {
  const res = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${pat}` }
  });
  const data = await res.json();
  return data.tables || [];
}

async function fetchAllRecords(tableName: string) {
  let records: any[] = [];
  let offset = '';
  do {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?pageSize=100${offset ? `&offset=${offset}` : ''}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${pat}` }
    });
    const data = await res.json();
    if (data.records) {
      records = records.concat(data.records);
    }
    offset = data.offset || '';
    if (offset) await sleep(200);
  } while (offset);
  return records;
}

async function updateRecords(tableName: string, records: { id: string; fields: any }[]) {
  for (let i = 0; i < records.length; i += 10) {
    const chunk = records.slice(i, i + 10);
    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records: chunk })
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(`Error updating in ${tableName}:`, JSON.stringify(data));
    } else {
      console.log(`✓ Updated ${chunk.length} records in "${tableName}"`);
    }
    await sleep(250);
  }
}

async function createRecords(tableName: string, fieldsArray: any[]) {
  for (let i = 0; i < fieldsArray.length; i += 10) {
    const chunk = fieldsArray.slice(i, i + 10);
    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records: chunk.map(fields => ({ fields })) })
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(`Error creating in ${tableName}:`, JSON.stringify(data));
    } else {
      console.log(`✓ Created ${chunk.length} records in "${tableName}"`);
    }
    await sleep(250);
  }
}

async function main() {
  console.log("Starting Airtable Single-Select Tags Migration and Content Enhancement...");
  const tables = await getTables();

  // =========================================================================
  // 1. MIGRATE 'Country Sections' FIELDS TO SINGLE-SELECT
  // =========================================================================
  const countrySectionsTable = tables.find((t: any) => t.name === 'Country Sections');
  if (countrySectionsTable) {
    console.log("\n--- Processing 'Country Sections' ---");
    const currentFields = countrySectionsTable.fields;
    
    // Check if 'Belongs to Country' needs migration
    const btcField = currentFields.find((f: any) => f.name === 'Belongs to Country' && f.type !== 'singleSelect');
    if (btcField) {
      console.log("Migrating 'Belongs to Country' to singleSelect...");
      await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${countrySectionsTable.id}/fields/${btcField.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Belongs to Country (Old Text)' })
      });
      await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${countrySectionsTable.id}/fields`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Belongs to Country',
          type: 'singleSelect',
          description: 'Country identifier',
          options: {
            choices: [
              { name: 'sweden', color: 'blueLight2' },
              { name: 'brazil', color: 'greenLight2' },
              { name: 'morocco', color: 'orangeLight2' }
            ]
          }
        })
      });
      console.log("✓ 'Belongs to Country' singleSelect created.");
    }

    // Populate data for Country Sections
    const secRecords = await fetchAllRecords('Country Sections');
    const secUpdates: any[] = [];
    for (const r of secRecords) {
      const oldType = r.fields['Section Type (Old Text)'] || r.fields['Section Type'] || (r.fields['Order'] <= 2 ? 'Central Premise' : 'Context Section');
      const normType = String(oldType).toLowerCase().includes('premise') ? 'Central Premise' : 'Context Section';
      const oldCountry = r.fields['Belongs to Country (Old Text)'] || r.fields['Belongs to Country'] || 'sweden';
      const normCountry = String(oldCountry).toLowerCase().includes('brazil') ? 'brazil' : String(oldCountry).toLowerCase().includes('morocco') ? 'morocco' : 'sweden';

      secUpdates.push({
        id: r.id,
        fields: {
          'Section Type': normType,
          'Belongs to Country': normCountry
        }
      });
    }
    if (secUpdates.length > 0) {
      await updateRecords('Country Sections', secUpdates);
    }
  }

  // =========================================================================
  // 2. MIGRATE 'Country Actions' FIELDS TO SINGLE-SELECT & ADD ACTION 5 CASE STUDY
  // =========================================================================
  const countryActionsTable = tables.find((t: any) => t.name === 'Country Actions');
  if (countryActionsTable) {
    console.log("\n--- Processing 'Country Actions' ---");
    const currentFields = countryActionsTable.fields;

    const themeField = currentFields.find((f: any) => f.name === 'Action Theme Tag' && f.type !== 'singleSelect');
    if (themeField) {
      console.log("Migrating 'Action Theme Tag' to singleSelect...");
      await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${countryActionsTable.id}/fields/${themeField.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Action Theme Tag (Old Text)' })
      });
      await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${countryActionsTable.id}/fields`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Action Theme Tag',
          type: 'singleSelect',
          options: {
            choices: [
              { name: '• Shared Commitments', color: 'blueLight2' },
              { name: '• Enabling Environments', color: 'tealLight2' },
              { name: '• Institutionalize MLG', color: 'purpleLight2' },
              { name: '• Plan Investments', color: 'yellowLight2' },
              { name: '• Mobilize Finance & Delivery', color: 'greenLight2' },
              { name: '• Monitor & Learn', color: 'pinkLight2' }
            ]
          }
        })
      });
      console.log("✓ 'Action Theme Tag' singleSelect created.");
    }

    const btcFieldAct = currentFields.find((f: any) => f.name === 'Belongs to Country' && f.type !== 'singleSelect');
    if (btcFieldAct) {
      console.log("Migrating 'Belongs to Country' to singleSelect...");
      await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${countryActionsTable.id}/fields/${btcFieldAct.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Belongs to Country (Old Text)' })
      });
      await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${countryActionsTable.id}/fields`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Belongs to Country',
          type: 'singleSelect',
          options: {
            choices: [
              { name: 'sweden', color: 'blueLight2' },
              { name: 'brazil', color: 'greenLight2' },
              { name: 'morocco', color: 'orangeLight2' }
            ]
          }
        })
      });
      console.log("✓ 'Belongs to Country' singleSelect created.");
    }

    // Populate and update all Action records, including Action 5 EnergyNet Case Study
    const actRecords = await fetchAllRecords('Country Actions');
    const actUpdates: any[] = [];
    for (const r of actRecords) {
      const actNum = Number(r.fields['Action Number']);
      let themeTag = '• Shared Commitments';
      if (actNum === 1) themeTag = '• Shared Commitments';
      else if (actNum === 2) themeTag = '• Enabling Environments';
      else if (actNum === 3) themeTag = '• Institutionalize MLG';
      else if (actNum === 4) themeTag = '• Plan Investments';
      else if (actNum === 5) themeTag = '• Mobilize Finance & Delivery';
      else if (actNum === 6) themeTag = '• Monitor & Learn';

      const fieldsToUpdate: any = {
        'Action Theme Tag': themeTag,
        'Belongs to Country': 'sweden'
      };

      // Specifically check Action 4 and Action 5 for Sweden
      if (actNum === 4) {
        fieldsToUpdate['Case Study Title'] = "Case: EnergyNet’s Portfolio Approach";
        fieldsToUpdate['Case Study Content'] = "EnergyNet shows why transition priorities need to be organized as portfolios rather than standalone projects. Emerging as a “game-changer” intervention through CoAction Lund's work on local energy systems, EnergyNet is a decentralized local electricity network architecture that enables buildings, vehicles and local energy resources to share renewable electricity, reducing dependence on conventional grid reinforcement.\n\nIts implementation is connected to a wider set of interventions across buildings, energy infrastructure, mobility and multiple public and private actors. The portfolio approach helps identify these interdependencies and the combination of actions needed to enable the transition, while also surfacing investment needs and barriers for further preparation.";
      } else if (actNum === 5) {
        fieldsToUpdate['Case Study Title'] = "Case: Local Climate Investment Frameworks (EnergyNet Use Case)";
        fieldsToUpdate['Case Study Content'] = "EnergyNet in Lund illustrates how a local transition intervention moves from a system demonstrator into an investable framework. By interconnecting buildings, vehicles, and renewable resources in Brunnshög, EnergyNet demonstrated decentralised power sharing. To scale across other Swedish municipalities, it is being structured through Local Climate Investment Frameworks and the Viability Fund for Cities, combining municipal assets with catalytic de-risking and private capital.";
      }

      actUpdates.push({
        id: r.id,
        fields: fieldsToUpdate
      });
    }

    if (actUpdates.length > 0) {
      await updateRecords('Country Actions', actUpdates);
    }
  }

  // =========================================================================
  // 3. MIGRATE 'Country Journeys' STATUS FIELD TO SINGLE-SELECT
  // =========================================================================
  const countryJourneysTable = tables.find((t: any) => t.name === 'Country Journeys');
  if (countryJourneysTable) {
    console.log("\n--- Processing 'Country Journeys' ---");
    const currentFields = countryJourneysTable.fields;
    const statusField = currentFields.find((f: any) => f.name === 'Status' && f.type !== 'singleSelect');
    if (statusField) {
      console.log("Migrating 'Status' to singleSelect...");
      await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${countryJourneysTable.id}/fields/${statusField.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Status (Old Text)' })
      });
      await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${countryJourneysTable.id}/fields`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Status',
          type: 'singleSelect',
          options: {
            choices: [
              { name: 'Available', color: 'greenLight2' },
              { name: 'Coming Soon', color: 'orangeLight2' },
              { name: 'Draft', color: 'yellowLight2' },
              { name: 'In Review', color: 'blueLight2' }
            ]
          }
        })
      });
      console.log("✓ 'Status' singleSelect created.");
    }

    const cjRecords = await fetchAllRecords('Country Journeys');
    const cjUpdates: any[] = [];
    for (const r of cjRecords) {
      const oldStatus = r.fields['Status (Old Text)'] || r.fields['Status'] || (r.fields['Is Ready'] ? 'Available' : 'Coming Soon');
      const normStatus = String(oldStatus).toLowerCase().includes('avail') ? 'Available' : 'Coming Soon';
      cjUpdates.push({
        id: r.id,
        fields: {
          'Status': normStatus
        }
      });
    }
    if (cjUpdates.length > 0) {
      await updateRecords('Country Journeys', cjUpdates);
    }
  }

  // =========================================================================
  // 4. MIGRATE 'Concept & Explainer Boxes' TAG TO SINGLE-SELECT & ADD ENERGYNET BOX
  // =========================================================================
  const conceptBoxesTable = tables.find((t: any) => t.name === 'Concept & Explainer Boxes');
  if (conceptBoxesTable) {
    console.log("\n--- Processing 'Concept & Explainer Boxes' ---");
    const currentFields = conceptBoxesTable.fields;
    const tagField = currentFields.find((f: any) => f.name === 'Tag / Category' && f.type !== 'singleSelect');
    if (tagField) {
      console.log("Migrating 'Tag / Category' to singleSelect...");
      await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${conceptBoxesTable.id}/fields/${tagField.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Tag / Category (Old Text)' })
      });
      await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${conceptBoxesTable.id}/fields`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Tag / Category',
          type: 'singleSelect',
          options: {
            choices: [
              { name: 'Financial Mechanism', color: 'greenLight2' },
              { name: 'Core Concept', color: 'blueLight2' },
              { name: 'Local Investment Structure', color: 'purpleLight2' },
              { name: 'Governance & Policy', color: 'yellowLight2' },
              { name: 'Procurement & Demand', color: 'orangeLight2' },
              { name: 'Implementation Framework', color: 'tealLight2' }
            ]
          }
        })
      });
      console.log("✓ 'Tag / Category' singleSelect created.");
    }

    // Check existing records in Concept & Explainer Boxes
    const conceptRecords = await fetchAllRecords('Concept & Explainer Boxes');
    const conceptUpdates: any[] = [];
    let hasEnergyNetBox = false;

    // Fetch Pathway 5.1 record ID to link
    const pathways = await fetchAllRecords('Pathways');
    const pathway51 = pathways.find((p: any) => String(p.fields['Pathway Number']) === '5.1' || String(p.fields['Pathway Title']).toLowerCase().includes('finance'));
    const pathway51Id = pathway51 ? [pathway51.id] : undefined;

    for (const r of conceptRecords) {
      const title = r.fields['Box Title'] || '';
      if (title.toLowerCase().includes('energynet')) {
        hasEnergyNetBox = true;
      }
      let cat = 'Core Concept';
      if (title.toLowerCase().includes('blended')) cat = 'Financial Mechanism';
      else if (title.toLowerCase().includes('ppf') || title.toLowerCase().includes('preparation')) cat = 'Core Concept';
      else if (title.toLowerCase().includes('energynet')) cat = 'Local Investment Structure';

      conceptUpdates.push({
        id: r.id,
        fields: {
          'Tag / Category': cat
        }
      });
    }

    if (conceptUpdates.length > 0) {
      await updateRecords('Concept & Explainer Boxes', conceptUpdates);
    }

    if (!hasEnergyNetBox) {
      console.log("Adding 'Local Climate Investment Frameworks (The EnergyNet Model)' to Concept & Explainer Boxes...");
      await createRecords('Concept & Explainer Boxes', [{
        'Box Title': 'Local Climate Investment Frameworks (The EnergyNet Model)',
        'Tag / Category': 'Local Investment Structure',
        'Placement / Section': 'Illustrative Examples',
        'Excerpt / Summary': 'How decentralized municipal energy projects like EnergyNet in Lund move from system demonstrators to structured local climate investment frameworks supported by catalytic and private finance.',
        'Full Text / Explanation': 'System Demonstrators like CoAction Lund show how a city-led innovation ecosystem can test decentralized energy infrastructure such as EnergyNet on the ground. By enabling buildings, vehicles, and renewable assets to share electricity, EnergyNet surfaced key regulatory, grid code, and market barriers. To scale beyond innovation grants, Local Climate Investment Frameworks provide the structuring mechanisms needed to aggregate project cash flows, clarify risk-return profiles, and connect municipal portfolios with catalytic and commercial capital through instruments like the Viability Fund for Cities.',
        'Order': 1,
        ...(pathway51Id ? { 'Belongs to Pathway': pathway51Id } : {})
      }]);
      console.log("✓ Added EnergyNet Explainer Box.");
    }
  }

  console.log("\n🎉 All migrations and content updates completed successfully!");
}

main().catch(console.error);
