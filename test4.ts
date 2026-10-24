import { actionsData } from './src/data/content.ts';
const p = actionsData.find(a=>a.id===4)?.pathways?.find(p=>p.title.includes("Portfolio and Pipeline Development"));
console.log(p?.illustrativeExamples?.map(ex => ex.title));
