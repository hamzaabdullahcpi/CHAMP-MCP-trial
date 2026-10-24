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

async function syncAllAction5() {
  console.log('--- Starting Full Action 5 Airtable Sync ---');

  // 1. Actions Table
  const actionsData = await airtableFetch(`https://api.airtable.com/v0/${baseId}/Actions`);
  const a5 = actionsData.records.find((r: any) => r.fields['Action Number'] === 5 || r.fields['Action Number'] === '5');
  if (!a5) throw new Error('Action 5 not found');

  await airtableFetch(`https://api.airtable.com/v0/${baseId}/Actions/${a5.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      fields: {
        'Title': 'Mobilize Finance, Shape Markets and Deliver Investment Portfolios',
        'Description': 'This Action helps national governments mobilize finance and support the delivery of urban climate investment portfolios. It covers local investment structures, de-risking mechanisms, collaborative implementation and market-shaping through procurement. Together, these approaches can connect prepared portfolios with finance, implementation partners and market demand.',
        'Systems Logic': 'Project portfolios need financing mechanisms and implementation capacity to move into delivery. Locally anchored investment structures can connect projects with suitable sources of capital. De-risking mechanisms can make investments more attractive to public and private financiers. Collaborative implementation mechanisms and market shaping approaches can then support delivery, aggregate demand and enable successful solutions to scale.'
      }
    })
  });
  console.log('✓ Action 5 updated');

  // 2. Pathways
  const pathwaysData = await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways`);
  const p5 = pathwaysData.records.filter((r: any) => r.fields['Belongs to Action']?.includes(a5.id));

  const p5_1 = p5.find((r: any) => r.fields['Order'] === 1 || String(r.fields['Pathway Title']).includes('5.1'));
  const p5_2 = p5.find((r: any) => r.fields['Order'] === 2 || String(r.fields['Pathway Title']).includes('5.2'));
  const p5_3 = p5.find((r: any) => r.fields['Order'] === 3 || String(r.fields['Pathway Title']).includes('5.3'));
  const p5_4 = p5.find((r: any) => r.fields['Order'] === 4 || String(r.fields['Pathway Title']).includes('5.4'));

  if (p5_1) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways/${p5_1.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Pathway Title': '5.1 Locally Anchored Multilevel Climate Finance Structures',
          'Overview': 'Locally anchored climate investment structures connect climate portfolios with suitable financing and implementation arrangements available at the city level. Climate portfolios often include investments with different owners, risks, returns and levels of readiness. A single financing source or vehicle may not be suitable for the entire portfolio. Local investment structures help organise these investments and match them with appropriate sources of finance. These structures can take the form of trust funds, SPVs, green bonds programs or other financing vehicles depending on local market conditions and capacities.',
          'What it is': '',
          'Why it is needed': '',
          'Enabling Conditions': '',
          'Transferability Considerations': `• Tailor the financing structure to the fiscal system, borrowing regulations, tax base and market maturity: Where decentralization and private-sector depth are stronger, local trust funds or similar vehicles may work well; where responsibilities are devolved but fiscal space is limited, devolved funds may be a better fit; and in more unitary systems, country- or donor-led funds, like the LoCAL program, may need to be channelled through existing fiscal transfer mechanisms. In context where local governments have creditworthiness, a green bond framework like Lund could be utilized.
• When setting up a climate investment fund, start with a focused investment portfolio, aligned with national priorities and plans, so that investor confidence improves and external finance could be mobilized.
• Carefully structure SPVs for project financing and implementation. SPVs are legally complex and expensive downscaling to smaller projects requires careful packaging and de-risking for banks and commercial investors to participate.
• Regardless of where the fund gets anchored, enable local planning control while bringing in external capital through multilevel partnerships, so finance supports locally defined and locally led climate priorities.`,
          'Key Actors': ['National Government', 'Subnational Government', 'Development Finance Institutions', 'Multilateral Development Banks', 'Commercial Banks', 'Special Purpose Vehicles']
        }
      })
    });
    console.log('✓ Pathway 5.1 updated');
  }

  if (p5_2) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways/${p5_2.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Pathway Title': '5.2 Innovative Financial Mechanisms',
          'Overview': 'Innovative financial mechanisms help mobilize and scale climate investment by improving financing conditions and investor confidence. They help address barriers arising from high or uncertain risks, costs or expected returns. These can include catalytic capital, guarantees, concessional finance, financial aggregation, insurance etc. They can be used within blended finance structures to incentivize private investment. When linked to strong governance, investment portfolios and local investment structures, they can help governments use limited public resources to mobilize larger pools of capital.',
          'What it is': '',
          'Why it is needed': '',
          'Enabling Conditions': '',
          'Transferability Considerations': `• Match the financial mechanisms and tools to legal and regulatory conditions, capacities of multilevel actors, risk-return profiles of projects and market maturity. Catalytic funding could be most effective in low-capacity contexts that require initial upfront capital to demonstrate implementation capabilities to crowd in additional finance. Insurance and risk pooling are most transferable where climate-disaster exposure is the main challenge to fiscal resilience; local-currency guarantees fit contexts where the main constraints include currency risk and perceived financial strength of a local government. Pooled borrowing works where municipalities want lower-cost market access or have small ticket sizes and limited creditworthiness to access the market individually.
• Replication works best when a trusted intermediary can hold the mandate, coordinate actors and manage risk. For example, Viable Cities plays that coordinating role for the Viability fund, linking it with EU grants opportunities, local trust funds, systems demonstrators etc and the wider multilateral initiatives. Similarly, ICLEI and PIDG play the coordinating, implementation or capacity building roles for UIIF and InfraCredit respectively.
• Adopt a phased approach for transferability in lower-capacity contexts. UIIFs’ seven-stage roadmap shows that de-risking instruments are more transferable when they are introduced step-by-step, giving cities and parters time to align data, governance and build capacities progressively. Similarly, Viability Fund also plans to adopt a phased approach, focusing on a few high potential projects, cities and partnerships to demonstrate early success and help inspire other actors to replicate the model.
• Embed the tools within existing domestic governance systems, portfolios, investors and financial structures. InfraCredit works well when anchored in a sovereign institution and domestic capital markets to mobilize local institutional investors which would benefit from local currency guarantees. Kommuninvest works well because it is owned jointly by municipalities and is tied to their joint guarantees. Viability fund similarly looks to invest in local investment structures from the outset to maximize the impact of its mobilized funds.`,
          'Key Actors': ['National Development Banks', 'Development Finance Institutions', 'National Government', 'Subnational Government', 'Private Investors', 'Insurers']
        }
      })
    });
    console.log('✓ Pathway 5.2 updated');
  }

  if (p5_3) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways/${p5_3.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Pathway Title': '5.3 Collaborative Portfolio Implementation Environments',
          'Overview': 'A collaborative portfolio implementation environment is a place-based setup where public, private and civic actors jointly implement, test and adapt solutions. These environments align finance, procurement, governance, organisational cultures and technologies around a common climate mission. They help address barriers that individual projects or portfolios cannot resolve alone by enabling actors to jointly deliver, learn and adapt. This can generate evidence, partnerships and institutional changes needed to move successful interventions towards investment and scale.',
          'What it is': '',
          'Why it is needed': '',
          'Enabling Conditions': '',
          'Transferability Considerations': `• Transfer the core functions of implementation environments, while keeping the institutional form adaptable. The transferable core is a defined local system or place, a shared mission, system mapping, a portfolio approach, continuous orchestration, learning and pathways to finance and scale. The institution leading these functions should reflect the governance context.
• Keep implementation locally grounded. Deep transition challenges cannot be solved by externally assembled consortia alone. Local actors with knowledge, mandate, relationships and implementation capacity should anchor the process, while external partners add specialist capabilities. The examples cited above defined their own local priorities, i.e., decarbonization in Lund, land aggregation in Bristol or project preparation for low-carbon building retrofits in Central Asia.
• Embed implementation in the institution best placed to provide political mandate, coordination and continuity. Where local governments have sufficient autonomy and capacity (e.g., system demonstrators in Lund, Bristol and Bogota), they can anchor the process directly; where they do not, national ministries, international agencies or other intermediaries (i.e., CCFLA for Local Hubs or a national agency, NIUA, in CITIIS 2.0) can provide the convening power and long-term ownership needed to sustain implementation and scale.
• Funding and participation arrangements should fit the governance and institutional context. Whether participating members in a portfolio implementation environment have funded roles, in-kind contributions or voluntary commitments will vary by fiscal capacities, partnership needs and the enabling environments – what matters is that the model is strong enough to sustain engagement and keep the implementation environment moving. For example, the Swedish system demonstrators funded all consortium partners while the local hubs engaged stakeholders without direct funding.
• Phase the implementation based on system readiness. In contexts with low readiness levels, implementation should focus on diagnostics, convening, mapping and coalition building (e.g., Central Asia Hub). As readiness increases, focus should shift towards investment planning, testbed selection and portfolio development (see Action 4 for guidance on these). Full implementation should be financed once the mission is co-owned, the coordination function is in place, stakeholders are mobilized, barriers are known and a portfolio is in place.
• Use clear, accessible language and simplify the methodology where necessary. In lower-capacity contexts especially, guidance should focus on practical outputs in simple terminology.
• Connect local implementation to national systems from the beginning. Demonstrators are more likely to scale when local evidence can inform national policy, funding programmes, investment priorities and future climate plans. Some System Demonstrators, e.g., in Uganda, have demonstrated that weak national-local institutional connections can constrain scaling even when local demonstration is successful.
• Build in a pathway from implementation to scale from the outset. The model is more transferable when it linked from the outset to investment, procurement and replication routes. These pathways may involve national governments, DFIs, PPFs or international donors, depending on the funding context and portfolio readiness. For example, EnergyNet is expected to scale through the Viability Fund, The Bristol fund scaled via the UK Small Sites Aggregator, and Central Asia Hub is expected to scale through project preparation pathways involving Gap Fund, FELICITY II, and financing pathways involving GCF and EIB.`,
          'Key Actors': ['Subnational Government', 'National Government', 'Utilities', 'Civil Society', 'Private Investors', 'Infrastructure Developers']
        }
      })
    });
    console.log('✓ Pathway 5.3 updated');
  }

  if (p5_4) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways/${p5_4.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Pathway Title': '5.4 Aggregation as a Market-Shaping and Industrial Transition Mechanism',
          'Overview': 'Aggregation can help to coordinate purchasing demand across public and private buyers for climate-aligned goods, services and infrastructure. Buyers can coordinate demand while retaining separate budgets and contracts or combine purchasing through a single tender. National governments can support aggregation across cities and align purchasing demand with national climate and industrial priorities. Fragmented purchasing limits predictable market signals and can discourage suppliers from investing in low-carbon production. To this end, aggregations can helps to create larger and more predictable demand, giving suppliers greater confidence to invest and expand production. It can also reduce costs and help governments scale climate solutions across multiple cities.',
          'What it is': '',
          'Why it is needed': '',
          'Enabling Conditions': '',
          'Transferability Considerations': `• Use the procurement model that fits the capacity and governance context. This may be a trust fund with built-in governance, a nationally coordinated tender, or a city-level mandate; the transferable core is the combination of political mandate, technical support, and clear criteria for aggregating demand.
• Choose an appropriate procurement jurisdiction based on capacities and governance arrangements. Where cities have strong procurement authority and large infrastructure pipelines, intra-city aggregation can shape markets within one jurisdiction. Where capacities or enabling conditions are weaker at the municipal level, pooling between cities can work, but it usually needs a national intermediary or coordinator to standardize and hold the process together, as in RAMCC and India’s Grand Challenge.
• Adapt the procurement objectives based on national climate priorities. For example, cities can focus on procurement models for low-carbon construction materials or e-buses where national priorities include renewable energy and decarbonization, so the market signal reinforces the wider policy direction.`,
          'Key Actors': ['Procurement Actors', 'National Government', 'Subnational Government', 'Infrastructure Developers', 'Private Investors']
        }
      })
    });
    console.log('✓ Pathway 5.4 updated');
  }

  // 3. Sync Implementation Guidance for Action 5 pathways
  console.log('Syncing Implementation Guidance records...');
  const gData = await airtableFetch(`https://api.airtable.com/v0/${baseId}/Implementation%20Guidance`);
  const p5Ids = [p5_1?.id, p5_2?.id, p5_3?.id, p5_4?.id].filter(Boolean);
  const existingG5 = gData.records.filter((r: any) => r.fields['Belongs to Pathway']?.some((id: string) => p5Ids.includes(id)));

  for (const r of existingG5) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Implementation%20Guidance/${r.id}`, { method: 'DELETE' });
  }

  const guidanceDefinitions = [
    // 5.1
    {
      pathwayId: p5_1.id,
      steps: [
        { title: 'Identify local investment needs and financing gaps', content: 'Start from city investment plans and portfolios. Assess project ownership, readiness, financing needs and potential revenue sources.', order: 1 },
        { title: 'Determine the appropriate investment structure', content: 'Large infrastructure projects may be placed in SPVs or bond-financed vehicles; smaller projects may use trust funds or other pooled local vehicles; catalytic capital, guarantees and concessional support can then sit alongside these structures to reduce risk and crowd in larger pools of finance.', order: 2 },
        { title: 'Clarify national and local roles', content: 'Define which level of government will own, govern, manage the structure. Maintain national stewardship with local ownership of investment priorities and implementation decisions.', order: 3 },
        { title: 'Connect structures with national finance', content: 'Link investment structures with national funding programmes, development banks and fiscal transfers. Use national support where it can improve access to capital.', order: 4 },
        { title: 'Bring external finance into the structure', content: 'Engage donors, DFIs, commercial banks and investors based on portfolio needs. Identify where concessional or catalytic finance and de-risking is required.', order: 5 },
        { title: 'Build long-term management capacity', content: 'Ensure the structure can prepare investments, manage capital and monitor performance. Use experienced intermediaries where local capacity is limited.', order: 6 },
      ]
    },
    // 5.2
    {
      pathwayId: p5_2.id,
      steps: [
        { title: 'Identify financing barriers across urban investment portfolios', content: 'Work with cities and finance partners to identify risks, financing gaps and other barriers affecting priority investments.', order: 1 },
        { title: 'Match financial tools to specific barriers', content: 'Identify where catalytic grants, guarantees, insurance, concessional finance, local currency financing or other tools could improve financing conditions and investor confidence.', order: 2 },
        { title: 'Use public finance strategically', content: 'Through blended finance, target national or concessional resources where they can reduce risks and mobilize additional public or private investment.', order: 3 },
        { title: 'Enable access to suitable financial instruments', content: 'Work with NDBs, MDBs, DFIs and other partners to make appropriate instruments available to subnational investments.', order: 4 },
        { title: 'Support aggregation where appropriate', content: 'Bundle similar projects or financing needs across cities to achieve scale and improve access to financial instruments.', order: 5 },
        { title: 'Align financial instruments with national programmes', content: 'Integrate them into existing funding programmes or investment structures where possible.', order: 6 },
        { title: 'Monitor finance mobilized', content: 'Track whether financial mechanisms are addressing barriers and mobilizing additional investment into urban climate priorities, and adjust approach accordingly.', order: 7 },
      ]
    },
    // 5.3
    {
      pathwayId: p5_3.id,
      steps: [
        { title: 'Identify priorities that require coordinated implementation', content: 'Select investment areas involving multiple projects, institutions or sectors. Link them to national climate and investment priorities.', order: 1 },
        { title: 'Support locally defined implementation environments', content: 'Enable cities to define the local challenge, intended outcomes and implementation area. Build on existing local institutions and investment priorities. The portfolio should connect governance, finance, procurement, regulation, behaviour and technology so that the combined effect shifts the system, not just individual parts of it.', order: 2 },
        { title: 'Bring together the actors needed for implementation', content: 'Engage relevant government agencies, utilities, businesses, financiers, communities and other actors around the portfolio. This is important because the system demonstrator experience showed that starting with existing solutions often reproduces incremental pilots rather than creating space for more transformative approaches.', order: 3 },
        { title: 'Provide funding and support for implementation', content: 'Connect local implementation environments with national programmes, grants, technical assistance and other resources. Allow sufficient flexibility for learning and adaptation.', order: 4 },
        { title: 'Establish strong coordination and orchestration', content: 'Ensure dedicated capacity exists to coordinate actors, track implementation, address barriers and maintain progress across the portfolio.', order: 5 },
        { title: 'Use implementation to reduce investment risk', content: 'Gather evidence on costs, performance, business models and financing needs. Use this evidence to strengthen future investment decisions.', order: 6 },
        { title: 'Create pathways to finance and scale', content: 'Connect successful interventions with project preparation, additional finance, procurement and national programmes. Support replication across other cities where appropriate.', order: 7 },
      ]
    },
    // 5.4
    {
      pathwayId: p5_4.id,
      steps: [
        { title: 'Identify priority markets for aggregation', content: 'Focus on goods, services or infrastructure linked to national climate and investment priorities. Consider where stronger demand could accelerate market development.', order: 1 },
        { title: 'Map demand across cities and other buyers', content: 'Identify common purchasing needs, expected volumes and procurement timelines. Include public and private buyers where appropriate.', order: 2 },
        { title: 'Select an appropriate aggregation model', content: 'Determine whether buyers should coordinate purchasing requirements while keeping separate budgets or use pooled procurement under a single tender. Adapt the model to national procurement rules and capacities.', order: 3 },
        { title: 'Develop common standards and specifications', content: 'Support participating buyers to align technical, climate and performance requirements. Allow flexibility in choosing product or material specification based on local needs and capacities.', order: 4 },
        { title: 'Engage suppliers and finance partners early', content: 'Consult manufacturers, developers and financiers to understand market capacity, costs and investment barriers. Use these findings to strengthen procurement design.', order: 5 },
        { title: 'Provide national enabling support', content: 'Address regulatory barriers that cities cannot resolve alone. Provide technical assistance, funding or incentives where needed.', order: 6 },
        { title: 'Connect aggregation with financing', content: 'Ensure participating cities can finance the projects over the long term, for which they are aggregating demand. Consider national funding, concessional finance or guarantees where affordability remains a barrier.', order: 7 },
        { title: 'Monitor results and expand successful approaches', content: 'Track costs, climate outcomes, supplier response and implementation challenges. Apply lessons to future procurement rounds and additional cities or sector.', order: 8 },
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
  console.log('✓ All Action 5 Implementation Guidance steps synchronized');

  // 4. Update Key Resources and Concept boxes
  const cData = await airtableFetch(`https://api.airtable.com/v0/${baseId}/Concept%20%26%20Explainer%20Boxes`);
  const blendedBox = cData.records?.find((r: any) => String(r.fields['Box Title']).includes('Blended Finance'));
  if (blendedBox) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Concept%20%26%20Explainer%20Boxes/${blendedBox.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Box Title': 'What is Blended Finance?',
          'Excerpt / Summary': 'Blended finance is the strategic use of a limited amount of concessional public or philanthropic capital to mobilize additional finance, primarily from commercial and private sources — toward sustainable development and climate goals.',
          'Full Text / Explanation': `Blended finance is the strategic use of a limited amount of concessional public or philanthropic capital to mobilize additional finance, primarily from commercial and private sources — toward sustainable development and climate goals. Rather than a single financial instrument, it is a structuring approach: public actors (donors, development agencies, philanthropies, and development finance institutions) absorb or share risks that would otherwise deter private investors, improving a project's risk-return profile enough to attract market-rate capital. The concessional capital at the core of a blended structure can take several forms, including grants, concessional debt or equity, guarantees, and other risk-sharing facilities. These de-risking mechanisms matter most in emerging markets and developing economies, where country-specific risk accounts for between 60 and 90 percent of investors' risk considerations, and where about 80–90 percent of climate mitigation investment is expected to come from the private sector. The overarching goal is to crowd in private money that would not have been invested otherwise, deploying only as much public subsidy as is needed to make a project viable.`,
          'Placement / Section': 'Overview',
          'Tag / Category': 'Financial Mechanism'
        }
      })
    });
    console.log('✓ Concept box What is Blended Finance updated');
  }

  console.log('--- Action 5 Airtable Sync Complete! ---');
}

syncAllAction5().catch(e => {
  console.error('Sync failed:', e);
  process.exit(1);
});
