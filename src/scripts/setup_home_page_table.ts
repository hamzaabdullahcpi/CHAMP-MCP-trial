import dotenv from 'dotenv';
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

async function createHomePageTable() {
  if (!baseId || !pat) {
    console.error("Missing AIRTABLE_BASE_ID or AIRTABLE_PAT");
    return;
  }

  console.log("Checking if 'Home Page' table exists in Airtable...");
  const schemaRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${pat}` }
  });

  if (!schemaRes.ok) {
    console.error("Failed to fetch tables schema:", await schemaRes.text());
    return;
  }

  const schemaData = await schemaRes.json();
  let homeTable = schemaData.tables?.find((t: any) => 
    t.name.toLowerCase() === 'home page' || 
    t.name.toLowerCase() === 'landing page' ||
    t.name.toLowerCase() === 'home content' ||
    t.name.toLowerCase() === 'home page content'
  );

  if (!homeTable) {
    console.log("Creating 'Home Page' table in Airtable...");
    const createRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Home Page",
        description: "Content, copy, and settings displayed on the Home / Landing page",
        fields: [
          {
            name: "Label / Element",
            type: "singleLineText",
            description: "Human-friendly label describing what this field controls on the home page"
          },
          {
            name: "Item Key",
            type: "singleLineText",
            description: "System identifier for the content item (e.g. hero_title, hero_description, partnership_title)"
          },
          {
            name: "Section",
            type: "singleSelect",
            options: {
              choices: [
                { name: "Hero Banner" },
                { name: "Partnership & Support" },
                { name: "General" }
              ]
            }
          },
          {
            name: "Text Content",
            type: "multilineText",
            description: "The main text or copy displayed on the home page"
          },
          {
            name: "Sub-Text / Secondary",
            type: "multilineText",
            description: "Optional secondary text, subtitle, or badge label"
          },
          {
            name: "Image / Link URL",
            type: "url",
            description: "URL for image, logo, or outbound link"
          },
          {
            name: "Notes / Guidance",
            type: "multilineText",
            description: "Helpful notes on where and how this appears on the home page"
          }
        ]
      })
    });

    if (!createRes.ok) {
      console.error("Failed to create 'Home Page' table:", await createRes.text());
      return;
    }

    homeTable = await createRes.json();
    console.log("✓ 'Home Page' table created successfully! Table ID:", homeTable.id);
  } else {
    console.log(`'Home Page' table already exists (Table ID: ${homeTable.id}, Name: "${homeTable.name}").`);
  }

  // Now let's check if the table has existing records
  console.log(`Checking records in '${homeTable.name}' table...`);
  const recordsRes = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(homeTable.name)}`, {
    headers: { Authorization: `Bearer ${pat}` }
  });

  const recordsData = await recordsRes.json();
  const existingRecords = recordsData.records || [];
  console.log(`Found ${existingRecords.length} existing records in '${homeTable.name}'.`);

  // Default seed records for the Home Page
  const seedItems = [
    {
      "Label / Element": "Hero Eyebrow / Tag",
      "Item Key": "hero_eyebrow",
      "Section": "Hero Banner",
      "Text Content": "A toolkit for national governments, cities and friends of CHAMP",
      "Notes / Guidance": "Uppercase tag displayed inside the badge at the top of the hero banner"
    },
    {
      "Label / Element": "Hero Main Title & Badge",
      "Item Key": "hero_title",
      "Section": "Hero Banner",
      "Text Content": "Toolkit",
      "Sub-Text / Secondary": "CHAMP",
      "Notes / Guidance": "Main banner heading. Sub-Text controls the highlighted 'CHAMP' badge text."
    },
    {
      "Label / Element": "Hero Subtitle",
      "Item Key": "hero_subtitle",
      "Section": "Hero Banner",
      "Text Content": "for Multilevel Climate Investment.",
      "Notes / Guidance": "Secondary heading line directly below the main title"
    },
    {
      "Label / Element": "Hero Description",
      "Item Key": "hero_description",
      "Section": "Hero Banner",
      "Text Content": "Supporting the ‘CHAMP Investment Pledge’ delivery through guidance on policy reform, governance, investment pipelines, project aggregation and financial instruments.",
      "Notes / Guidance": "Main introductory summary paragraph displayed in the hero banner"
    },
    {
      "Label / Element": "Hero Background Image",
      "Item Key": "hero_image_url",
      "Section": "Hero Banner",
      "Image / Link URL": "/images/hero-city.jpg",
      "Text Content": "/images/hero-city.jpg",
      "Notes / Guidance": "Background city photography displayed in the hero banner header"
    },
    {
      "Label / Element": "Partnership Section Title",
      "Item Key": "partnership_title",
      "Section": "Partnership & Support",
      "Text Content": "A Joint Contribution to CHAMP",
      "Notes / Guidance": "Heading for the joint contribution / partnership footer card"
    },
    {
      "Label / Element": "Partnership Description",
      "Item Key": "partnership_description",
      "Section": "Partnership & Support",
      "Text Content": "This toolkit is a strategic partnership between CCFLA and Viable Cities. A key goal of this toolkit is to showcase impactful multilevel governance initiatives championed in Sweden.",
      "Notes / Guidance": "Paragraph explaining the strategic partnership between CCFLA and Viable Cities, and showcasing Sweden"
    },
    {
      "Label / Element": "Partner 1: CCFLA",
      "Item Key": "partner_1",
      "Section": "Partnership & Support",
      "Text Content": "CCFLA",
      "Image / Link URL": "https://www.climatepolicyinitiative.org/wp-content/uploads/2020/09/CCFLA-hero.png",
      "Notes / Guidance": "First partner organization name and logo image URL"
    },
    {
      "Label / Element": "Partner 2: Viable Cities",
      "Item Key": "partner_2",
      "Section": "Partnership & Support",
      "Text Content": "Viable Cities",
      "Image / Link URL": "https://images.squarespace-cdn.com/content/v1/59e86b55aeb625e2140eec1a/1634044375194-3G0ZG1T5HGMGNB2QSEYU/1.+VC_Logotyp_PRIM%C3%84R_RGB.png",
      "Notes / Guidance": "Second partner organization name and logo image URL"
    },
    {
      "Label / Element": "Supported By Sponsor",
      "Item Key": "supported_by",
      "Section": "Partnership & Support",
      "Text Content": "Sweden",
      "Sub-Text / Secondary": "Supported by",
      "Image / Link URL": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Sweden.svg/3840px-Flag_of_Sweden.svg.png",
      "Notes / Guidance": "Supporting country / sponsor name, label, and flag/logo URL"
    },
    {
      "Label / Element": "Learn More: CCFLA Link",
      "Item Key": "learn_more_ccfla",
      "Section": "Partnership & Support",
      "Text Content": "CCFLA",
      "Image / Link URL": "https://citiesclimatefinance.org",
      "Notes / Guidance": "External website URL for CCFLA shown in the Learn More links."
    },
    {
      "Label / Element": "Learn More: Viable Cities Link",
      "Item Key": "learn_more_viable_cities",
      "Section": "Partnership & Support",
      "Text Content": "Viable Cities",
      "Image / Link URL": "https://viablecities.se",
      "Notes / Guidance": "External website URL for Viable Cities shown in the Learn More links."
    }
  ];

  if (existingRecords.length === 0) {
    console.log("Seeding default home page content into Airtable...");
    for (const item of seedItems) {
      console.log(`Inserting: ${item["Label / Element"]}...`);
      const insertRes = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(homeTable.name)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pat}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: item
        })
      });
      if (!insertRes.ok) {
        console.error(`Failed to insert record:`, await insertRes.text());
      }
    }
    console.log("✓ Successfully seeded all Home Page content into Airtable!");
  } else {
    console.log("Home Page table already contains records. Verifying keys...");
    const existingKeys = existingRecords.map((r: any) => r.fields["Item Key"] || r.fields["Key"]);
    for (const item of seedItems) {
      if (!existingKeys.includes(item["Item Key"])) {
        console.log(`Adding missing key: ${item["Item Key"]}...`);
        await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(homeTable.name)}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${pat}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: item
          })
        });
      }
    }
    console.log("✓ Home Page table verified and updated.");
  }
}

createHomePageTable().catch(console.error);
