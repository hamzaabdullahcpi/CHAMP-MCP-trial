export interface ConnectionLineInfo {
  prefix: string; // e.g. "When to use this:" or "Why see this:"
  text: string;   // e.g. "Use when identifying which financial instruments..."
  fullLine: string; // "When to use this: Use when identifying..."
  overrideType?: 'Tool' | 'Illustrative Example';
}

export const ACTION_5_RESOURCE_CONNECTIONS: Record<string, {
  type: 'Tool' | 'Illustrative Example';
  prefix: 'When to use this:' | 'Why see this:';
  text: string;
}> = {
  // Pathway 5.1
  'kenya county climate change funds': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how locally defined climate investments can be financed through a structure combining local budgets, national systems and external climate finance.'
  },
  'kenya’s county climate change funds': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how locally defined climate investments can be financed through a structure combining local budgets, national systems and external climate finance.'
  },
  'milan for trees fund': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how a city can match smaller, place-based investments with a locally anchored structure combining municipal, business and citizen contributions.'
  },
  'bristol': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how locally anchored investment structures can mobilize residents, businesses and corporate partners alongside city investment.'
  },
  'bristol local climate and energy funds': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how locally anchored investment structures can mobilize residents, businesses and corporate partners alongside city investment.'
  },
  'local': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how climate finance can be channelled to local governments through existing national fiscal-transfer and planning systems.'
  },
  'tamil nadu water and sanitation pooled fund': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how smaller municipal investments can be pooled and supported by government backing and credit enhancement to access capital markets.'
  },
  'lund green bond programme': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how a creditworthy city can connect a portfolio of climate investments to capital markets through a green bond framework.'
  },
  'lund’s green bond programme': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how a creditworthy city can connect a portfolio of climate investments to capital markets through a green bond framework.'
  },

  // Pathway 5.2
  'ccfla financial instruments toolkit': {
    type: 'Tool',
    prefix: 'When to use this:',
    text: 'Use when identifying which financial instruments could address the financing needs and risks within an investment portfolio.'
  },
  'viability fund for cities': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See an emerging approach that connects catalytic co-finance, locally anchored investment structures and coordination between funders.'
  },
  'urban infrastructure insurance facility': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how risk assessment, insurance and pooling can help address climate and disaster risks affecting urban infrastructure.'
  },
  'urban infrastructure insurance facility (uiif)': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how risk assessment, insurance and pooling can help address climate and disaster risks affecting urban infrastructure.'
  },
  'infracredit nigeria': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how guarantees and credit enhancement can reduce financing risks and mobilize domestic institutional capital.'
  },
  'kommuninvest': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how municipalities can aggregate borrowing demand to reduce financing costs and improve access to capital.'
  },

  // Pathway 5.3
  'system demonstrators': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how cities can turn a shared mission into a locally grounded implementation environment that combines system mapping, a real-world testbed, continuous orchestration and a portfolio of interconnected interventions.'
  },
  'ccfla local hubs': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how an intermediary can convene local and national governments, project-preparation providers and financiers around locally identified investment priorities.'
  },
  'citiis 2.0': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how a national programme can provide cities with sustained coordination, expertise and implementation support.'
  },
  'citiis 2.0 (city investments to innovate, integrate and sustain) in india': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how a national programme can provide cities with sustained coordination, expertise and implementation support.'
  },

  // Pathway 5.4
  'first mover cities cohort': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how public and private buyers can be brought together around shared green procurement priorities and stronger demand signals.'
  },
  'c40 clean construction accelerator': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how climate-aligned procurement can be embedded within wider city commitments, stakeholder collaboration and engagement with higher levels of government.'
  },
  'ramcc trust fund': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how municipalities can pool procurement through a shared governance and financing structure.'
  },
  'ramcc trust fund, argentina': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how municipalities can pool procurement through a shared governance and financing structure.'
  },
  'the grand challenge, india': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how a national intermediary can aggregate city demand, standardize requirements and engage suppliers before issuing a pooled tender.'
  },
  'india’s grand challenge': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how a national intermediary can aggregate city demand, standardize requirements and engage suppliers before issuing a pooled tender.'
  },
  'intra-city aggregated procurement in zurich': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how progressively stronger city procurement requirements can create demand and help transform the wider market.'
  },
  'zurich aggregated procurement': {
    type: 'Illustrative Example',
    prefix: 'Why see this:',
    text: 'See how progressively stronger city procurement requirements can create demand and help transform the wider market.'
  }
};

export const CCFLA_FINANCIAL_INSTRUMENTS_TOOLKIT_CARD = {
  title: 'CCFLA Financial Instruments Toolkit',
  type: 'Tool',
  excerpt: 'The CCFLA Financial Instruments Toolkit is an interactive resource that helps practitioners explore financial instruments for urban climate projects, including how different instruments work and the contexts in which they may be relevant.',
  fullText: 'The CCFLA Financial Instruments Toolkit is an interactive resource that helps practitioners explore financial instruments for urban climate projects, including how different instruments work and the contexts in which they may be relevant.\n\nIt provides structured guidance on navigating the spectrum of urban climate finance instruments—from debt, equity, and guarantees to results-based financing and blended capital structures—helping project developers and municipal leaders match the right financial mechanisms to their specific infrastructure and resilience needs.',
  link: 'https://citiesclimatefinance.org/financial-instruments-toolkit/',
  connectionLine: 'When to use this: Use when identifying which financial instruments could address the financing needs and risks within an investment portfolio.'
};

/**
 * Returns connection info for an Action 5 resource card by title or custom field.
 */
export function getAction5Connection(title: string, rawType?: string): ConnectionLineInfo | null {
  if (!title) return null;
  const clean = title.toLowerCase().trim().replace(/['’]/g, "'");

  // Direct match or partial search in dictionary
  for (const [key, val] of Object.entries(ACTION_5_RESOURCE_CONNECTIONS)) {
    const normKey = key.replace(/['’]/g, "'");
    if (clean === normKey || clean.includes(normKey) || normKey.includes(clean)) {
      return {
        prefix: val.prefix,
        text: val.text,
        fullLine: `${val.prefix} ${val.text}`,
        overrideType: val.type
      };
    }
  }

  // Fallback if card already contains connectionLine field
  return null;
}

/**
 * Enhances pathway illustrative examples for Action 5:
 * - Injects CCFLA Financial Instruments Toolkit into 5.2 if missing
 * - Attaches connectionLine and correct type
 */
export function enhanceAction5Examples(pathwayTitle: string, examples: any[] = []): any[] {
  const normTitle = (pathwayTitle || '').toLowerCase();
  const is52 = normTitle.includes('innovative') || normTitle.includes('de-risking') || normTitle.includes('5.2');

  let list = [...examples];

  if (is52) {
    const hasToolkit = list.some(ex => (ex.title || '').toLowerCase().includes('ccfla financial instruments'));
    if (!hasToolkit) {
      list = [CCFLA_FINANCIAL_INSTRUMENTS_TOOLKIT_CARD, ...list];
    }
  }

  return list.map(item => {
    const conn = getAction5Connection(item.title, item.type);
    if (!conn) return item;

    return {
      ...item,
      type: conn.overrideType || item.type,
      connectionLine: conn.fullLine,
      connectionPrefix: conn.prefix,
      connectionText: conn.text
    };
  });
}
