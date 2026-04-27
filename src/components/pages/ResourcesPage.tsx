'use client'

const actions = [
  'Allocate 10 tons of Supplies to Village A',
  'Allocate 8 Medical Trauma Units to Village B',
  'Allocate 5 Disaster Response Food Kits to Village B.',
]

export function ResourcesPage() {
  return (
    <div className="flex flex-col gap-5 p-6 max-w-screen-xl mx-auto animate-page-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">INTELLIGENT RESOURCE COMMAND HUB: AI GLOBAL ALLOCATION</h1>
        </div>
        <button className="btn-sage"><svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><polygon points="10,1 12.9,7 20,8.1 15,12.9 16.2,20 10,16.8 3.8,20 5,12.9 0,8.1 7.1,7"/></svg>AI Briefing</button>
      </div>

      {/* Global inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
        <div className="card p-5">
          <p className="section-label mb-3">Global Resource Inventory</p>
          <div className="flex items-center gap-8 flex-wrap">
            {[
              { val:'12,000', label:'Foods', icon:'🍱' },
              { val:'800',    label:'Medical Units', icon:'🏥' },
              { val:'2,500',  label:'Shelter Kits',  icon:'🏕️' },
            ].map(i => (
              <div key={i.label} className="flex items-center gap-3">
                <span className="text-2xl">{i.icon}</span>
                <div>
                  <p className="text-2xl font-bold text-gray-900 leading-none tabular-nums">{i.val}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{i.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <span className="text-2xl">👥</span>
          <div>
            <p className="section-label mb-1">Field Teams</p>
            <p className="text-3xl font-bold text-gray-900 leading-none">2,130</p>
            <p className="text-[11px] text-gray-500 mt-0.5">active</p>
          </div>
        </div>
      </div>

      {/* Supply chain + network */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="text-[13px] font-bold text-gray-900 mb-4">Predictive Logistics &amp; Supply Chain</p>
          <div className="flex gap-4 mb-3 text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#4d7c56] inline-block"/>Food items</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#93bb99] inline-block"/>Tier-based prediction</span>
          </div>
          {[
            { label:'Village A', pct:78, color:'bg-[#4d7c56]' },
            { label:'Resecto',   pct:62, color:'bg-[#93bb99]' },
            { label:'sSTS',      pct:45, color:'bg-amber-400'  },
          ].map(b => (
            <div key={b.label} className="mb-3">
              <div className="flex justify-between text-[11px] text-gray-600 font-medium mb-1.5">
                <span>{b.label}</span><span>{b.pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${b.color}`} style={{ width:`${b.pct}%` }}/>
              </div>
            </div>
          ))}
          <div className="flex justify-between text-[9px] text-gray-400 mt-1"><span>0r</span><span>6ik</span><span>10k</span><span>20K</span><span>400k</span></div>
        </div>

        {/* Network graph */}
        <div className="relative rounded-2xl overflow-hidden bg-[#0f1a12] min-h-[200px] p-4">
          <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 50% 42% at 36% 46%, rgba(200,80,30,0.45) 0%, transparent 60%), linear-gradient(160deg, #162419, #0a1209)' }}/>
          <div className="relative z-10">
            <p className="text-[11px] text-white/60 font-semibold mb-3">AI optimization network</p>
            <svg viewBox="0 0 280 120" className="w-full h-28">
              {[[30,60,120,30],[120,30,200,55],[200,55,260,78],[120,30,150,90],[150,90,220,100]].map(([x1,y1,x2,y2],i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4d7c56" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6"/>
              ))}
              {[[30,60,'#ef4444'],[120,30,'#eab308'],[200,55,'#22c55e'],[260,78,'#4d7c56'],[150,90,'#4d7c56'],[220,100,'#93bb99']].map(([cx,cy,fill],i) => (
                <circle key={i} cx={cx} cy={cy} r="6" fill={fill as string} stroke="white" strokeWidth="1.5"/>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Action items */}
      <div className="card p-5">
        <p className="text-[14px] font-bold text-gray-900 mb-4">Resource Allocation (Action Items)</p>
        <div className="flex flex-col divide-y divide-gray-50">
          {actions.map((action, i) => (
            <div key={i} className="flex items-center justify-between py-4">
              <p className="text-[13px] text-gray-700 font-medium flex-1">{action}</p>
              <div className="flex gap-3 ml-4 flex-shrink-0">
                <button className="btn-sage py-2 px-4 text-[12px]">Approve</button>
                <button className="btn-outline-sage py-2 px-4 text-[12px]">Override</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Dynamic map */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-bold text-gray-900 uppercase tracking-wider">Dynamic Resource Map</p>
            <button className="text-[11px] text-[#4d7c56] font-semibold hover:underline">View All</button>
          </div>
          <div className="relative rounded-xl overflow-hidden h-44 bg-[#0f1a12]">
            <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 50% 40% at 36% 46%, rgba(220,80,30,0.5) 0%, transparent 60%), linear-gradient(160deg,#162419,#0a1209)' }}/>
            <div className="relative z-10 p-3 h-full">
              {[
                { x:'28%', y:'24%', name:'Village B', urg:'20', uc:'text-red-500', dc:'bg-red-500' },
                { x:'52%', y:'55%', name:'Village C', urg:'32', uc:'text-amber-400', dc:'bg-amber-400' },
              ].map(v => (
                <div key={v.name} className="absolute" style={{ left:v.x, top:v.y }}>
                  <div className="bg-white rounded-lg px-2 py-1 shadow mb-1"><p className="text-[10px] font-bold">{v.name}</p><p className={`text-[9px] font-semibold ${v.uc}`}>Urgency: {v.urg}</p></div>
                  <div className={`w-2.5 h-2.5 rounded-full ${v.dc} border-2 border-white shadow mx-auto`}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="card p-4">
          <p className="text-[12px] font-bold text-gray-900 uppercase tracking-wider mb-1">Regional Insights &amp; Allocation Recommendations</p>
          <p className="text-[11px] text-gray-400 mb-3">Automatically updates regional recommendations.</p>
          {[
            'Deploy 35 Multi-Skill Volunteers to Village A',
            'Allocate 500 Disaster Response Food Kits to Village C',
            'Allocate 500 Disaster Response Food Kits to Village C',
          ].map((r,i) => (
            <div key={i} className="flex gap-2.5 py-2.5 border-b border-gray-50 last:border-0">
              <svg viewBox="0 0 20 20" fill="#22c55e" className="w-4 h-4 flex-shrink-0 mt-0.5"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
              <div>
                <p className="text-[12px] text-gray-700 font-semibold leading-snug">{r}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Approved AI action item</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
