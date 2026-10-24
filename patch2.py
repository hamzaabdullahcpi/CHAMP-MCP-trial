import re

with open('src/components/MindMapGraphic.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(
    r'<div\s+key=\{idx\}\s+onClick=\{\(\) => setActivePathwayIdx\(isActive \? null : idx\)\}.*?\{/\*\s*small indicator\s*\*/\}.*?</div>\s*</div>\s*</div>',
    re.DOTALL
)

replacement = """<div 
                            key={idx}
                            onClick={() => onNavigateToStep(activeAction.id, idx)}
                            className={`p-3 cursor-pointer transition-colors border-l-2 flex flex-col gap-2 shadow-sm shrink-0 group/pathway ${
                              isActive 
                                 ? 'bg-surface border-l-accent shadow-md z-20' 
                                 : 'bg-surface/50 border-l-line hover:bg-surface hover:border-l-accent/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 group-hover/pathway:text-accent transition-colors">
                                <GitMerge size={12} className={`shrink-0 mt-0.5 ${isActive ? 'text-accent' : 'text-ink-muted group-hover/pathway:text-accent/70'}`} />
                                <h4 className={`text-[12px] font-medium leading-snug ${isActive ? 'text-ink' : 'text-ink/80 group-hover/pathway:text-ink'}`}>
                                  {pathway.title || pathway.name}
                                </h4>
                              </div>
                              {/* Expand/Collapse Button (prevents row click) */}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActivePathwayIdx(isActive ? null : idx);
                                }}
                                className="shrink-0 mt-0.5 focus:outline-none p-0.5 hover:bg-line/50 rounded-sm text-ink-muted hover:text-ink transition-colors"
                              >
                                {isActive ? <Minus size={12} className="text-accent" /> : <Plus size={12} />}
                              </button>
                            </div>
                          </div>"""

if pattern.search(content):
    content = pattern.sub(replacement, content)
    with open('src/components/MindMapGraphic.tsx', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Could not find match")
