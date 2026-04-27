'use client'

export function InsightsPage() {
  return (
    <div className="flex flex-col gap-5 p-6 max-w-screen-xl mx-auto animate-page-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">INTELLIGENT INSIGHTS &amp; ALLOCATION ADVISORY</h1>
        <button className="btn-sage"><svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><polygon points="10,1 12.9,7 20,8.1 15,12.9 16.2,20 10,16.8 3.8,20 5,12.9 0,8.1 7.1,7"/></svg>AI Briefing</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
        <div className="flex flex-col gap-4">

          {/* Predictive map */}
          <div className="relative rounded-2xl overflow-hidden min-h-[280px] bg-[#0f1a12]">
            <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 55% 45% at 38% 55%, rgba(230,80,30,0.58) 0%, transparent 62%), radial-gradient(ellipse 35% 30% at 62% 60%, rgba(200,150,0,0.38) 0%, transparent 55%), linear-gradient(160deg, #162419, #0a1209)' }}/>
            <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-black/25 border-b border-white/5">
              <span className="text-[12px] font-bold text-white">AI-PREDICTIVE NEEDS MAP OVERLAY</span>
              <span className="text-[#93bb99]">✦</span>
            </div>
            <div className="relative z-10 p-4" style={{ minHeight:'230px' }}>
              {[
                { x:'8%',  y:'12%', text:'Predicted Resource Shortfall\nVillage B (24h): -50%' },
                { x:'55%', y:'15%', text:'Precipitation Forecast Shift\n(12h) Impact: High-Risk' },
                { x:'8%',  y:'62%', text:'Optimized Volunteer Path\nETA A-to-B: -1h' },
              ].map((t,i) => (
                <div key={i} className="absolute bg-white/95 rounded-xl px-3 py-2 shadow text-[10px] font-semibold text-gray-800 max-w-[180px] leading-snug" style={{ left:t.x, top:t.y }}>
                  {t.text.split('\n').map((l,j) => <p key={j} className={j===1?'font-bold text-red-600':''}>{l}</p>)}
                </div>
              ))}
              {['FLOODING','FLOODING','FIRE'].map((l,i) => (
                <div key={i} className="absolute bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg" style={{ left:[`30%`,'50%','66%'][i], top:['18%','38%','40%'][i] }}>{l}</div>
              ))}
            </div>
          </div>

          {/* Allocation optimization */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-bold text-gray-900">Real-Time Allocation Optimization</p>
              <span className="text-[#4d7c56]">✦</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Volunteer efficiency chart */}
              <div className="bg-[#f2f7f3] rounded-xl p-4">
                <p className="text-[11px] font-bold text-gray-700 mb-1">Volunteer Allocation Efficiency</p>
                <p className="text-[10px] text-gray-400 mb-3">Skill match prediction (e.g.)</p>
                <div className="flex items-end gap-1.5 h-16">
                  {[68,55,40,22,42,28,15].map((h,i) => (
                    <div key={i} className={`flex-1 rounded-t-sm ${i%2===0 ? 'bg-[#4d7c56]' : 'bg-[#93bb99]'}`} style={{ height:`${h}%` }}/>
                  ))}
                </div>
                <div className="flex gap-1.5 mt-1">
                  {['Skill','Skill','MIA','G6A','Even'].map(l => <span key={l} className="flex-1 text-[8px] text-gray-400 text-center">{l}</span>)}
                </div>
                <div className="mt-3 bg-gray-800 rounded-lg px-2 py-1.5 inline-block">
                  <p className="text-[9px] text-white font-semibold">AI-predicted 89%<br/>match accuracy: 59%</p>
                </div>
              </div>

              {/* Inventory sensitivity */}
              <div className="bg-[#f2f7f3] rounded-xl p-4">
                <p className="text-[11px] font-bold text-gray-700 mb-1">Resource &amp; Inventory Sensitivity</p>
                <p className="text-[10px] text-gray-400 mb-3">Flow rate forecasting (e.g.)</p>
                <svg viewBox="0 0 180 60" className="w-full h-14">
                  <defs>
                    <linearGradient id="ig" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4d7c56" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#4d7c56" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M5 56 C30 52 50 46 70 38 C90 30 110 18 130 10 C150 4 165 2 178 2" fill="none" stroke="#4d7c56" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M5 56 C30 52 50 46 70 38 C90 30 110 18 130 10 C150 4 165 2 178 2 L178 60 L5 60Z" fill="url(#ig)"/>
                </svg>
                <div className="mt-3 grid grid-cols-3 gap-1">
                  {[['Low','bg-[#f2f7f3] text-[#4d7c56]'],['High','bg-red-500 text-white'],['High','bg-red-500 text-white']].map(([l,c],i) => (
                    <div key={i} className={`rounded-md py-1 text-center text-[9px] font-bold ${c}`}>{l}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-3">
          {/* AI Recommendations */}
          <div className="card p-4">
            <p className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="text-[#4d7c56]">✦</span> AI Actionable Recommendations
            </p>
            {[
              'Execute Village B Volunteer Shift (High Urgency) - AI-Optimized Route',
              'Deploy medical supplies to Village C (Forecasted Fire Risk) - AI-Predicted Need',
              'Deploy medical supplies to Village C (Forecasted Route) - AI-Predicted Need',
              'Verify ETA update (3hr optimization) - AI-Managed Logistics',
            ].map((r,i) => (
              <div key={i} className="flex gap-2 py-2.5 border-b border-gray-50 last:border-0">
                <svg viewBox="0 0 20 20" fill="#4d7c56" className="w-4 h-4 flex-shrink-0 mt-0.5"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                <p className="text-[11px] text-gray-600 leading-snug">{r}</p>
              </div>
            ))}
          </div>

          {/* Contextual Insights */}
          <div className="card p-4">
            <p className="section-label mb-3">Contextual Insights</p>
            {[
              { icon:'🏥', val:'139', label:'Total Items' },
              { icon:'🥘', val:'1',   label:'Food units' },
              { icon:'🏕️', val:'2,500', label:'Shelter Kits' },
            ].map(i => (
              <div key={i.label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className="text-lg">{i.icon}</span>
                <div><p className="text-[14px] font-bold text-gray-900 leading-none">{i.val}</p><p className="text-[10px] text-gray-500 mt-0.5">{i.label}</p></div>
              </div>
            ))}
          </div>

          {/* Mini world map */}
          <div className="rounded-xl overflow-hidden h-20 bg-[#0f1a12] relative">
            <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 60% 50% at 55% 50%, rgba(30,80,40,0.6) 0%, transparent 70%), linear-gradient(160deg,#162419,#0a1209)' }}/>
            {[[95,43,'#ef4444'],[112,48,'#f97316'],[138,44,'#ef4444'],[60,52,'#eab308']].map(([cx,cy,fill],i) => (
              <svg key={i} style={{ position:'absolute', left:0, top:0, width:'100%', height:'100%' }} viewBox="0 0 200 80">
                <circle cx={cx} cy={cy} r="3" fill={fill as string} opacity="0.9"/>
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
