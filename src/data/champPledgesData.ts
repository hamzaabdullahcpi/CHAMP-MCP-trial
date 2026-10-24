export interface ChampPledge {
  id: number;
  number: string;
  title: string;
  shortDesc: string;
  fullText: string;
  isInvestment: boolean;
  order?: number;
}

export const defaultChampPledgesData: ChampPledge[] = [
  {
    id: 1,
    number: "Pledge 01",
    title: "Consult on national commitments and strategies",
    shortDesc: "Determine avenues for subnational action to contribute to national mitigation and adaptation commitments and strategies, and their subsequent implementation and monitoring.",
    fullText: "Consult with our respective subnational governments, as appropriate and applicable, to determine the avenues for subnational action to contribute to national mitigation and adaptation commitments and strategies, and their subsequent implementation and monitoring.",
    isInvestment: false,
    order: 1
  },
  {
    id: 2,
    number: "Pledge 02",
    title: "Work collaboratively to unlock subnational opportunities",
    shortDesc: "Involve subnational governments collaboratively in the review, design, enhancement, consolidation and implementation of national commitments and strategies.",
    fullText: "Work collaboratively with our respective subnational governments to unlock and realise mitigation and adaptation action opportunities at the subnational level by involving them, as appropriate and applicable, in the review, design, enhancement, consolidation and implementation of our national commitments and strategies.",
    isInvestment: false,
    order: 2
  },
  {
    id: 3,
    number: "Pledge 03",
    title: "Inclusive institutional processes for enhanced NDCs",
    shortDesc: "Enable subnational governments to contribute to further enhancing NDCs ahead of COP30, integrating local baseline data, targets, and sectoral actions.",
    fullText: "Create inclusive institutional and informal processes to enable subnational governments to contribute to further enhancing NDCs, where applicable, ahead of COP30 in 2025, and, where available and appropriate, integrate local and territorial baseline information, targets and actions for emissions mitigation and adaptation across all sectors and industries.",
    isInvestment: false,
    order: 3
  },
  {
    id: 4,
    number: "Pledge 04",
    title: "Climate-related investment priorities & project preparation",
    shortDesc: "Include subnational projects in climate investment priorities, supporting project preparation, pipeline development, aggregation, and financial instruments.",
    fullText: "Include relevant subnational government projects (encompassing mitigation and adaptation) in climate-related investment priorities (including those directly and indirectly related to NDCs) and strive to help them secure the resources necessary from public and private financial institutions, as applicable, to begin or scale up implementation, including but not limited to supporting project preparation, pipeline development, aggregation of projects, new financial instruments or policy reform at local, national, regional and global levels as needed.",
    isInvestment: true,
    order: 4
  },
  {
    id: 5,
    number: "Pledge 05",
    title: "Regular country-led reviews of progress",
    shortDesc: "Undertake regular, inclusive country-led reviews of progress at national and subnational level around CHAMP commitments through existing processes.",
    fullText: "Undertake, as appropriate and applicable, regular, and inclusive country-led reviews of progress at national and subnational level around the implementation of CHAMP commitments through existing processes, which may include the Voluntary National Review process of the 2030 Agenda for Sustainable Development, with a view to ensure that national policy frameworks support and, where appropriate, can accelerate ambitious multilevel climate action.",
    isInvestment: false,
    order: 5
  },
  {
    id: 6,
    number: "Pledge 06",
    title: "Global High Level Political Dialogue",
    shortDesc: "Meet with representative subnational leaders at a global High Level Political Dialogue to share good practices and lessons learned.",
    fullText: "Meet, amongst the endorsers of CHAMP, with representative subnational leaders, at a global High Level Political Dialogue on Multilevel Climate Action in the lead up to both COP29 and COP30 to share good practices and lessons learned in implementing the CHAMP commitments, to be compiled into a summary shared, among others, as a contribution to the Ministerial Meeting on Urbanization and Climate Change.",
    isInvestment: false,
    order: 6
  }
];
