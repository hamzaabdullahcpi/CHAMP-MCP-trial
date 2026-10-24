with open("src/components/StepView.tsx", "r") as f:
    content = f.read()

target = """              {/* 1. Core Guidance */}
              {pathway.implementationGuidance && pathway.implementationGuidance.length > 0 && (
                <div>
                  <h4 className="text-[12px] font-bold text-accent uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Lightbulb size={16} /> Implementation Guidance
                  </h4>
                  <GuidanceList items={pathway.implementationGuidance} />
                </div>
              )}"""

replacement = """              {/* 1. Core Guidance */}
              {pathway.implementationGuidance && pathway.implementationGuidance.length > 0 && (
                <div>
                  <GuidanceList items={pathway.implementationGuidance} />
                </div>
              )}"""

content = content.replace(target, replacement)

with open("src/components/StepView.tsx", "w") as f:
    f.write(content)
