import React from 'react';

export default function SystemicPortfolioBlueprint() {
  return (
    <div className="w-full max-w-5xl mx-auto py-6 font-sans text-slate-800">
      
      <div className="relative w-full aspect-[16/11] max-h-[750px] border border-slate-200/60 rounded-xl shadow-sm bg-slate-50/50 overflow-hidden">
        <svg viewBox="0 0 1000 700" className="w-full h-full text-slate-800">
          <defs>
            <marker id="arrow-solid" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
            <marker id="arrow-finance" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
            <marker id="arrow-market" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3c4799" />
            </marker>
          </defs>

          {/* Central System Boundary */}
          <rect x="250" y="30" width="500" height="640" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 4" />
          <text x="500" y="55" fill="#64748b" textAnchor="middle" fontSize="13" fontWeight="bold" letterSpacing="1">
            SYSTEMS LOGIC
          </text>

          {/* Main Pipeline Flow */}
          <line x1="210" y1="365" x2="244" y2="365" stroke="#64748b" strokeWidth="3" markerEnd="url(#arrow-solid)" />
          <line x1="730" y1="365" x2="774" y2="365" stroke="#64748b" strokeWidth="3" markerEnd="url(#arrow-solid)" />

          {/* Finance -> Implementation Arrow */}
          <line x1="500" y1="260" x2="500" y2="310" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow-finance)" />

          {/* Procurement -> Implementation Arrow */}
          <line x1="500" y1="560" x2="500" y2="475" stroke="#3c4799" strokeWidth="3" markerEnd="url(#arrow-market)" />

          {/* Left Block: Input Portfolio */}
          <g transform="translate(10, 260)">
            <rect width="200" height="210" rx="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
            <text x="100" y="35" fill="#334155" textAnchor="middle" fontSize="14" fontWeight="bold">Project Portfolio</text>
            
            {/* Tags in Project Portfolio */}
            <g transform="translate(10, 55)">
              <rect x="0" y="0" width="180" height="24" rx="12" fill="#f1f5f9" />
              <text x="90" y="16" fill="#475569" textAnchor="middle" fontSize="11">Project Pipelines</text>

              <rect x="0" y="30" width="180" height="24" rx="12" fill="#f1f5f9" />
              <text x="90" y="46" fill="#475569" textAnchor="middle" fontSize="11">Governance Functions</text>

              <rect x="0" y="60" width="180" height="24" rx="12" fill="#f1f5f9" />
              <text x="90" y="76" fill="#475569" textAnchor="middle" fontSize="11">Coordination Capabilities</text>

              <rect x="0" y="90" width="180" height="24" rx="12" fill="#f1f5f9" />
              <text x="90" y="106" fill="#475569" textAnchor="middle" fontSize="11">Enabling Regulations</text>

              <rect x="0" y="120" width="180" height="24" rx="12" fill="#f1f5f9" />
              <text x="90" y="136" fill="#475569" textAnchor="middle" fontSize="11">National Policy Alignment</text>
            </g>
          </g>

          {/* Right Block: Output Portfolios */}
          <g transform="translate(790, 315)">
            <rect width="200" height="100" rx="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
            <text x="100" y="35" fill="#334155" textAnchor="middle" fontSize="14" fontWeight="bold">Implementation of Portfolio</text>
            <text x="100" y="55" fill="#64748b" textAnchor="middle" fontSize="12">Wider Commercial</text>
            <text x="100" y="70" fill="#64748b" textAnchor="middle" fontSize="12">Adoption &amp; Viability</text>
          </g>

          {/* Top Block: Finance */}
          <g transform="translate(270, 75)">
            <rect width="460" height="185" rx="6" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="2" />
            <text x="230" y="30" fill="#065f46" textAnchor="middle" fontSize="15" fontWeight="bold">Financing Mechanisms</text>
            
            <g transform="translate(0, 45)">
              {/* Catalytic Capital */}
              <rect x="90" y="0" width="130" height="30" rx="15" fill="#d1fae5" />
              <text x="155" y="20" fill="#047857" textAnchor="middle" fontSize="12" fontWeight="600">Catalytic Capital</text>
              
              {/* Dotted lines from top finance tools to bottom investment structure */}
              <line x1="155" y1="30" x2="155" y2="50" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="305" y1="30" x2="305" y2="50" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* De-risking Tools */}
              <rect x="240" y="0" width="130" height="30" rx="15" fill="#d1fae5" />
              <text x="305" y="20" fill="#047857" textAnchor="middle" fontSize="12" fontWeight="600">De-risking Tools</text>
            </g>

            {/* Sub-block: Local Climate Investment Structure */}
            <g transform="translate(20, 95)">
              <rect width="420" height="75" rx="6" fill="#ffffff" stroke="#6ee7b7" strokeWidth="1" />
              <text x="210" y="25" fill="#047857" textAnchor="middle" fontSize="14" fontWeight="bold">Local Climate Investment Structure</text>
              
              {/* Tool Tags */}
              <g transform="translate(45, 40)">
                <rect x="0" y="0" width="105" height="24" rx="12" fill="#d1fae5" />
                <text x="52" y="16" fill="#065f46" textAnchor="middle" fontSize="11" fontWeight="600">Local Trust Funds</text>
                
                <rect x="115" y="0" width="85" height="24" rx="12" fill="#d1fae5" />
                <text x="157" y="16" fill="#065f46" textAnchor="middle" fontSize="11" fontWeight="600">SPVs</text>

                <rect x="210" y="0" width="120" height="24" rx="12" fill="#d1fae5" />
                <text x="270" y="16" fill="#065f46" textAnchor="middle" fontSize="11" fontWeight="600">Green Bonds Programs</text>
              </g>
            </g>
          </g>

          {/* Center Block: Implementation */}
          <g transform="translate(270, 315)">
            <rect width="460" height="155" rx="6" fill="#f4f5f9" stroke="#3c4799" strokeWidth="2" />
            
            <text x="230" y="35" fill="#3c4799" textAnchor="middle" fontSize="15" fontWeight="bold">Collaborative Portfolio Implementation Environment</text>
            <text x="230" y="55" fill="#475569" textAnchor="middle" fontSize="12" fontStyle="italic">Implements the portfolio in collaboration with:</text>
            
            {/* Actor Tags */}
            <g transform="translate(35, 75)">
              {/* Row 1 */}
              <rect x="0" y="0" width="105" height="28" rx="14" fill="#e0e7ff" />
              <text x="52" y="18" fill="#3c4799" textAnchor="middle" fontSize="11" fontWeight="600">Public agencies</text>
              
              <rect x="115" y="0" width="95" height="28" rx="14" fill="#e0e7ff" />
              <text x="162" y="18" fill="#3c4799" textAnchor="middle" fontSize="11" fontWeight="600">Governments</text>

              <rect x="220" y="0" width="90" height="28" rx="14" fill="#e0e7ff" />
              <text x="265" y="18" fill="#3c4799" textAnchor="middle" fontSize="11" fontWeight="600">Financiers</text>
              
              <rect x="320" y="0" width="70" height="28" rx="14" fill="#e0e7ff" />
              <text x="355" y="18" fill="#3c4799" textAnchor="middle" fontSize="11" fontWeight="600">Others</text>

              {/* Row 2 */}
              <rect x="65" y="38" width="130" height="28" rx="14" fill="#e0e7ff" />
              <text x="130" y="56" fill="#3c4799" textAnchor="middle" fontSize="11" fontWeight="600">Procurement actors</text>
              
              <rect x="205" y="38" width="100" height="28" rx="14" fill="#e0e7ff" />
              <text x="255" y="56" fill="#3c4799" textAnchor="middle" fontSize="11" fontWeight="600">Civil society</text>
            </g>
          </g>

          {/* Bottom Block: Procurement & Market-Shaping */}
          <g transform="translate(270, 560)">
            <rect width="460" height="95" rx="6" fill="#e0e7ff" stroke="#3c4799" strokeWidth="2" />
            <text x="230" y="32" fill="#3c4799" textAnchor="middle" fontSize="15" fontWeight="bold">Procurement &amp; Market-Shaping</text>
            <text x="230" y="52" fill="#3c4799" textAnchor="middle" fontSize="13" fontStyle="italic">Creates Credible Demand</text>

            <g transform="translate(45, 65)">
              <rect x="0" y="0" width="210" height="24" rx="12" fill="#c7d2fe" />
              <text x="105" y="16" fill="#3c4799" textAnchor="middle" fontSize="11" fontWeight="600">Intra-city aggregated procurement</text>
              
              <rect x="230" y="0" width="140" height="24" rx="12" fill="#c7d2fe" />
              <text x="300" y="16" fill="#3c4799" textAnchor="middle" fontSize="11" fontWeight="600">Pooled procurement</text>
            </g>
          </g>

        </svg>
      </div>
    </div>
  );
}
