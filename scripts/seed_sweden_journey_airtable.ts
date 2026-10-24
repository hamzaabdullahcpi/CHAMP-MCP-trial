import dotenv from 'dotenv';
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT;

if (!baseId || !pat) {
  console.error("Missing AIRTABLE_BASE_ID or AIRTABLE_PAT");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${pat}`,
  "Content-Type": "application/json"
};

async function airtableFetch(endpoint: string, options: any = {}) {
  const url = `https://api.airtable.com/v0/${baseId}/${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Airtable error [${res.status}] ${url}: ${errText}`);
  }
  return res.json();
}

async function batchDelete(table: string, ids: string[]) {
  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10);
    const query = batch.map(id => `records[]=${id}`).join('&');
    await airtableFetch(`${encodeURIComponent(table)}?${query}`, { method: 'DELETE' });
    console.log(`Deleted ${batch.length} records from ${table}`);
  }
}

async function batchCreate(table: string, records: any[]) {
  const results: any[] = [];
  for (let i = 0; i < records.length; i += 10) {
    const batch = records.slice(i, i + 10);
    const data = await airtableFetch(encodeURIComponent(table), {
      method: 'POST',
      body: JSON.stringify({ records: batch, typecast: true })
    });
    results.push(...data.records);
    console.log(`Created ${batch.length} records in ${table}`);
  }
  return results;
}

async function main() {
  const swedenJourneyId = "recgwOcFk9uoOHWB3";

  console.log("=== STEP 1: Updating Sweden Country Journey Record ===");
  await airtableFetch(`Country%20Journeys/${swedenJourneyId}`, {
    method: "PATCH",
    body: JSON.stringify({
      fields: {
        "Actions Heading": "Sweden's Journey Across the 5 Actions",
        "Actions Subtitle": "Below sections describe how Sweden has embarked on the 5 Actions as part of its multilevel climate finance and implementation journey.",
        "Tab B Subtitle": "Architecture Diagram & 5 Multilevel Governance Actions",
        "Model Overview": "Sweden’s experience brings together mechanisms at different stages of maturity. Viable Cities, Climate City Contract 2030, the Coordination Function and System Demonstrators are established components, while Local Climate Investment Structures, the Viability Fund for Cities and stronger aggregated-demand and finance interfaces are being developed. The diagram above shows how these programs form a continuous multilevel implementation system. \n\nBelow sections describe how Sweden has embarked on the 5 Actions as part of its multilevel climate finance and implementation journey."
      }
    })
  });
  console.log("✓ Updated Sweden Country Journey headings and overview.");

  console.log("=== STEP 2: Updating Country Section text if referencing six actions ===");
  try {
    const sectionRes = await airtableFetch("Country%20Sections");
    const targetSection = (sectionRes.records || []).find((s: any) =>
      String(s.fields["Content"]).includes("six Actions")
    );
    if (targetSection) {
      const updatedContent = String(targetSection.fields["Content"]).replace("six Actions", "five Actions");
      await airtableFetch(`Country%20Sections/${targetSection.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          fields: {
            "Content": updatedContent
          }
        })
      });
      console.log(`✓ Updated Country Section ${targetSection.id} to reference five Actions.`);
    }
  } catch (e: any) {
    console.warn("Could not check/update Country Sections:", e.message);
  }

  console.log("=== STEP 3: Cleaning up old Sweden Country Actions ===");
  const caRes = await airtableFetch("Country%20Actions");
  const oldSwedenActions = (caRes.records || []).filter((r: any) => {
    const belongs = r.fields["Belongs to Country"];
    if (Array.isArray(belongs)) return belongs.includes(swedenJourneyId) || belongs.includes("sweden");
    return belongs === swedenJourneyId || String(belongs).toLowerCase() === "sweden";
  });

  const oldActionIds = oldSwedenActions.map((r: any) => r.id);
  console.log(`Found ${oldActionIds.length} old Sweden actions to delete:`, oldActionIds);
  if (oldActionIds.length > 0) {
    await batchDelete("Country Actions", oldActionIds);
  }

  console.log("=== STEP 4: Creating 5 Sweden Country Actions according to new 5 action logic ===");
  const newActions = [
    {
      fields: {
        "Action Number": 1,
        "Action Theme Tag": "• Commitments & Platforms",
        "Title": "Establish Multilevel Commitments and Platforms for Climate Investment",
        "Content": `Climate City Contract 2030 (CCC) provides a recurring process for municipalities, national agencies and Viable Cities to establish and renew shared climate commitments. Transition Arenas extend local ownership to businesses, academia and civil society, while Joint Commitments help groups of municipalities address shared challenges.

Viable Cities serves as Sweden's national coordination platform, connecting municipalities, six national agencies and wider transition actors. Its dedicated Coordination Function identifies recurring municipal needs, facilitates national–local collaboration and feeds lessons into subsequent CCC cycles. National agencies also use joint action planning to connect their commitments with national programmes and policy instruments.

Building on this experience, the emerging Viability Fund for Cities is exploring ways to coordinate different funding sources across government levels, around urban climate investment portfolios. It seeks to connect systemic implementation with finance, demand and wider scaling. Its architecture combines three reinforcing functions: 

1) ALIGN, focused on aligning funders, programmes and implementation partners around common System Demonstrators principles; 
2) CO-FINANCE, mobilizing catalytic capital to help scale opportunities emerging from System Demonstrators, transition portfolios and local climate investment structures; and
3) DEMAND, connecting these efforts with aggregated demand and market shaping.`,
        "Enabled & Opportunity": "Sweden has expanded from nine participating municipalities in 2019 to 48, establishing recurring multilevel commitments and coordination. The opportunity is to strengthen connections between these arrangements, investment decisions and national support.",
        "Belongs to Country": "sweden"
      }
    },
    {
      fields: {
        "Action Number": 2,
        "Action Theme Tag": "• Enabling Environments",
        "Title": "Strengthen Enabling Environments for Climate Investment",
        "Content": `Sweden's approach illustrates a continuous process of assessing enabling-environments. Climate City Contracts and Transition Arenas have surfaced implementation barriers and needs, while the Coordination Function identifies recurring governance and finance gaps across municipalities.

System Demonstrators deepen this diagnostic function through real-world implementation. They examine key barriers and transformation potential across governance, regulation, finance and business models, infrastructure, behaviour and technology, allowing cities and partners to understand not only whether an intervention works but what surrounding conditions must change for systemic transformation to occur.`,
        "Enabled & Opportunity": "barriers identified through local experience can become inputs into subsequent portfolios, coordination and policy discussions. The opportunity is converting dispersed implementation evidence into sufficiently systematic information that national actors can act upon.",
        "Belongs to Country": "sweden"
      }
    },
    {
      fields: {
        "Action Number": 3,
        "Action Theme Tag": "• Investment Portfolios",
        "Title": "Plan, Prepare and Implement Climate Investment Portfolios",
        "Content": `Climate City Contracts help to translate shared commitments into locally owned transition priorities. Through Transition Arenas and related planning processes, municipalities and their partners organize these priorities into transition portfolios, which include interconnected actions spanning investment, policy, governance, procurement and capacity. As these portfolios mature, cities can identify their investment needs and develop investment plans for the components requiring finance. This process is still at different stages across participating municipalities, so not all Swedish cities yet have mature investment plans.

Transition portfolios also provide the strategic basis for System Demonstrators. While Climate City Contracts address the municipality's wider transition, System Demonstrators focus on more bounded systemic challenges and are increasingly grounded in cities' Climate City Contract priorities and portfolios. This helps ensure that demonstration activity contributes to the wider transition rather than operating as a standalone pilot. System Demonstrators’ role in implementing these portfolios and creating pathways to finance and scale is discussed under Action 4.`,
        "Case Study Title": "EnergyNet’s Portfolio Approach",
        "Case Study Content": "EnergyNet shows why transition priorities need to be organized as portfolios rather than standalone projects. EnergyNet is a decentralized local electricity network architecture that enables buildings, vehicles and local energy resources to share renewable electricity, reducing dependence on conventional grid reinforcement. It was identified as a potential system gamechanger within CoAction Lund’s work on local energy systems. Its implementation is connected to a wider set of interventions across buildings, energy infrastructure, mobility and multiple public and private actors. The portfolio approach helps identify these interdependencies and the combination of actions needed to enable the transition, while also surfacing investment needs and barriers for further preparation.",
        "Enabled & Opportunity": "Sweden has progressively connected shared political commitments with locally anchored portfolios and investment needs, creating a clearer bridge between climate governance and investment planning. The opportunity is to strengthen investment planning and preparation across municipalities with different levels of capacity and maturity, while retaining the broader systemic interventions needed to deliver the transition.",
        "Belongs to Country": "sweden"
      }
    },
    {
      fields: {
        "Action Number": 4,
        "Action Theme Tag": "• Mobilize Finance & Shape Markets",
        "Title": "Mobilize Finance and Shape Markets",
        "Content": `The transition portfolios developed under Climate City Contracts contain different types of interventions and therefore require different pathways to implementation and scale. Sweden is increasingly connecting three such functions: systemic implementation through System Demonstrators, preparation and financing through emerging Local Climate Investment Structures, and aggregated demand and market shaping to support wider uptake.

System Demonstrators help implement transition portfolios through interconnected interventions across governance, infrastructure, finance, technology and markets. Sweden's demonstrators in Lund and Stockholm illustrate how implementation can reveal investable opportunities, financing barriers and enabling conditions for wider adoption. As shown by Sweden’s Lund and Stockholm System Demonstrators, not every intervention needs to become a bankable project. Investment pipelines can emerge from the wider portfolio of systemic interventions rather than defining that portfolio itself.

This creates the rationale for emerging Local Climate Investment Structures. These are being conceptualised as locally anchored arrangements to translate suitable components of climate transition portfolios into prepared and financed investments. The proposed model combines two complementary functions:

• Local Transition Governance Function: Establishes local ownership and mandate, coordinates the wider transition portfolio, and supports monitoring and learning. This helps ensure that investment decisions remain connected to the city's wider climate priorities.
• Local Investment Function: Identifies and prepares investable opportunities within the portfolio, structures risks and financing arrangements, and matches investments with suitable sources of capital. This could include engaging financial institutions, mobilizing catalytic capital and identifying opportunities for reinvestment.

The conceptual framework illustrated below identifies five interconnected steps for developing these structures:
1. ANCHOR: Connect investment activity to locally defined transition priorities and establish a local mandate.
2. GOVERN: Clarify portfolio governance, ownership, decision-making and coordination.
3. PREPARE: Prioritise and prepare investments, including assessing their financing needs.
4. ORGANISE: Select an appropriate institutional and financial structure based on local circumstances.
5. CONNECT: Link local investment opportunities with national platforms, policymakers and financing partners.

Importantly, these structures are not envisaged as a single prescribed fund or financial vehicle. Depending on local circumstances, their functions could be delivered through municipal balance sheets, public banks, funds, trusts, SPVs, bonds or delegated fund managers. The underlying functions are intended to remain consistent, while their institutional and financial arrangements would reflect local mandates, fiscal capacities and market conditions.

Sweden already has a strong foundation for conventional municipal finance through Kommuninvest, which provides long-term pooled municipal debt. The emerging investment architecture is intended to complement this strength by addressing functions that debt alone does not provide, including early-stage preparation, catalytic or risk-bearing capital, portfolio structuring and coordination across multiple actors. A stronger interface between Kommuninvest, Viable Cities and locally anchored climate investment structures is therefore being explored. 

Finally, aggregated demand and market shaping initiatives emerging in Sweden provide a complementary route to scale. Ongoing work with First Mover Cities brings cities and other actors across urban value chains together to articulate shared needs, engage suppliers early and advance coordinated procurement and purchasing. These approaches are also being explored in connection with System Demonstrators, where a working hypothesis is that demonstrators could generate evidence and help de-risk solutions for wider adoption. Earlier visibility of aggregated, credible demand could also help identify which solutions have potential for demonstration, financing and scale.`,
        "Case Study Title": "EnergyNet: Illustrating the need for Local Climate Investment Structures in Sweden",
        "Case Study Content": `EnergyNet illustrates how systemic implementation can generate interconnected investment needs across multiple actors and assets. Identified as a potential system gamechanger within CoAction Lund, EnergyNet proposes a decentralised local energy architecture connecting buildings, utilities, grids, storage and mobility. Scaling this approach would require investments involving multiple public and private owners, with different risks, revenue models and financing requirements. Some investments may access conventional finance, while others may require project preparation, guarantees or catalytic capital.

EnergyNet is being explored as a practical use case for emerging Local Climate Investment Structures in Sweden. It can help test how investment opportunities within a wider transition portfolio might be prepared, coordinated and matched with appropriate sources of capital.`,
        "Enabled & Opportunity": "Sweden is beginning to connect systemic implementation, investment preparation, finance and market demand rather than treating them as separate processes. The key opportunity is now to strengthen these interfaces while maintaining local ownership and ensuring that finance supports the wider transition portfolio rather than narrowing it to standalone bankable projects.",
        "Belongs to Country": "sweden"
      }
    },
    {
      fields: {
        "Action Number": 5,
        "Action Theme Tag": "• Capacities & Networks",
        "Title": "Strengthen Capacities and Networks",
        "Content": `Collective capacity building have been central to how the Swedish model has expanded. Rather than expecting every municipality to develop transition capabilities independently, Viable Cities creates recurring spaces for cities to learn from one another and jointly develop approaches to shared challenges. Transition Arenas (discussed in Action 1) provide spaces for exchange, learning and joint problem-solving, while Joint Commitments enable groups of cities to develop approaches around common priorities and progress from different levels of readiness.

The Coordination Function helps carry this learning across the wider multilevel governance system. By analysing recurring municipal needs and experiences and facilitating dialogue between cities and national agencies, it can help turn learning from individual municipalities and initiatives into inputs for wider coordination and subsequent Climate City Contract cycles. In this way, learning can move both horizontally between cities and vertically between local and national levels, rather than remaining within individual projects or municipalities.

Learning is also increasingly connected to implementation and scaling. Joint Commitments are structured around Initiate, Establish and Transform, allowing cities to move from building shared understanding and capacity toward institutionalizing and scaling new approaches. System Demonstrators similarly capture learning through implementation and use it to identify institutional, investment and market pathways for wider adoption.

Sweden is also expanding international engagement to support implementation and scale. Viable Cities connects Swedish municipalities with European and international initiatives, creating opportunities to exchange expertise, develop common approaches and explore partnerships around climate investment. Emerging international collaborations on System Demonstrators aim to establish shared principles that can be adapted across countries, while connecting cities with technical expertise and potential implementation partners.

Engagement with the World Economic Forum's First Mover Cities cohort and Cities Climate Finance Leadership Alliance provides other examples of expanding international networks around aggregated purchasing and climate financing.`,
        "Enabled & Opportunity": "Sweden has developed a learning architecture connecting peer exchange, intermediary coordination, implementation experience and international partnerships. The opportunity is to translate learning into transformative changes in institutional capacity, policy and finance, and to scale approaches across places.",
        "Belongs to Country": "sweden"
      }
    }
  ];

  await batchCreate("Country Actions", newActions);
  console.log("✓ Successfully created 5 Sweden Country Actions in Airtable!");

  console.log("\n=======================================================");
  console.log(" Sweden Multilevel Model Updated to 5 Actions in Airtable! ");
  console.log("=======================================================");
}

main().catch(err => {
  console.error("FATAL ERROR in seeding Sweden Journey:", err);
  process.exit(1);
});
