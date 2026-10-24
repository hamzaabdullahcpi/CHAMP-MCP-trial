const fs = require('fs');

const actions = JSON.parse(fs.readFileSync('new_actions.json', 'utf8'));

// Format actions to match the new structure
const formattedActions = actions.map(act => {
  return {
    id: act.id,
    title: act.title,
    goal: act.description.split("System")[0].trim(),
    unifiedContext: {
      whatIsThisAction: act.description.split("System Logic:")[0].split("Systems Logic:")[0].trim(),
      systemsLogic: act.systemsLogic
    },
    pathways: act.pathways
  };
});

const contentFile = 'src/data/content.ts';
let content = fs.readFileSync(contentFile, 'utf8');

const str = JSON.stringify(formattedActions, null, 2);
const replacement = `export const actionsData = ${str};\n\n`;

if (content.includes("export const deepDiveData")) {
    content = content.replace(/export const actionsData = \[[\s\S]*?\];\n*(?=export const deepDiveData)/, replacement);
} else {
    // try replacing from actionsData to the end of file or next export
    content = content.replace(/export const actionsData = \[[\s\S]*?\];/, `export const actionsData = ${str};`);
}

fs.writeFileSync(contentFile, content);
