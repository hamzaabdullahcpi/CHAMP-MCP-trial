import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('ndcCategoriesData.json', 'utf8'));

let targetFile = path.resolve('src/components/MapDashboard.tsx');
let fileContent = fs.readFileSync(targetFile, 'utf8');

// Use exact grades instead of grouping them
const exactCategoryMap = data.ndcCategories;

const formatArray = (obj) => {
    let result = '';
    const entries = Object.entries(obj).sort((a,b)=>a[0].localeCompare(b[0]));
    for(let i=0; i<entries.length; i+=5) {
        result += '  ' + entries.slice(i, i+5).map(([c, v]) => `"${c}": "${v}"`).join(', ') + ',\n';
    }
    return result.trim().replace(/,$/, '');
};

const ndcSet = `const ndcCategories: Record<string, string> = {\n  ${formatArray(exactCategoryMap)}\n};`;

// replace ndcCategories code block
fileContent = fileContent.replace(/const ndcCategories: Record<string, string> = \{[\s\S]*?\n\};/, ndcSet);

fs.writeFileSync(targetFile, fileContent);
