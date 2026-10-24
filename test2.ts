import { actionsData } from './src/data/content.ts';
console.log(actionsData.find(a=>a.id===4)?.pathways?.map(p=>p.title));
console.log(actionsData.find(a=>a.id===4)?.pathways?.find(p=>p.title.includes("Joint Climate Investment Planning"))?.illustrativeExamples?.map(ex => ex.title));
