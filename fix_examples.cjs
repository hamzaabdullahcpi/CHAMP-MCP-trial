const fs = require('fs');

let content = fs.readFileSync('src/data/content.ts', 'utf8');
const match = content.match(/export const actionsData = (\[[\s\S]*?\]);\s*export/);

if (match) {
    let actionsArray;
    try {
        actionsArray = eval(match[1]);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
    
    // Fix Action 5
    const a5 = actionsArray.find(a => a.id === 5);
    if (a5) {
        a5.pathways.forEach(p => {
            if (p.illustrativeExamples) {
                let fixedExamples = [];
                for (let i = 0; i < p.illustrativeExamples.length; i++) {
                    const ex = p.illustrativeExamples[i];
                    if (ex.title && ex.title.toLowerCase().startsWith('click here to know more')) {
                        // append to previous if exists
                        if (fixedExamples.length > 0) {
                            fixedExamples[fixedExamples.length - 1].fullText += "\n\n" + ex.fullText;
                        }
                    } else if (ex.title && ex.title.toLowerCase().startsWith('to know more about')) {
                        if (fixedExamples.length > 0) {
                            fixedExamples[fixedExamples.length - 1].fullText += "\n\n" + ex.fullText;
                        }
                    } else if (ex.title && ex.title.toLowerCase().startsWith('click here')) {
                        if (fixedExamples.length > 0) {
                            fixedExamples[fixedExamples.length - 1].fullText += "\n\n" + ex.fullText;
                        }
                    } else {
                        fixedExamples.push(ex);
                    }
                }
                p.illustrativeExamples = fixedExamples;
            }
        });
    }

    const newActionsStr = JSON.stringify(actionsArray, null, 2);
    content = content.replace(/export const actionsData = \[[\s\S]*?\];\s*(?=export)/, `export const actionsData = ${newActionsStr};\n\n`);
    fs.writeFileSync('src/data/content.ts', content);
    console.log("Fixed examples");
}
