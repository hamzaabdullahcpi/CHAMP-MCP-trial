import dotenv from 'dotenv';
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

const headers = {
  Authorization: `Bearer ${pat}`,
  'Content-Type': 'application/json'
};

async function airtableFetch(url: string, options: any = {}) {
  const res = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable error ${res.status}: ${text}`);
  }
  return res.json();
}

async function syncAllAction1() {
  console.log('--- Starting Full Action 1 Airtable Sync ---');

  // 1. Actions Table
  const actionsData = await airtableFetch(`https://api.airtable.com/v0/${baseId}/Actions`);
  const a1 = actionsData.records.find((r: any) => r.fields['Action Number'] === 1 || r.fields['Action Number'] === '1');
  if (!a1) throw new Error('Action 1 not found');

  await airtableFetch(`https://api.airtable.com/v0/${baseId}/Actions/${a1.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      fields: {
        'Title': 'Develop Shared Commitments, Political Alignment and Ownership',
        'Description': 'This Action helps national governments to build shared climate commitments with cities and subnational governments. It supports governments to align priorities, clarify responsibilities and establish a common direction for climate finance and implementation. It also includes guidance to engage businesses, finance actors, civil society, academia and communities in supporting climate finance and implementation.',
        'Systems Logic': 'Scaling climate finance requires both political alignment across levels of government and broad ownership among the actors financing and implementing climate action. Shared commitments can connect national climate goals with local priorities, investment needs and financing responsibilities. Building on this, broader stakeholder engagement between governments and private sector can bring additional finance, expertise and resources.'
      }
    })
  });
  console.log('✓ Action 1 updated');

  // 2. Pathways Table
  const pathwaysData = await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways`);
  const p1 = pathwaysData.records.filter((r: any) => r.fields['Belongs to Action']?.includes(a1.id));

  const p1_1 = p1.find((r: any) => r.fields['Order'] === 1 || String(r.fields['Pathway Title']).includes('1.1'));
  const p1_2 = p1.find((r: any) => r.fields['Order'] === 2 || String(r.fields['Pathway Title']).includes('1.2'));

  if (p1_1) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways/${p1_1.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Pathway Title': '1.1 Joint Climate Commitments',
          'Overview': 'Joint climate commitments provide a shared framework for governments to align around common climate goals. They define complementary responsibilities across national, subnational and city governments. This helps address fragmented climate action and investment decisions across government levels. Commitments can link political goals to climate action and transition plans, investment priorities and financing responsibilities. This creates a clearer pathway from shared ambition to coordinated implementation and finance mobilization.',
          'What it is': '',
          'Why it is needed': '',
          'Enabling Conditions': '',
          'Transferability Considerations': `• Adapt the form of the commitment to the governance context. Countries can adopt more formal, vertical national-city commitments, or more voluntary local-government covenants or other arrangements suited to their constitutional and institutional structures.
• Set a common floor while allowing differentiated commitments. Establish a small set of core commitments for participating governments, while allowing cities to add more ambitious or more detailed commitments based on their climate priorities, institutional capacity and readiness.
• Build from pioneer municipalities in contexts with low readiness levels. In contexts where national coordination exists unevenly or is not strong enough to sustain long-term joint commitments, a national government help build momentum by backing a few municipalities that are already willing to move ahead, then help them work as a cluster and share experience.
• Align commitments with existing political and budgeting cycles so that those become part of routine government decision-making. Periodic reviews can then be used to update commitments based on implementation progress and emerging political priorities.`
        }
      })
    });
    console.log('✓ Pathway 1.1 updated');
  }

  if (p1_2) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways/${p1_2.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Pathway Title': '1.2 Whole-of-Society Partnerships for Climate Action and Investment',
          'Overview': 'Whole-of-society partnerships bring government, businesses, investors, civil society, academia and communities together around shared climate priorities. Governments cannot finance and deliver climate action alone. Businesses, utilities, investors and communities control assets, finance, expertise and other resources needed for implementation. Whole-of-society partnerships therefore help governments to align these actors and help mobilize additional financing and capacities. This can build broader ownership of climate action and strengthen long-term implementation.',
          'What it is': '',
          'Why it is needed': '',
          'Enabling Conditions': '',
          'Transferability Considerations': `• Adapt the engagement model to the governance and institutional context. A strong municipal government may be able to establish a dedicated transition arena, while lower-capacity contexts may begin with lighter forums and progressively strengthen the model as relationships and capacity develop.
• Start with willing and capable local actors and build outward. Where local capacity is uneven, governments can support pioneer municipalities that are already willing to move ahead, encourage them to cluster and share experience, and use their experience to build a wider engagement model over time.
• Use the platform to progressively strengthen collective capacity. The model can deepen from dialogue and relationship-building toward co-designing portfolios, taking action and embedding new ways of working.`
        }
      })
    });
    console.log('✓ Pathway 1.2 updated');
  }

  // 3. Sync Implementation Guidance for Action 1 pathways
  console.log('Syncing Implementation Guidance records...');
  const gData = await airtableFetch(`https://api.airtable.com/v0/${baseId}/Implementation%20Guidance`);
  const p1Ids = [p1_1?.id, p1_2?.id].filter(Boolean);
  const existingG1 = gData.records.filter((r: any) => r.fields['Belongs to Pathway']?.some((id: string) => p1Ids.includes(id)));

  for (const r of existingG1) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Implementation%20Guidance/${r.id}`, { method: 'DELETE' });
  }

  const guidanceDefinitions = [
    // 1.1
    {
      pathwayId: p1_1.id,
      steps: [
        {
          title: 'Establish shared climate and investment priorities',
          content: 'Work with subnational governments to identify local priorities that contribute to national climate commitments and investment objectives.',
          order: 1
        },
        {
          title: 'Define complementary commitments and responsibilities across levels of government',
          content: 'Clarify what each level will finance, regulate, coordinate, enable or implement. Identify areas where responsibilities and financing needs are shared.',
          order: 2
        },
        {
          title: 'Connect commitments to investment planning',
          content: 'Link agreed priorities to climate plans, budgets, investment portfolios and project pipelines. Identify financing needs and potential sources of support. This can help to influence resource allocation and investment decisions.',
          order: 3
        },
        {
          title: 'Create a recurring review and renewal process',
          content: 'Review progress with participating governments and identify common policy, financing and implementation barriers. Use these findings to update commitments and national support.',
          order: 4
        }
      ]
    },
    // 1.2
    {
      pathwayId: p1_2.id,
      steps: [
        {
          title: 'Identify the stakeholders needed to finance and deliver priority projects',
          content: 'Map who controls relevant assets, finance, expertise, technologies or services. Include public, private, academic and community actors.',
          order: 1
        },
        {
          title: 'Create sustained platforms for multistakeholder collaboration',
          content: 'Use existing forums or establish dedicated platforms for government and non-government actors. Focus discussions on shared priorities, investment needs and implementation barriers.',
          order: 2
        },
        {
          title: 'Feed multistakeholder priorities into finance and implementation decisions',
          content: 'Ensure priorities and commitments emerging from these platforms can feed into climate and investment plans, procurement, policy development and implementation',
          order: 3
        },
        {
          title: 'Include vulnerable communities in investment decisions',
          content: 'Ensure that communities can shape investment priorities and implementation approaches. Give particular attention to groups most exposed to climate risks.',
          order: 4
        }
      ]
    }
  ];

  for (const group of guidanceDefinitions) {
    for (const step of group.steps) {
      await airtableFetch(`https://api.airtable.com/v0/${baseId}/Implementation%20Guidance`, {
        method: 'POST',
        body: JSON.stringify({
          fields: {
            'Step Title': step.title,
            'Detailed Content': step.content,
            'Step Order': step.order,
            'Belongs to Pathway': [group.pathwayId]
          }
        })
      });
    }
  }
  console.log('✓ All Action 1 Implementation Guidance steps synchronized');

  // 4. Update Key Resources / Illustrative Examples
  console.log('Updating Illustrative Examples in Key Resources...');
  const keyResourcesData = await airtableFetch(`https://api.airtable.com/v0/${baseId}/Key%20Resources`);
  const p1Examples = keyResourcesData.records?.filter((r: any) => r.fields['Belongs to Pathway']?.some((id: string) => p1Ids.includes(id))) || [];

  const swedenExample = p1Examples.find((r: any) => String(r.fields['Example Title']).toLowerCase().includes('joint commitment') || String(r.fields['Example Title']).toLowerCase().includes('climate city contract'));
  const comssaExample = p1Examples.find((r: any) => String(r.fields['Example Title']).toLowerCase().includes('covenant of mayors') || String(r.fields['Example Title']).toLowerCase().includes('com ssa'));
  const transitionArenaExample = p1Examples.find((r: any) => String(r.fields['Example Title']).toLowerCase().includes('transition arena'));
  const townHallExample = p1Examples.find((r: any) => String(r.fields['Example Title']).toLowerCase().includes('town hall'));

  if (swedenExample) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Key%20Resources/${swedenExample.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Example Title': 'Joint Commitment Process, Climate City Contacts',
          'Full Text / Concept Explanation': 'The Joint Commitment process of Climate City Contracts demonstrates how political commitment can become a recurring multilevel governance arrangement. As part of Sweden’s Climate City Contracts, municipalities, national government agencies and Viable Cities, as Sweden’s national coordination platform, make complementary commitments around a shared climate-neutrality mission, review progress annually and renew priorities. The contract links climate goals, a roadmap or portfolio of actions and a climate investment plan, connecting political commitment to implementation and financing. Sweden’s model has expanded from nine municipalities in 2019 to 48 municipalities, with annual renewal creating continuity across political and administrative cycles.',
          'Excerpt': 'The Joint Commitment process of Climate City Contracts demonstrates how political commitment can become a recurring multilevel governance arrangement...',
          'Learn More URL': 'https://viablecities.se/klimatkontrakt-2030'
        }
      })
    });
    console.log('✓ Sweden Climate City Contracts example updated');
  }

  if (comssaExample) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Key%20Resources/${comssaExample.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Example Title': 'Covenant of Mayors in Sub-Saharan Africa (CoM SSA)',
          'Full Text / Concept Explanation': 'Since its launch in 2015, CoM SSA has mobilised political commitment for climate action from more than 400 local governments across 42 countries, representing over 166 million citizens. As the regional chapter of the Global Covenant of Mayors for Climate and Energy, it supports local governments to develop evidence-based climate and energy plans, translate priorities into implementation and finance-ready pipelines, and strengthen local capabilities and ownership. CoM SSA also brings finance actors and international and regional partners into the process through early financial diagnostics, upstream engagement and cooperation formats, while its Regional Mayors Forum provides a political platform for African mayors to connect local priorities with wider regional and global decision-making.',
          'Excerpt': 'Since its launch in 2015, CoM SSA has mobilised political commitment for climate action from more than 400 local governments across 42 countries, representing over 166 million citizens...',
          'Learn More URL': 'https://comssa.org/'
        }
      })
    });
    console.log('✓ CoM SSA example updated');
  }

  if (transitionArenaExample) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Key%20Resources/${transitionArenaExample.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Example Title': 'Transition Arenas',
          'Full Text / Concept Explanation': 'Transition Arenas are convening mechanisms within the Climate City Contract process. These arenas create a local space for municipalities to bring together businesses, public organisations, academia, civil society and residents around the climate transition. They provide a sustained ecosystem for collaboration, co-creation and development of locally adapted transition portfolios. The arenas are intended to build collective capacity over time, connect actors with different mandates and resources, and enable climate action to move beyond the municipality’s direct responsibilities into areas where companies, communities and other actors have agency.',
          'Excerpt': 'Transition Arenas are convening mechanisms within the Climate City Contract process. These arenas create a local space for municipalities to bring together businesses, public organisations, academia, civil society and residents...',
          'Learn More URL': 'https://netzerocities.app/QR-CCC'
        }
      })
    });
    console.log('✓ Transition Arenas example updated');
  }

  if (townHallExample) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Key%20Resources/${townHallExample.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Example Title': 'Town Hall COPs',
          'Full Text / Concept Explanation': 'Town Hall COPs are a strong emerging example of how multilevel dialogues and commitments can help bridge local implementation with national climate strategy and planning. Launched by ICLEI Africa in 2025, the format gives local governments and communities a dedicated space to discuss climate goals, jointly review progress and identify next steps in line with national plans and global commitments. The Town Halls also bring in national government representatives (with national presence recorded at 60% of events) so local priorities could be heard directly and fed into NDC and NAP implementation. By October 2025, 18 Town Hall COPs were convened, engaging over 2000 participants, across six Sub-Saharan African countries. These participants ranged from mayors and national agency officials to the youth and civil society. The dialogues helped to develop and surface over 300 local commitments.',
          'Excerpt': 'Town Hall COPs are a strong emerging example of how multilevel dialogues and commitments can help bridge local implementation with national climate strategy and planning...',
          'Learn More URL': 'https://iclei.org/town-hall-cop/'
        }
      })
    });
    console.log('✓ Town Hall COPs example updated');
  }

  console.log('--- Action 1 Airtable Sync Complete! ---');
}

syncAllAction1().catch(e => {
  console.error('Action 1 sync failed:', e);
  process.exit(1);
});
