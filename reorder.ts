import * as fs from 'fs';

let content = fs.readFileSync('./src/components/LandingPage.tsx', 'utf-8');

const getSection = (marker1, marker2) => {
  const i1 = content.indexOf(`{/* ${marker1} */}`);
  let i2 = content.length;
  if(marker2) i2 = content.indexOf(`{/* ${marker2} */}`);
  if (i1 === -1 || i2 === -1) throw new Error("Section marker not found");
  return content.slice(i1, i2);
}

const sHeroGraphic = content.slice(0, content.indexOf('{/* Toolkit Context Section */}'));
const sToolkit = getSection('Toolkit Context Section', 'Carousel Context Section');
const sCarousel = getSection('Carousel Context Section', 'Partnership Section');
const sPartnership = getSection('Partnership Section', 'Intro Integration Section');

const sIntroFull = getSection('Intro Integration Section', null);
const splitMarker = '{/* Key Initiatives & Partnerships (Cards) */}';
const iSplit = sIntroFull.indexOf(splitMarker);
const sIntroTop = sIntroFull.slice(0, iSplit) + "      </motion.div>\n\n";
const sIntroBottom = "      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className=\"mb-12\">\n  " + sIntroFull.slice(iSplit, sIntroFull.lastIndexOf('</motion.div>')) + "</motion.div>\n\n";

const newContent = 
  sHeroGraphic +
  sIntroTop +
  sToolkit +
  sCarousel +
  sPartnership +
  sIntroBottom +
  content.slice(content.lastIndexOf('</motion.div>') + 13); // whatever is at the very end

fs.writeFileSync('./src/components/LandingPage.tsx', newContent);
console.log("Reordered LandingPage.tsx");
