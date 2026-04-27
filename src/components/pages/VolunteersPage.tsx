'use client'

const volunteers = [
  { name:'Sarah J.',  location:'Sarah Ity Vainiocen',    skill:'Med/Rescue', status:'active',   avatar:'SJ', color:'bg-pink-400' },
  { name:'John D.',   location:'Logistics',               skill:'Logistics',  status:'active',   avatar:'JD', color:'bg-blue-400' },
  { name:'Rathem D.', location:'Santh Iry Valriiocen',   skill:'Med/Rescue', status:'standby',  avatar:'RD', color:'bg-amber-400' },
  { name:'Koka E.',   location:'West Mounty Voluntnes',   skill:'Logistics',  status:'active',   avatar:'KE', color:'bg-purple-400' },
  { name:'Sarah J.',  location:'Logistics',               skill:'Med/Rescue', status:'active',   avatar:'SJ', color:'bg-pink-400' },
  { name:'John D.',   location:'Logistics',               skill:'Logistics',  status:'offline',  avatar:'JD', color:'bg-blue-400' },
]

const statusDot: Record<string, string> = {
  active: 'bg-green-400', standby: 'bg-amber-400', offline: 'bg-red-400'
}
const skillBg: Record<string, string> = {
  'Med/Rescue': 'bg-red-50 text-red-700',
  'Logistics':  'bg-blue-50 text-blue-700',
}

export function VolunteersPage() {
  return (
    <div className="flex flex-col gap-5 p-6 max-w-screen-xl mx-auto animate-page-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">VOLUNTEER DEPLOYMENT PORTAL</h1>
          <p className="text-sm text-gray-400 mt-0.5">Smart Analyzed, Faster Relief.</p>
        </div>
        <button className="btn-sage">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><polygon points="10,1 12.9,7 20,8.1 15,12.9 16.2,20 10,16.8 3.8,20 5,12.9 0,8.1 7.1,7"/></svg>
          AI Briefing
        </button>
      </div>

      {/* Stats */}
      <div className="card p-5">
        <p className="section-label mb-3">Volunteers by Status</p>
        <div className="flex items-center gap-10">
          {[
            { val:'212', label:'Active',       color:'text-[#4d7c56]' },
            { val:'47',  label:'On Standby',   color:'text-amber-600' },
            { val:'35',  label:'Skill-matched', color:'text-blue-600' },
          ].map((s,i) => (
            <div key={s.label} className="flex items-center gap-6">
              <div>
                <p className={`text-3xl font-bold leading-none ${s.color}`}>{s.val}</p>
                <p className="text-[12px] text-gray-400 mt-1 leading-none">{s.label}</p>
              </div>
              {i < 2 && <div className="h-10 w-px bg-gray-100"/>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Table */}
        <div className="card p-5">
          <p className="section-label mb-4">Field Team Readiness</p>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Profile','Current Location','Skills'].map(h => (
                  <th key={h} className="text-[10px] font-bold uppercase tracking-wider text-gray-400 pb-2.5 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[v.status]}`}/>
                      <div className={`w-7 h-7 rounded-full ${v.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>{v.avatar}</div>
                      <span className="text-[12px] font-semibold text-gray-800">{v.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="text-[11px] text-gray-500">{v.location}</span>
                  </td>
                  <td className="py-2.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${skillBg[v.skill]}`}>{v.skill}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right side */}
        <div className="flex flex-col gap-3">
          {/* Deployment Map */}
          <div className="card p-4">
            <p className="section-label mb-3">Current Team Deployment Map</p>
            <div className="relative rounded-xl overflow-hidden h-44 bg-[#0f1a12]">
              <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 45% 38% at 48% 44%, rgba(200,80,30,0.5) 0%, transparent 62%), linear-gradient(160deg, #162419, #0a1209)' }}/>
              <div className="absolute inset-0 z-10 p-3">
                {[
                  { x:'55%', y:'28%', c:'bg-blue-400' },
                  { x:'66%', y:'34%', c:'bg-blue-400' },
                  { x:'60%', y:'50%', c:'bg-blue-400' },
                ].map((p,i) => (
                  <div key={i} className={`absolute w-5 h-5 ${p.c} rounded-full border-2 border-white shadow flex items-center justify-center text-white text-[9px] font-bold`} style={{ left:p.x, top:p.y }}>👤</div>
                ))}
                {[
                  { x:'49%', y:'38%' },
                  { x:'62%', y:'26%' },
                ].map((p,i) => (
                  <div key={i} className="absolute w-4 h-4 bg-red-500 border-2 border-white shadow" style={{ left:p.x, top:p.y, clipPath:'polygon(50% 0%, 0% 100%, 100% 100%)' }}/>
                ))}
                <div className="absolute right-2 top-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-[9px] text-white/70 font-medium">Crisis Areas</div>
              </div>
            </div>
          </div>

          {/* Skill filter + missions */}
          <div className="card p-4">
            <p className="section-label mb-3">Skill Filter</p>
            <div className="flex gap-2 mb-4">
              {['Med','Rescue','Logistics'].map((t,i) => (
                <button key={t} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${i < 2 ? 'bg-[#2e5233] text-white border-[#2e5233]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#4d7c56]'}`}>{t}</button>
              ))}
            </div>
            <p className="section-label mb-3">Active Missions</p>
            {[
              { label:'Active Volunteers', val:212, dot:'bg-green-400' },
              { label:'Crisis Missions',   val:47,  dot:'bg-blue-400'  },
              { label:'Actis Missions',    val:45,  dot:'bg-orange-400'},
            ].map(m => (
              <div key={m.label} className="flex items-center py-2 border-b border-gray-50 last:border-0">
                <span className={`w-2 h-2 rounded-full mr-2.5 flex-shrink-0 ${m.dot}`}/>
                <span className="flex-1 text-[12px] text-gray-600 font-medium">{m.label}</span>
                <span className="text-[15px] font-bold text-gray-900 tabular-nums">{m.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
