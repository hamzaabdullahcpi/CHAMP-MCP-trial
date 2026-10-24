import { actionsData } from './src/data/content.ts';
console.log(actionsData.find(a=>a.id===2)?.pathways?.map(p=>p.title));
