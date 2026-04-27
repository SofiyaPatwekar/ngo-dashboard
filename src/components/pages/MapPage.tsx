'use client'

export function MapPage() {
  return (
    <div className="flex flex-col gap-5 p-6 max-w-screen-xl mx-auto animate-page-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">INTELLIGENT REGIONAL CRISIS &amp; LOGISTICS OVERVIEW</h1>
          <p className="text-sm text-gray-400 mt-0.5">Live satellite + AI risk overlay</p>
        </div>
        <button className="btn-sage">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <polygon points="10,1 12.9,7 20,8.1 15,12.9 16.2,20 10,16.8 3.8,20 5,12.9 0,8.1 7.1,7"/>
          </svg>
          AI Briefing
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4" style={{ minHeight: '520px' }}>
        {/* Map area */}
        <div className="relative rounded-2xl overflow-hidden bg-[#0f1a12] min-h-[480px]">
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(ellipse 52% 42% at 36% 46%, rgba(220,80,30,0.6) 0%, transparent 60%),
              radial-gradient(ellipse 36% 32% at 60% 58%, rgba(200,160,0,0.4) 0%, transparent 55%),
              radial-gradient(ellipse 24% 24% at 68% 36%, rgba(200,90,0,0.3) 0%, transparent 52%),
              linear-gradient(160deg, #162419 0%, #0a1209 100%)`
          }}/>

          {/* Controls */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-0.5">
            {['+','−','◎'].map(c => (
              <button key={c} className="w-8 h-8 bg-white/90 hover:bg-white text-gray-700 font-bold text-sm flex items-center justify-center first:rounded-t-lg last:rounded-b-lg transition-colors shadow-sm">{c}</button>
            ))}
          </div>

          {/* Crisis labels */}
          <div className="absolute" style={{ left:'20%', top:'18%' }}>
            <span className="bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">FLOODING</span>
          </div>
          <div className="absolute" style={{ left:'48%', top:'30%' }}>
            <span className="bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">FLOODING</span>
          </div>
          <div className="absolute" style={{ left:'66%', top:'34%' }}>
            <span className="bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">FIRE</span>
          </div>

          {/* Village pin */}
          <div className="absolute" style={{ left:'24%', top:'44%' }}>
            <div className="bg-white rounded-xl px-3 py-1.5 shadow-lg mb-1.5">
              <p className="text-[11px] font-bold">Village B</p>
              <p className="text-[10px] text-red-600 font-semibold">Urgency: 92</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow mx-auto"/>
          </div>

          {/* Tooltips */}
          <div className="absolute bg-white/95 rounded-xl px-3 py-2 shadow-lg text-[11px] font-semibold text-gray-800 max-w-[180px]" style={{ left:'50%', top:'15%' }}>
            AI Predicts 89% Volunteer matching accuracy here.
          </div>
          <div className="absolute bg-white/95 rounded-xl px-3 py-2 shadow-lg text-[11px] font-semibold text-gray-800 max-w-[180px]" style={{ left:'52%', top:'60%' }}>
            Logistics ETA updated. 3hr optimization.
          </div>

          {/* High badge */}
          <div className="absolute bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ left:'32%', top:'52%' }}>High</div>
        </div>

        {/* Right sidebar panels */}
        <div className="flex flex-col gap-3">
          {/* Map Layers */}
          <div className="card p-4">
            <p className="text-[12px] font-bold text-gray-900 mb-3">Map Layers</p>
            {[
              { icon:'🔺', label:'Risk Heatmap',       on: true },
              { icon:'🏗️', label:'Infrastructure',     on: true },
              { icon:'👤', label:'Volunteers',          on: true },
              { icon:'🎯', label:'Precision Map Layer', on: true },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2.5 py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm w-5 text-center">{l.icon}</span>
                <span className="flex-1 text-[12px] text-gray-600 font-medium">{l.label}</span>
                <div className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${l.on ? 'bg-[#4d7c56]' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${l.on ? 'translate-x-4' : 'translate-x-0'}`}/>
                </div>
              </div>
            ))}
          </div>

          {/* Color Guide */}
          <div className="card p-4">
            <p className="text-[12px] font-bold text-gray-900 mb-3">Color Heatmap Guide</p>
            {[
              { label:'Realtime Risk', from:'#22c55e', to:'#ef4444' },
              { label:'Precipitation mm', from:'#bae6fd', to:'#1e40af' },
              { label:'Population Density', from:'#e9d5ff', to:'#6d28d9' },
            ].map(g => (
              <div key={g.label} className="mb-3 last:mb-0">
                <p className="text-[10px] font-semibold text-gray-500 mb-1">{g.label}</p>
                <div className="h-2 rounded-full" style={{ background:`linear-gradient(to right, ${g.from}, ${g.to})` }}/>
                <div className="flex justify-between text-[9px] text-gray-400 mt-0.5"><span>0</span><span>15</span></div>
              </div>
            ))}
          </div>

          {/* Inventory */}
          <div className="card p-4 flex-1">
            <p className="text-[12px] font-bold text-gray-900 mb-3">Resource &amp; Inventory</p>
            {[
              { icon:'🏥', val:'139', label:'Total Items' },
              { icon:'🥘', val:'1',   label:'Food units' },
              { icon:'🏕️', val:'2,500', label:'Shelter Kits' },
            ].map(i => (
              <div key={i.label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className="text-lg">{i.icon}</span>
                <div>
                  <p className="text-[15px] font-bold text-gray-900 leading-none">{i.val}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{i.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
