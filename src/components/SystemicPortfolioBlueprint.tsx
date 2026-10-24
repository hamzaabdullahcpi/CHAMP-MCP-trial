import React from 'react';

export default function SystemicPortfolioBlueprint() {
  return (
    <div className="w-full max-w-5xl mx-auto py-4 font-sans text-slate-800">
      <div className="relative w-full aspect-[16/10] max-h-[720px] rounded-2xl bg-white border border-line/80 shadow-sm overflow-hidden p-3 md:p-6">
        <svg viewBox="0 0 1000 680" className="w-full h-full text-slate-800 select-none">
          <defs>
            <marker id="arrow-solid" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#207B6A" />
            </marker>
            <marker id="arrow-finance" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669" />
            </marker>
            <marker id="arrow-market" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
            </marker>
            <filter id="card-shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.04" />
            </filter>
          </defs>

          {/* Central System Boundary - Clean delicate dashed enclosure */}
          <rect 
            x="240" 
            y="25" 
            width="520" 
            height="630" 
            rx="16" 
            fill="#fafbfc" 
            stroke="#E5E7EB" 
            strokeWidth="1.5" 
            strokeDasharray="8 6" 
          />
          <text 
            x="500" 
            y="52" 
            fill="#64748b" 
            textAnchor="middle" 
            fontSize="12" 
            fontWeight="700" 
            letterSpacing="2"
          >
            INTERCONNECTED SYSTEMS LOGIC
          </text>

          {/* Main Flow Connections */}
          <line x1="205" y1="365" x2="242" y2="365" stroke="#207B6A" strokeWidth="2.5" markerEnd="url(#arrow-solid)" />
          <line x1="730" y1="365" x2="772" y2="365" stroke="#207B6A" strokeWidth="2.5" markerEnd="url(#arrow-solid)" />

          {/* Finance -> Implementation Arrow */}
          <line x1="500" y1="262" x2="500" y2="308" stroke="#059669" strokeWidth="2.5" markerEnd="url(#arrow-finance)" />

          {/* Procurement -> Implementation Arrow */}
          <line x1="500" y1="550" x2="500" y2="475" stroke="#4f46e5" strokeWidth="2.5" markerEnd="url(#arrow-market)" />

          {/* Left Block: Project Portfolio Input */}
          <g transform="translate(10, 255)" filter="url(#card-shadow)">
            <rect width="200" height="220" rx="12" fill="#ffffff" stroke="#E5E7EB" strokeWidth="1.5" />
            <rect x="0" y="0" width="200" height="38" rx="12" fill="#f8fafc" />
            <text x="100" y="24" fill="#1e293b" textAnchor="middle" fontSize="13" fontWeight="700">Project Portfolio</text>
            
            {/* Clean Pill Tags */}
            <g transform="translate(12, 48)">
              <rect x="0" y="0" width="176" height="26" rx="13" fill="#E5E7EB" />
              <text x="88" y="17" fill="#334155" textAnchor="middle" fontSize="11" fontWeight="500">Project Pipelines</text>

              <rect x="0" y="32" width="176" height="26" rx="13" fill="#E5E7EB" />
              <text x="88" y="49" fill="#334155" textAnchor="middle" fontSize="11" fontWeight="500">Governance Functions</text>

              <rect x="0" y="64" width="176" height="26" rx="13" fill="#E5E7EB" />
              <text x="88" y="81" fill="#334155" textAnchor="middle" fontSize="11" fontWeight="500">Coordination Capabilities</text>

              <rect x="0" y="96" width="176" height="26" rx="13" fill="#E5E7EB" />
              <text x="88" y="113" fill="#334155" textAnchor="middle" fontSize="11" fontWeight="500">Enabling Regulations</text>

              <rect x="0" y="128" width="176" height="26" rx="13" fill="#E5E7EB" />
              <text x="88" y="145" fill="#334155" textAnchor="middle" fontSize="11" fontWeight="500">National Policy Alignment</text>
            </g>
          </g>

          {/* Right Block: Output Portfolios */}
          <g transform="translate(785, 305)" filter="url(#card-shadow)">
            <rect width="205" height="120" rx="12" fill="#ffffff" stroke="#E5E7EB" strokeWidth="1.5" />
            <rect x="0" y="0" width="205" height="38" rx="12" fill="#f8fafc" />
            <text x="102" y="24" fill="#1e293b" textAnchor="middle" fontSize="13" fontWeight="700">Implementation</text>
            
            <text x="102" y="62" fill="#334155" textAnchor="middle" fontSize="12" fontWeight="600">Scale &amp; Replicability</text>
            <text x="102" y="82" fill="#64748b" textAnchor="middle" fontSize="11.5">Commercial Adoption</text>
            <text x="102" y="98" fill="#64748b" textAnchor="middle" fontSize="11.5">Long-term Viability</text>
          </g>

          {/* Top Block: Finance Mechanisms */}
          <g transform="translate(265, 75)" filter="url(#card-shadow)">
            <rect width="470" height="185" rx="14" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
            <rect x="0" y="0" width="470" height="40" rx="14" fill="#ecfdf5" />
            <text x="235" y="25" fill="#065f46" textAnchor="middle" fontSize="14" fontWeight="700">Multilevel Financing Mechanisms</text>
            
            <g transform="translate(0, 48)">
              {/* Catalytic Capital */}
              <rect x="85" y="0" width="140" height="30" rx="15" fill="#f0fdf4" stroke="#a7f3d0" strokeWidth="1" />
              <text x="155" y="19" fill="#047857" textAnchor="middle" fontSize="12" fontWeight="600">Catalytic Capital</text>
              
              {/* De-risking Tools */}
              <rect x="245" y="0" width="140" height="30" rx="15" fill="#f0fdf4" stroke="#a7f3d0" strokeWidth="1" />
              <text x="315" y="19" fill="#047857" textAnchor="middle" fontSize="12" fontWeight="600">De-risking Tools</text>

              {/* Dotted lines from finance tools to investment structure */}
              <line x1="155" y1="30" x2="155" y2="48" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="315" y1="30" x2="315" y2="48" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 3" />
            </g>

            {/* Sub-block: Local Climate Investment Structure */}
            <g transform="translate(18, 98)">
              <rect width="434" height="74" rx="10" fill="#fafffd" stroke="#a7f3d0" strokeWidth="1" />
              <text x="217" y="22" fill="#065f46" textAnchor="middle" fontSize="12.5" fontWeight="700">Local Climate Investment Structure</text>
              
              {/* Tool Tags */}
              <g transform="translate(30, 34)">
                <rect x="0" y="0" width="112" height="26" rx="13" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="0.8" />
                <text x="56" y="17" fill="#047857" textAnchor="middle" fontSize="11" fontWeight="600">Local Trust Funds</text>
                
                <rect x="122" y="0" width="80" height="26" rx="13" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="0.8" />
                <text x="162" y="17" fill="#047857" textAnchor="middle" fontSize="11" fontWeight="600">SPVs</text>

                <rect x="212" y="0" width="162" height="26" rx="13" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="0.8" />
                <text x="293" y="17" fill="#047857" textAnchor="middle" fontSize="11" fontWeight="600">Green Bonds Programs</text>
              </g>
            </g>
          </g>

          {/* Center Block: Implementation Environment */}
          <g transform="translate(265, 312)" filter="url(#card-shadow)">
            <rect width="470" height="158" rx="14" fill="#ffffff" stroke="#207B6A" strokeWidth="1.5" />
            <rect x="0" y="0" width="470" height="40" rx="14" fill="#E8F3F1" />
            <text x="235" y="25" fill="#207B6A" textAnchor="middle" fontSize="14" fontWeight="700">Collaborative Portfolio Implementation Environment</text>
            <text x="235" y="56" fill="#475569" textAnchor="middle" fontSize="11.5" fontStyle="italic">Coordinated delivery across key stakeholders:</text>
            
            {/* Actor Tags */}
            <g transform="translate(25, 72)">
              {/* Row 1 */}
              <rect x="10" y="0" width="105" height="28" rx="14" fill="#E8F3F1" stroke="#B9DED7" strokeWidth="0.8" />
              <text x="62" y="18" fill="#207B6A" textAnchor="middle" fontSize="11.5" fontWeight="600">Public agencies</text>
              
              <rect x="125" y="0" width="98" height="28" rx="14" fill="#E8F3F1" stroke="#B9DED7" strokeWidth="0.8" />
              <text x="174" y="18" fill="#207B6A" textAnchor="middle" fontSize="11.5" fontWeight="600">Governments</text>

              <rect x="233" y="0" width="92" height="28" rx="14" fill="#E8F3F1" stroke="#B9DED7" strokeWidth="0.8" />
              <text x="279" y="18" fill="#207B6A" textAnchor="middle" fontSize="11.5" fontWeight="600">Financiers</text>
              
              <rect x="335" y="0" width="75" height="28" rx="14" fill="#E8F3F1" stroke="#B9DED7" strokeWidth="0.8" />
              <text x="372" y="18" fill="#207B6A" textAnchor="middle" fontSize="11.5" fontWeight="600">Academia</text>

              {/* Row 2 */}
              <rect x="75" y="38" width="140" height="28" rx="14" fill="#E8F3F1" stroke="#B9DED7" strokeWidth="0.8" />
              <text x="145" y="56" fill="#207B6A" textAnchor="middle" fontSize="11.5" fontWeight="600">Procurement actors</text>
              
              <rect x="225" y="38" width="120" height="28" rx="14" fill="#E8F3F1" stroke="#B9DED7" strokeWidth="0.8" />
              <text x="285" y="56" fill="#207B6A" textAnchor="middle" fontSize="11.5" fontWeight="600">Civil society</text>
            </g>
          </g>

          {/* Bottom Block: Procurement & Market-Shaping */}
          <g transform="translate(265, 550)" filter="url(#card-shadow)">
            <rect width="470" height="95" rx="14" fill="#ffffff" stroke="#4f46e5" strokeWidth="1.5" />
            <rect x="0" y="0" width="470" height="36" rx="14" fill="#f5f3ff" />
            <text x="235" y="23" fill="#4f46e5" textAnchor="middle" fontSize="13.5" fontWeight="700">Procurement &amp; Market-Shaping</text>
            <text x="235" y="52" fill="#6366f1" textAnchor="middle" fontSize="11.5" fontStyle="italic">Creates Credible Market Demand</text>

            <g transform="translate(35, 60)">
              <rect x="0" y="0" width="220" height="24" rx="12" fill="#ede9fe" stroke="#ddd6fe" strokeWidth="0.8" />
              <text x="110" y="16" fill="#4338ca" textAnchor="middle" fontSize="11" fontWeight="600">Intra-city aggregated procurement</text>
              
              <rect x="230" y="0" width="170" height="24" rx="12" fill="#ede9fe" stroke="#ddd6fe" strokeWidth="0.8" />
              <text x="315" y="16" fill="#4338ca" textAnchor="middle" fontSize="11" fontWeight="600">Pooled procurement</text>
            </g>
          </g>

        </svg>
      </div>
    </div>
  );
}
