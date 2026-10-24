# Airtable Backend Structure & Schema Guide for CHAMP Toolkit

This guide documents the standardized schema structure in Airtable for managing:
1. **Part 1: Core Action Pathways Toolkit** (Actions, Pathways, Implementation Guidance, Key Resources, Sub-Examples, Concept Boxes, and Additional Resources)
2. **Part 2: Country Multilevel Governance Journeys** (e.g., Sweden, Brazil, Morocco, or any new country)
3. **Home Page**: Dynamic landing page hero, branding, and partnership logos

---

## 🧭 Part 1: Core Action Pathways Toolkit Schema

### Table 1: `Actions`
Defines the 6 foundational actions of the toolkit.

| Field Name | Type | Description / Example |
| :--- | :--- | :--- |
| `Action Number` | Number | **Required.** Integer from `1` to `6`. |
| `Action Title` | Single line text | e.g. `De-risk and Scale Up Climate Investments Across Levels of Government`. |
| `Short Title` | Single line text | Concise name used in navigation and mobile tabs. |
| `Description` | Long text | Introductory banner / objective for this action. |
| `Systems Logic` | Long text | Explains how the pathways connect together systematically. |
| `Theme Color` | Single line text | Hex color code for the action (e.g. Action 1: `#154734`, Action 5: `#2563eb`). |
| `Pathways` | Linked record | Links to records in `Pathways`. |

---

### Table 2: `Pathways`
Defines the individual implementation pathways under each action.

| Field Name | Type | Description / Example |
| :--- | :--- | :--- |
| `Pathway Title` | Single line text | e.g. `Identify and develop a pipeline of bankable climate investment projects`. |
| `Belongs to Action` | Linked record / Number | Links to parent record in `Actions`. |
| `Pathway Order` | Number | Display order within the action (1, 2, 3, etc.). |
| `What it is` | Long text | Plain-language description of this pathway. |
| `Why it is needed` | Long text | Justification, systemic benefits, and gaps addressed. |
| `Key Actors` | Long text / Multiple select | Comma-separated or multi-select list of actors (e.g. `National Ministries, Municipalities, MDBs, Private Investors`). |
| `Transferability Considerations` | Long text | List of transferability insights (separated by newlines). |
| `Enabling Conditions` | Long text | List of institutional, legal, or financial enabling conditions (separated by newlines). |
| `Implementation Guidance` | Linked record | Links to records in `Implementation Guidance`. |
| `Key Resources` | Linked record | Links to records in `Key Resources`. |
| `Additional Resources` | Linked record | Links to records in `Additional Resources`. |
| `Concept & Explainer Boxes` | Linked record | Links to records in `Concept & Explainer Boxes`. |

---

### Table 3: `Implementation Guidance`
Defines the sequential implementation guidance points for each pathway.

> ℹ️ **Single Format Notice**: Guidance points are rendered in a **single uniform format** without separate bold headings. You can enter the complete guidance point in `Detailed Content` (or `Step Title`). If both are populated with distinct text, the system seamlessly combines them into a single continuous sentence (`Title: Content`).

| Field Name | Type | Description / Example |
| :--- | :--- | :--- |
| `Step Order` | Number | Sequence order (1, 2, 3...). |
| `Belongs to Pathway` | Linked record | Links to parent record in `Pathways`. |
| `Detailed Content` | Long text | **Full Guidance Text.** Complete guidance point written in a single continuous format. |
| `Step Title` | Single line text | Optional label/summary (if identical to `Detailed Content`, only one is shown). |

---

### Table 4: `Key Resources`
Defines illustrative examples and practical tools associated with each pathway.

| Field Name | Type | Description / Example |
| :--- | :--- | :--- |
| `Example Title` | Single line text | **Required.** Title of the case example or tool (e.g., `Sweden Viable Cities Platform`, `City Climate Finance Gap Fund`). |
| `Belongs to Pathway` | Linked record | Links to parent record in `Pathways`. |
| `Type` | Single select / Text | `Illustrative Example` or `Tool`. |
| `Order` | Number | **Display / Sequence Order** within the pathway (e.g. `1`, `2`, `3`...). Mark a number to control the display sequence of tools and illustrative examples (e.g. set `1` to appear first). |
| `Why see this / When to use this` | Long text / Single line | **Contextual guidance note.**<br>• For Tools: `When to use this: Use when identifying...`<br>• For Examples: `Why see this: See how locally defined climate investments...`<br>*(If left blank, the frontend automatically falls back to clean placeholder text until updated).* |
| `Excerpt` | Long text | Brief 1–2 sentence summary displayed on the card. |
| `Full Text / Concept Explanation` | Long text (Markdown) | Comprehensive case study text displayed in the detail modal. |
| `Learn More URL` | URL / Single line text | External link to source, tool portal, or publication. |
| `Sub-Examples` | Linked record | Links to records in `Sub-Examples`. |

---

### Table 5: `Sub-Examples`
Optional granular components or sub-initiatives nested under a parent Key Resource.

| Field Name | Type | Description / Example |
| :--- | :--- | :--- |
| `Sub-Example Title` | Single line text | Name of the specific program or case element. |
| `Belongs to Parent Example` | Linked record | Links to parent record in `Key Resources`. |
| `Excerpt` | Long text | Short summary. |
| `Full Text` | Long text (Markdown) | Detailed explanation. |
| `Learn More URL` | URL / Single line text | External link. |

---

### Table 6: `Additional Resources`
Curated studies, policy briefs, and reports supporting the pathway.

| Field Name | Type | Description / Example |
| :--- | :--- | :--- |
| `Resource Title` | Single line text | Title of publication or report. |
| `Belongs to Pathway` | Linked record | Links to parent record in `Pathways`. |
| `Resource Type` | Single select / Text | e.g. `Report / Study`, `Briefing Note`, `Policy Framework`. |
| `Publisher / Organization` | Single line text | e.g. `OECD`, `World Bank`, `WRI`, `UN-Habitat`. |
| `Description` | Long text | Summary of what the resource contains. |
| `Resource Link` | URL / Single line text | Direct link to read or download. |
| `Order` | Number | Sort order. |

---

### Table 7: `Concept & Explainer Boxes`
Deep-dive callout boxes attached either to the Overview tab or the Guidance tab.

| Field Name | Type | Description / Example |
| :--- | :--- | :--- |
| `Box Title` | Single line text | Title of the concept box. |
| `Belongs to Pathway` | Linked record | Links to parent record in `Pathways`. |
| `Tag / Category` | Single line text | e.g. `Core Concept`, `Mechanisms`, `Enabling Framework`. |
| `Placement / Section` | Single select | `Overview` or `Implementation Guidance`. |
| `Excerpt / Summary` | Long text | Short preview text. |
| `Full Text / Explanation` | Long text (Markdown) | Detailed explainer text. |
| `Learn More URL` | URL / Single line text | External link. |
| `Order` | Number | Sort order. |

---

## 🌍 Part 2: Country Multilevel Governance Journeys

To add or update country journeys (Sweden, Brazil, Morocco, or any new country), use the following tables:

### Table 8: `Country Journeys`
Defines the country profile, card overview, header content, and model diagram.

| Field Name | Type | Description / Example |
| :--- | :--- | :--- |
| `Country ID` | Single line text | **Required.** Unique slug (e.g. `sweden`, `brazil`, `morocco`). |
| `Country Name` | Single line text | Display name (e.g. `Sweden`, `Brazil`, `Morocco`). |
| `Flag Emoji` | Single line text | Country flag emoji (e.g. `🇸🇪`, `🇧🇷`, `🇲🇦`). |
| `Status` | Single select | `Available` or `Coming Soon`. |
| `Is Ready` | Checkbox | `true` if deep dive is active, `false` for coming soon outline. |
| `Tagline` | Single line text | Short subtitle on card. |
| `Summary` | Long text | Card description / paragraph overview. |
| `Key Mechanisms` | Long text / Multiple select | Bullet list or comma-separated highlights. |
| `Card Image URL` | URL / Single line text | Cover image for the Part II overview card. |
| `Theme Color` | Single line text | Hex color for branding (e.g. `#3c4799`, `#5d8d8b`, `#e8983c`). |
| `Header Title` | Single line text | Main headline on the country journey page. |
| `Header Subtitle` | Single line text | Subtitle (e.g. `• Sweden Deep Dive`). |
| `Header Description` | Long text | Introductory banner paragraph. |
| `Tab A Title` | Single line text | e.g. `The Swedish Context` or `The Brazilian Context`. |
| `Tab A Subtitle` | Single line text | Subtitle under Tab A. |
| `Premises Heading` | Single line text | e.g. `Two Central Premises of Sweden’s Multilevel Journey`. |
| `Premises Intro` | Long text | Short introductory sentence for premises. |
| `Tab B Title` | Single line text | e.g. `The Multilevel Model`. |
| `Tab B Subtitle` | Single line text | Subtitle under Tab B. |
| `Model Heading` | Single line text | e.g. `Sweden’s Multilevel Climate Governance and Implementation Model`. |
| `Model Overview` | Long text (Markdown) | Introductory explanation of the country's governance model. |
| `Model Diagram Note`| Long text | Note on zooming/panning. |
| `Diagram Image URL` | URL / Single line text | URL to the custom architecture graphic/diagram. |
| `Diagram Attachment`| Attachment | Image file uploaded directly. |
| `Diagram Image Alt` | Single line text | Alt text description for accessibility. |
| `Actions Heading` | Single line text | e.g. `Sweden's Journey Across the 6 Action Pathways`. |
| `Actions Subtitle`| Single line text | Sub-explanation for the 6 action mappings. |

---

### Table 9: `Country Sections`
Defines the editorial sections, premises, and narrative blocks inside **Tab A (The Context)**.

| Field Name | Type | Description / Example |
| :--- | :--- | :--- |
| `Title` | Single line text | Section title. |
| `Belongs to Country`| Linked record / Text | Links to parent country (`sweden`, `brazil`, `morocco`). |
| `Section Type` | Single select | `Context Section` or `Central Premise`. |
| `Order` | Number | Sort order (1, 2, 3...). |
| `Content` | Long text (Markdown) | Narrative paragraphs. |
| `Bullet Points` | Long text | Optional bullet list. |

---

### Table 10: `Country Actions`
Defines the mapping to the 6 Core Actions inside **Tab B (The Multilevel Model)**.

| Field Name | Type | Description / Example |
| :--- | :--- | :--- |
| `Belongs to Country`| Linked record / Text | Links to parent country (`sweden`, `brazil`, `morocco`). |
| `Action Number` | Number | Integer from `1` to `6`. |
| `Action Theme Tag` | Single line text | e.g. `• Shared Commitments`, `• Enabling Environments`. |
| `Title` | Single line text | Action title. |
| `Content` | Long text (Markdown) | Detailed explanation of how this country implements this action. |
| `Case Study Title` | Single line text | Optional case study headline. |
| `Case Study Content`| Long text (Markdown) | Case study explanation paragraphs. |
| `Enabled & Opportunity` | Long text | Summary box content: "What this has enabled & The Opportunity". |

---

### Table 11: `Country Journeys Overview`
Controls and feeds all header titles, tags, narrative paragraphs, and section headings on the main Country Journeys overview page.

| Field Name | Type | Description / Example |
| :--- | :--- | :--- |
| `Label / Element` | Single line text | Descriptive name of the element (e.g. `Page Title`, `Page Eyebrow / Tag`, `Featured Countries Section Title`). |
| `Item Key` | Single line text | System key matching `page_title`, `page_eyebrow`, `intro_p1`, `intro_p2`, `focus_note`, `featured_section_title`. |
| `Section` | Single select / Text | `Header` or `Content`. |
| `Text Content` | Long text | Primary text content to display on the page. |
| `Sub-Text / Secondary` | Single line text | Optional secondary text or subtitle. |
| `Notes / Guidance` | Single line text | Guidance note for editors. |

**Key Mappings:**
- `page_title`: Changes the main page H1 title (e.g., "Country Journeys").
- `page_eyebrow`: Changes the top badge (e.g., "Country Journeys").
- `intro_p1`: First introductory paragraph.
- `intro_p2`: Second introductory paragraph.
- `focus_note`: Special focus callout block with accent border.
- `featured_section_title`: Section title above the country cards (e.g., "Featured Country Journeys").

---

### Table 12: `Home Page`
Controls the landing page hero banner, description, partnership section, logos, and "Learn more" external links.

| Field Name | Type | Description / Example |
| :--- | :--- | :--- |
| `Label / Element` | Single line text | Descriptive name of the element (e.g. `Partner 1: CCFLA`, `Learn More: CCFLA Link`). |
| `Item Key` | Single line text | Key matching `hero_eyebrow`, `hero_title`, `hero_subtitle`, `hero_description`, `hero_image_url`, `partnership_title`, `partnership_description`, `partner_1`, `partner_2`, `supported_by`, `learn_more_ccfla`, `learn_more_viable_cities`. |
| `Section` | Single select | `Hero Banner`, `Partnership & Support`, or `General`. |
| `Text Content` | Long text | Text content (e.g., "CCFLA", "Viable Cities", or section paragraphs). |
| `Sub-Text / Secondary` | Long text | Secondary text (e.g., "Supported by" label, title badge, or URL fallback). |
| `Image / Link URL` | URL | Image or external hyperlink URL (e.g. `https://citiesclimatefinance.org`, `https://viablecities.se`). |
| `Notes / Guidance` | Long text | Guidance note for editors. |

**Key Mappings for Learn More Links:**
- `learn_more_ccfla`: Sets the external URL (in `Image / Link URL`) and optional label (in `Text Content`) for CCFLA under "Learn more:".
- `learn_more_viable_cities`: Sets the external URL (in `Image / Link URL`) and optional label (in `Text Content`) for Viable Cities under "Learn more:".
- `learn_more_label`: Optional override for the "Learn more:" prefix label.

---

## 🌟 Replicability & Fallback Guarantees

1. **Two-Tab Structure Across All Pathways**:
   - Every pathway across all 6 actions has exactly two tabs: **Overview** and **Implementation Guidance**.
   - **Key Resources Cards** are tightly packed and compact.
   - Both **Tool** and **Illustrative Example** badges share identical primary action theme styling.
   - Contextual guidance lines (`When to use this:` and `Why see this:`) share the identical vertical accent line color.
   - **Transferability Considerations** and **Enabling Conditions** are collapsed by default.

2. **Frontend Fallback Gracefulness**:
   - If `Why see this / When to use this` is empty in Airtable, the frontend automatically falls back to a clean placeholder so the layout remains pristine while backend updates are underway.
   - If Airtable credentials are not supplied or the network is unavailable, the application gracefully renders the built-in offline dataset.
