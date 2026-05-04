/* global React */
const { useState: useStateH } = React;

const SidebarNav = ({ active = 'dashboard' }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'games', label: 'My Games', icon: '◈' },
    { id: 'banks', label: 'Question Banks', icon: '☰' },
    { id: 'rounds', label: 'Rounds', icon: '◉' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ];
  return (
    <aside className="sidebar">
      <div className="side-logo"><Logo size={22} /></div>
      <nav className="side-nav">
        {items.map(i => (
          <a key={i.id} className={i.id === active ? 'active' : ''} href="#">
            <span style={{ width: 16, textAlign:'center' }}>{i.icon}</span>
            <span>{i.label}</span>
          </a>
        ))}
      </nav>
      <div className="side-foot">
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <div className="avatar" style={{ background:'var(--yellow)' }}>HW</div>
          <div style={{ flex: 1 }}>
            <div className="display" style={{ fontSize: 13 }}>Handsome Jack</div>
            <div className="label" style={{ fontSize: 9, color:'var(--muted)' }}>The Watering Hole</div>
          </div>
        </div>
        <div className="pill pill-cyan" style={{ marginTop: 10, fontSize: 10 }}>★ Pro Plan</div>
      </div>
    </aside>
  );
};

const TopBar = ({ title, subtitle, right }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 18 }}>
    <div>
      <div className="display" style={{ fontSize: 26, color:'var(--text)', textShadow:'2px 2px 0 #000' }}>{title}</div>
      {subtitle && <div className="body" style={{ color:'var(--muted)', marginTop: 4, fontSize: 14 }}>{subtitle}</div>}
    </div>
    <div>{right}</div>
  </div>
);

// ============================================================
// H1 — Host Dashboard (home)
// ============================================================
function H1Dashboard() {
  return (
    <div className="host-shell">
      <div className="halftone-bg" />
      <SidebarNav active="dashboard" />
      <div className="main">
        <TopBar
          title="Welcome back, Jack"
          subtitle="Friday night kicks off in 2 hours. Your decks are ready."
          right={<button className="btn btn-primary"><span>+ New Game</span></button>}
        />

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { n: '12', c: 'Games this month', accent: 'var(--yellow)' },
            { n: '348', c: 'Players hosted', accent: 'var(--cyan)' },
            { n: '7', c: 'Question banks', accent: 'var(--orange)' },
            { n: '14', c: 'Rounds built', accent: 'var(--magenta)' },
          ].map(s => (
            <div key={s.c} className="stat">
              <div className="num" style={{ color: s.accent, fontSize: 36 }}>{s.n}</div>
              <div className="cap">{s.c}</div>
            </div>
          ))}
        </div>

        {/* Free tier banner — Pro user, but show pattern */}
        <div className="card" style={{ padding: 14, marginBottom: 18, display:'flex', alignItems:'center', gap: 14, background:'var(--panel)', borderColor: 'var(--yellow)', borderWidth: 3 }}>
          <div style={{
            width: 44, height: 44, background:'var(--yellow)', border:'2.5px solid #000',
            display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Rajdhani', fontWeight:700, fontSize: 22, color:'#000'
          }}>★</div>
          <div style={{ flex: 1 }}>
            <div className="display" style={{ fontSize: 16 }}>Pro plan · Unlimited games</div>
            <div className="body" style={{ color:'var(--muted)', fontSize: 13 }}>Renews May 28. Hosting any size venue, any night.</div>
          </div>
          <button className="btn btn-ghost">Manage</button>
        </div>

        <div className="card" style={{ padding: 0, overflow:'hidden' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding: '12px 16px' }}>
            <div className="display" style={{ fontSize: 16 }}>Recent Games</div>
            <div style={{ display:'flex', gap: 8 }}>
              <input className="input" placeholder="Search..." style={{ width: 200, padding:'6px 10px', fontSize: 13 }} />
              <button className="btn btn-ghost" style={{ padding:'6px 12px', fontSize: 12 }}>Filter</button>
            </div>
          </div>
          <table className="tbl">
            <thead><tr>
              <th>Game</th><th>Date</th><th>Players</th><th>Rounds</th><th>Status</th><th></th>
            </tr></thead>
            <tbody>
              {[
                { n: 'Friday Night Trivia', d: 'Apr 26', p: 32, r: 4, s: 'ENDED', sc: 'var(--muted)' },
                { n: 'Pub Quiz Showdown', d: 'Apr 19', p: 28, r: 3, s: 'ENDED', sc: 'var(--muted)' },
                { n: 'Saturday Smackdown', d: 'Apr 13', p: 41, r: 4, s: 'ENDED', sc: 'var(--muted)' },
                { n: 'Trivia Bash IV', d: 'Apr 06', p: 24, r: 3, s: 'ENDED', sc: 'var(--muted)' },
                { n: 'Trivia Test Run', d: 'Today', p: 14, r: 4, s: 'LIVE', sc: 'var(--cyan)' },
              ].map((g, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{g.n}</td>
                  <td style={{ color:'var(--muted)' }}>{g.d}</td>
                  <td><span className="num" style={{ color:'var(--yellow)' }}>{g.p}</span></td>
                  <td>{g.r}</td>
                  <td><span className="label" style={{ fontSize: 10, color: g.sc }}>● {g.s}</span></td>
                  <td style={{ textAlign:'right' }}>
                    <button className="btn btn-ghost" style={{ padding:'4px 10px', fontSize: 11 }}>Open</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// H2 — Create New Game
// ============================================================
function H2CreateGame() {
  const [mode, setMode] = useStateH('mixed');
  const rounds = [
    { id: 1, name: 'Pop Culture · 8 Q', pts: 5400, sel: true },
    { id: 2, name: 'Science & Nature · 8 Q', pts: 6200, sel: true },
    { id: 3, name: 'Sports · 6 Q', pts: 4800, sel: true },
    { id: 4, name: 'Lightning Round · 10 Q', pts: 7500, sel: true },
    { id: 5, name: 'Geography · 8 Q', pts: 5800, sel: false },
    { id: 6, name: 'Movie Quotes · 6 Q', pts: 4200, sel: false },
  ];
  return (
    <div className="host-shell">
      <div className="halftone-bg" />
      <SidebarNav active="games" />
      <div className="main">
        <TopBar
          title="Create New Game"
          subtitle="Configure tonight's game. Players will join with a 6-digit code once you launch."
          right={
            <div style={{ display:'flex', gap: 10 }}>
              <button className="btn btn-ghost">Cancel</button>
              <button className="btn btn-primary">Launch Game →</button>
            </div>
          }
        />

        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap: 18 }}>
          <div>
            <div className="card" style={{ padding: 16, marginBottom: 14 }}>
              <div className="label" style={{ fontSize: 11, color:'var(--muted)', marginBottom: 6 }}>Game Name</div>
              <input className="input focused" defaultValue="Friday Night Trivia · Apr 30" />
              <div className="body" style={{ fontSize: 12, color:'var(--muted)', marginTop: 6, fontStyle:'italic' }}>
                Players see this on their lobby screens.
              </div>
            </div>

            <div className="card" style={{ padding: 16, marginBottom: 14 }}>
              <div className="label" style={{ fontSize: 11, color:'var(--muted)', marginBottom: 10 }}>Game Mode</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 10 }}>
                {[
                  { id:'solo', l:'Solo Only', s:'Everyone competes alone', i: '◉' },
                  { id:'team', l:'Teams Only', s:'Squads of any size', i: '⋮⋮' },
                  { id:'mixed', l:'Mixed', s:'Solo or team — player picks', i: '◈' },
                ].map(m => {
                  const sel = mode === m.id;
                  return (
                    <button key={m.id} onClick={()=>setMode(m.id)} style={{
                      background: sel ? 'rgba(245,200,0,0.06)' : 'var(--panel)',
                      border: sel ? '3px solid var(--yellow)' : '2.5px solid #000',
                      boxShadow: sel ? '4px 4px 0 var(--yellow)' : '4px 4px 0 #000',
                      borderRadius: 4, padding: 12, cursor:'pointer', textAlign:'left',
                    }}>
                      <div style={{
                        width: 32, height: 32, marginBottom: 8,
                        background: sel ? 'var(--yellow)' : 'var(--dark)',
                        border:'2px solid #000', borderRadius: 3,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontFamily:'Rajdhani', fontWeight:700, fontSize: 16, color: sel ? '#000' : 'var(--text)'
                      }}>{m.i}</div>
                      <div className="display" style={{ fontSize: 15, color: sel ? 'var(--yellow)' : 'var(--text)' }}>{m.l}</div>
                      <div className="body" style={{ fontSize: 12, color:'var(--muted)', marginTop: 2 }}>{m.s}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card" style={{ padding: 16 }}>
              <div className="label" style={{ fontSize: 11, color:'var(--muted)', marginBottom: 4 }}>Settings</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, marginTop: 10 }}>
                <div>
                  <div className="label" style={{ fontSize: 10, color:'var(--muted)', marginBottom: 4 }}>Default Timer</div>
                  <input className="input" defaultValue="20s" />
                </div>
                <div>
                  <div className="label" style={{ fontSize: 10, color:'var(--muted)', marginBottom: 4 }}>Late Joiners</div>
                  <input className="input" defaultValue="Allowed" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10 }}>
                <div className="label" style={{ fontSize: 11, color:'var(--muted)' }}>Rounds in this Game</div>
                <button className="btn btn-cyan" style={{ padding:'4px 10px', fontSize: 11 }}>+ Add</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
                {rounds.filter(r => r.sel).map((r, i) => (
                  <div key={r.id} style={{
                    display:'flex', alignItems:'center', gap: 10,
                    background: 'var(--panel)', border:'2px solid #000', borderRadius: 3,
                    padding: '8px 10px',
                  }}>
                    <span style={{ color:'var(--muted)', fontFamily:'monospace', fontSize: 12 }}>⋮⋮</span>
                    <span className="num" style={{ color:'var(--yellow)', width: 20 }}>{i+1}</span>
                    <div className="body" style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{r.name}</div>
                    <div className="label" style={{ fontSize: 10, color:'var(--muted)' }}>{r.pts.toLocaleString()} pts</div>
                    <button style={{ background:'none', border:'none', color:'var(--magenta)', cursor:'pointer', fontSize: 14 }}>✕</button>
                  </div>
                ))}
                <div style={{ height: 1, background:'#000', margin:'4px 0' }} />
                <div className="label" style={{ fontSize: 10, color:'var(--muted)', padding:'4px 0' }}>From Library</div>
                {rounds.filter(r => !r.sel).map(r => (
                  <div key={r.id} style={{
                    display:'flex', alignItems:'center', gap: 10,
                    background: 'transparent', border:'2px dashed #2a2a2a', borderRadius: 3,
                    padding: '8px 10px', opacity: 0.7
                  }}>
                    <div className="body" style={{ flex: 1, fontWeight: 500, fontSize: 13 }}>{r.name}</div>
                    <button className="btn btn-ghost" style={{ padding:'2px 8px', fontSize: 10 }}>+ Add</button>
                  </div>
                ))}
              </div>
              <div className="divider" style={{ margin:'14px 0' }} />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
                <div>
                  <div className="label" style={{ fontSize: 10, color:'var(--muted)' }}>Total Questions</div>
                  <div className="num" style={{ fontSize: 22, color:'var(--yellow)' }}>32</div>
                </div>
                <div>
                  <div className="label" style={{ fontSize: 10, color:'var(--muted)' }}>Est. Time</div>
                  <div className="num" style={{ fontSize: 22, color:'var(--cyan)' }}>~45 min</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// H3 — Host Lobby
// ============================================================
function H3HostLobby() {
  const players = [
    { n: 'Vault Hunter', t: 'The Mitochondrias', c: 'orange', time: '7:42' },
    { n: 'Tiny Tina', t: 'SOLO', c: 'cyan', time: '7:43' },
    { n: 'Zer0', t: 'The Mitochondrias', c: 'orange', time: '7:43' },
    { n: 'Lilith', t: 'Sirens', c: 'magenta', time: '7:44' },
    { n: 'Mordecai', t: 'SOLO', c: 'cyan', time: '7:45' },
    { n: 'Roland', t: 'Crimson Lance', c: 'yellow', time: '7:45' },
    { n: 'Claptrap', t: 'SOLO', c: 'cyan', time: '7:46' },
    { n: 'Maya', t: 'Sirens', c: 'magenta', time: '7:46' },
    { n: 'Axton', t: 'Crimson Lance', c: 'yellow', time: '7:47' },
    { n: 'Salvador', t: 'SOLO', c: 'cyan', time: '7:47' },
    { n: 'Krieg', t: 'Crimson Lance', c: 'yellow', time: '7:48' },
    { n: 'Gaige', t: 'The Mitochondrias', c: 'orange', time: '7:48' },
    { n: 'Athena', t: 'Sirens', c: 'magenta', time: '7:49' },
    { n: 'Wilhelm', t: 'SOLO', c: 'cyan', time: '7:49' },
  ];
  // Build a fake QR (simple grid)
  const qrCells = Array.from({ length: 17*17 }, (_, i) => {
    const x = i % 17, y = Math.floor(i / 17);
    // finder patterns
    const corner = (x < 4 && y < 4) || (x > 12 && y < 4) || (x < 4 && y > 12);
    const inner = (x === 1 || x === 2) && (y === 1 || y === 2);
    const innerR = (x === 14 || x === 15) && (y === 1 || y === 2);
    const innerB = (x === 1 || x === 2) && (y === 14 || y === 15);
    if (corner) return (x===0||x===3||y===0||y===3||x===13||x===16||x===12||y===12||y===16) ? 1 : 0;
    if (inner || innerR || innerB) return 1;
    return ((x*7+y*3+i)%3 === 0 || (x*y+i)%5 === 0) ? 1 : 0;
  });

  return (
    <div className="host-shell">
      <div className="halftone-bg" />
      <SidebarNav active="games" />
      <div className="main">
        <TopBar
          title="Friday Night Trivia"
          subtitle="Lobby is open · Players can join now"
          right={
            <div style={{ display:'flex', gap: 8 }}>
              <button className="btn btn-ghost">Settings</button>
              <button className="btn btn-danger">End Lobby</button>
            </div>
          }
        />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 18 }}>
          <div>
            <div className="card-deep" style={{ marginBottom: 14 }}>
              <div className="card corners" style={{ padding: 22, textAlign:'center', minHeight: 220 }}>
                <span className="crn-bl" /><span className="crn-br" />
                <div className="label" style={{ fontSize: 11, color:'var(--muted)' }}>Game Code</div>
                <div className="display" style={{ fontSize: 78, color:'var(--yellow)', textShadow:'4px 4px 0 #000', letterSpacing: '0.18em', lineHeight: 1, marginTop: 6 }}>
                  847 291
                </div>
                <div className="body" style={{ fontSize: 13, color:'var(--muted)', marginTop: 8 }}>
                  Play at <span style={{ color:'var(--cyan)' }}>triviairl.com/play</span>
                </div>
                <button className="btn btn-ghost" style={{ marginTop: 12, padding:'6px 14px', fontSize: 12 }}>Copy Code</button>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'170px 1fr', gap: 14 }}>
              <div className="card" style={{ padding: 10, background:'#fff' }}>
                <div style={{
                  display:'grid',
                  gridTemplateColumns:'repeat(17, 1fr)',
                  gap: 1,
                  width: '100%',
                  aspectRatio: '1',
                }}>
                  {qrCells.map((c, i) => (
                    <div key={i} style={{ background: c ? '#000' : '#fff', aspectRatio:'1' }} />
                  ))}
                </div>
              </div>
              <div className="card" style={{ padding: 14 }}>
                <div className="label" style={{ fontSize: 10, color:'var(--muted)' }}>Game Config</div>
                <div style={{ display:'flex', flexDirection:'column', gap: 6, marginTop: 8 }}>
                  {[
                    ['Mode', 'Mixed'],
                    ['Rounds', '4'],
                    ['Questions', '32'],
                    ['Default timer', '20s'],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between' }}>
                      <span className="label" style={{ fontSize: 10, color:'var(--muted)' }}>{k}</span>
                      <span className="display" style={{ fontSize: 13 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary btn-block" style={{ marginTop: 14, fontSize: 16 }}>Start Game →</button>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow:'hidden' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding: '12px 14px', borderBottom:'2px solid #000' }}>
              <div className="display" style={{ fontSize: 16 }}>Live Roster</div>
              <div style={{ display:'flex', gap: 6 }}>
                <div className="pill"><span className="num">{players.length}</span><span style={{ fontSize: 9 }}>PLAYERS</span></div>
                <div className="pill pill-cyan"><span className="num">4</span><span style={{ fontSize: 9 }}>TEAMS</span></div>
              </div>
            </div>
            <div style={{ maxHeight: 480, overflow: 'auto' }}>
              {players.map((p, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap: 10,
                  padding: '8px 14px',
                  borderBottom:'1.5px solid #0a0a0a',
                }}>
                  <div className={`avatar sm ${p.c}`}>{p.n.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
                  <div className="body" style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{p.n}</div>
                  <div className="label" style={{ fontSize: 9, color: p.t === 'SOLO' ? 'var(--cyan)' : 'var(--muted)' }}>{p.t}</div>
                  <div className="label" style={{ fontSize: 9, color:'var(--muted-2)', width: 36, textAlign:'right' }}>{p.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// H4 — Host Live Game (question view)
// ============================================================
function H4HostLive() {
  const counts = { A: 3, B: 6, C: 2, D: 0 };
  const total = 14;
  const answered = 11;
  const players = [
    { n:'Vault Hunter', a: true, c:'orange' }, { n:'Tiny Tina', a: true, c:'cyan' },
    { n:'Zer0', a: true, c:'orange' }, { n:'Lilith', a: true, c:'magenta' },
    { n:'Mordecai', a: true, c:'cyan' }, { n:'Roland', a: false, c:'yellow' },
    { n:'Claptrap', a: true, c:'cyan' }, { n:'Maya', a: true, c:'magenta' },
    { n:'Axton', a: true, c:'yellow' }, { n:'Salvador', a: false, c:'cyan' },
    { n:'Krieg', a: true, c:'yellow' }, { n:'Gaige', a: true, c:'orange' },
    { n:'Athena', a: false, c:'magenta' }, { n:'Wilhelm', a: true, c:'cyan' },
  ];

  return (
    <div className="host-shell">
      <div className="halftone-bg" />
      <SidebarNav active="games" />
      <div className="main" style={{ paddingBottom: 0 }}>
        {/* Top bar */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 14 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
            <div className="display" style={{ fontSize: 22 }}>Friday Night Trivia</div>
            <div className="pill">Round 2 / 4</div>
            <div className="pill pill-cyan">Q 3 / 8</div>
            <div className="pill pill-dark">{total} players</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
            <div style={{
              border:'3px solid #000', boxShadow:'4px 4px 0 #000',
              padding:'4px 14px', background:'var(--panel)', borderRadius: 3,
              display:'flex', alignItems:'baseline', gap: 8
            }}>
              <span className="label" style={{ fontSize: 10, color:'var(--muted)' }}>Time</span>
              <span className="num" style={{ fontSize: 28, color:'var(--yellow)' }}>14s</span>
            </div>
            <button className="btn btn-ghost">Override · Close Early</button>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.1fr 1.2fr 0.85fr', gap: 14, height: 640 }}>
          {/* Left — question preview */}
          <div className="card" style={{ padding: 16, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10 }}>
              <div className="tag-outline">Cell Biology</div>
              <div className="label" style={{ fontSize: 10, color:'var(--muted)' }}>Bank: Science Pack v2</div>
            </div>
            <div className="display" style={{ fontSize: 22, lineHeight: 1.15, color:'var(--text)', marginBottom: 14, textWrap:'balance' }}>
              Which organelle is known as the powerhouse of the cell?
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap: 8, flex: 1 }}>
              {[
                { l:'A', t:'The Endoplasmic Reticulum' },
                { l:'B', t:'The Mitochondria', correct: true },
                { l:'C', t:'The Golgi Apparatus' },
                { l:'D', t:'The Ribosome' },
              ].map(a => (
                <div key={a.l} style={{
                  display:'flex', alignItems:'center', gap: 10,
                  background: a.correct ? 'rgba(74,222,128,0.1)' : 'var(--panel)',
                  border: a.correct ? '2.5px solid var(--green)' : '2px solid #000',
                  borderRadius: 3, padding: '10px 12px',
                }}>
                  <span className={`ltile ${a.correct ? 'green' : ''}`}>{a.l}</span>
                  <span className="body" style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{a.t}</span>
                  {a.correct && <span className="label" style={{ fontSize: 10, color:'var(--green)' }}>● Correct</span>}
                </div>
              ))}
            </div>

            <div className="divider" style={{ margin:'14px 0' }} />
            <div style={{ display:'flex', gap: 14 }}>
              <div>
                <div className="label" style={{ fontSize: 10, color:'var(--muted)' }}>Max Points</div>
                <div className="num" style={{ fontSize: 18, color:'var(--yellow)' }}>1,000</div>
              </div>
              <div>
                <div className="label" style={{ fontSize: 10, color:'var(--muted)' }}>Timer</div>
                <div className="num" style={{ fontSize: 18, color:'var(--cyan)' }}>20s</div>
              </div>
              <div>
                <div className="label" style={{ fontSize: 10, color:'var(--muted)' }}>Difficulty</div>
                <div className="num" style={{ fontSize: 18, color:'var(--orange)' }}>EASY</div>
              </div>
            </div>
          </div>

          {/* Center — submission tracker */}
          <div className="card" style={{ padding: 16, display:'flex', flexDirection:'column' }}>
            <div className="label" style={{ fontSize: 11, color:'var(--muted)', marginBottom: 6 }}>Submissions</div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <div className="num" style={{ fontSize: 38, color:'var(--text)' }}>
                <span style={{ color:'var(--yellow)' }}>{answered}</span><span style={{ color:'var(--muted)' }}> / {total}</span>
              </div>
              <div className="label" style={{ fontSize: 11, color:'var(--cyan)' }}>● Live</div>
            </div>
            <div className="progress" style={{ marginTop: 8 }}>
              <div className="fill" style={{ width: `${(answered/total)*100}%`, background:'var(--cyan)' }} />
            </div>

            <div className="divider" style={{ margin:'14px 0' }} />

            <div className="label" style={{ fontSize: 11, color:'var(--muted)', marginBottom: 8 }}>Per-answer breakdown</div>
            <div style={{ display:'flex', flexDirection:'column', gap: 7 }}>
              {Object.entries(counts).map(([l, n]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap: 8 }}>
                  <span className="ltile" style={{ width: 22, height: 22, fontSize: 12 }}>{l}</span>
                  <div style={{ flex: 1, height: 18, background:'#0a0a0a', border:'2px solid #000' }}>
                    <div style={{ width: `${(n/total)*100}%`, height:'100%', background: 'var(--cyan)', borderRight:'2px solid #000' }} />
                  </div>
                  <span className="num" style={{ width: 24, textAlign:'right', color:'var(--text)' }}>{n}</span>
                </div>
              ))}
            </div>

            <div className="divider" style={{ margin:'14px 0' }} />

            <div className="label" style={{ fontSize: 11, color:'var(--muted)', marginBottom: 8 }}>Players</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap: 6 }}>
              {players.map((p, i) => (
                <div key={i} style={{ position:'relative' }}>
                  <div className={`avatar ${p.c}`} style={{ width:'100%', aspectRatio:'1', height:'auto', opacity: p.a ? 1 : 0.35 }}>
                    {p.n.split(' ').map(s=>s[0]).slice(0,2).join('')}
                  </div>
                  <span style={{
                    position:'absolute', bottom: -2, right: -2,
                    width: 10, height: 10, borderRadius: '50%',
                    background: p.a ? 'var(--green)' : 'var(--muted-2)',
                    border:'2px solid #000',
                  }} />
                </div>
              ))}
            </div>
            <div className="body" style={{ fontSize: 11, color:'var(--muted)', marginTop: 'auto', fontStyle:'italic' }}>
              ● answered  ◌ pending — counts hidden from players until reveal
            </div>
          </div>

          {/* Right — controls */}
          <div className="card" style={{ padding: 16, display:'flex', flexDirection:'column' }}>
            <div className="label" style={{ fontSize: 11, color:'var(--muted)', marginBottom: 8 }}>Question Controls</div>
            <button className="btn btn-disabled btn-block" style={{ marginBottom: 10 }}>Reveal Answer</button>
            <div className="body" style={{ fontSize: 11, color:'var(--muted)', textAlign:'center', marginBottom: 14 }}>
              Available when timer ends or all players submit
            </div>

            <button className="btn btn-cyan btn-block" style={{ marginBottom: 8 }}>End Question Early</button>
            <button className="btn btn-ghost btn-block" style={{ marginBottom: 14 }}>+10s to Timer</button>

            <div className="divider" style={{ margin:'4px 0 14px' }} />
            <div className="label" style={{ fontSize: 11, color:'var(--muted)', marginBottom: 8 }}>Round Controls</div>
            <button className="btn btn-disabled btn-block" style={{ marginBottom: 8 }}>Push Leaderboard</button>
            <button className="btn btn-disabled btn-block" style={{ marginBottom: 14 }}>Next Question →</button>

            <div style={{ marginTop: 'auto' }}>
              <div className="divider" style={{ margin:'0 0 14px' }} />
              <button className="btn btn-ghost btn-block" style={{ marginBottom: 8 }}>End Round</button>
              <button className="btn btn-danger btn-block">End Game</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// H5 — Reveal view
// ============================================================
function H5HostReveal() {
  const breakdown = [
    { l: 'A', t: 'The Endoplasmic Reticulum', n: 3, pct: 21, correct: false },
    { l: 'B', t: 'The Mitochondria', n: 8, pct: 57, correct: true },
    { l: 'C', t: 'The Golgi Apparatus', n: 2, pct: 14, correct: false },
    { l: 'D', t: 'The Ribosome', n: 1, pct: 7, correct: false },
  ];
  const fastest = [
    { n: 'Tiny Tina', t: '2.1s', pts: 980, c: 'cyan' },
    { n: 'Zer0', t: '3.4s', pts: 920, c: 'orange' },
    { n: 'Vault Hunter', t: '4.2s', pts: 880, c: 'orange' },
    { n: 'Lilith', t: '5.0s', pts: 840, c: 'magenta' },
    { n: 'Maya', t: '5.7s', pts: 810, c: 'magenta' },
  ];
  return (
    <div className="host-shell">
      <div className="halftone-bg" />
      <SidebarNav active="games" />
      <div className="main">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 14 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
            <div className="display" style={{ fontSize: 22 }}>Friday Night Trivia</div>
            <div className="pill">Round 2 / 4</div>
            <div className="pill pill-cyan">Q 3 / 8</div>
            <div className="pill pill-magenta">● Revealed</div>
          </div>
          <div style={{ display:'flex', gap: 10 }}>
            <button className="btn btn-cyan">Push Leaderboard</button>
            <button className="btn btn-primary">Next Question →</button>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap: 14 }}>
          <div className="card" style={{ padding: 18 }}>
            <div className="tag-outline" style={{ marginBottom: 8 }}>Cell Biology</div>
            <div className="display" style={{ fontSize: 22, lineHeight: 1.15, marginBottom: 16 }}>
              Which organelle is known as the powerhouse of the cell?
            </div>

            <div className="card-deep" style={{ marginBottom: 18 }}>
              <div className="card" style={{
                padding: 16, background:'rgba(74,222,128,0.08)',
                borderColor: 'var(--green)', borderWidth: 3,
                display:'flex', alignItems:'center', gap: 14,
              }}>
                <div style={{
                  width: 50, height: 50, background:'var(--green)', border:'3px solid #000',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#000', fontFamily:'Rajdhani', fontWeight: 700, fontSize: 28,
                  boxShadow:'2px 2px 0 #000'
                }}>B</div>
                <div style={{ flex: 1 }}>
                  <div className="label" style={{ fontSize: 10, color:'var(--green)' }}>● Correct Answer</div>
                  <div className="display" style={{ fontSize: 20 }}>The Mitochondria</div>
                </div>
                <div className="num" style={{ fontSize: 24, color:'var(--green)' }}>57%</div>
              </div>
            </div>

            <div className="label" style={{ fontSize: 11, color:'var(--muted)', marginBottom: 8 }}>Submission Breakdown</div>
            <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
              {breakdown.map(b => (
                <div key={b.l} style={{ display:'flex', alignItems:'center', gap: 10 }}>
                  <span className={`ltile ${b.correct ? 'green' : ''}`}>{b.l}</span>
                  <div className="body" style={{ flex: 1, fontSize: 13, fontWeight: 600, color: b.correct ? 'var(--green)' : 'var(--muted)' }}>{b.t}</div>
                  <div style={{ width: 200, height: 18, background:'#0a0a0a', border:'2px solid #000' }}>
                    <div style={{
                      width: `${b.pct}%`, height:'100%',
                      background: b.correct ? 'var(--green)' : 'var(--muted-2)',
                      borderRight:'2px solid #000'
                    }} />
                  </div>
                  <div className="num" style={{ width: 50, textAlign:'right', color: b.correct ? 'var(--green)' : 'var(--muted)' }}>{b.n} <span style={{ fontSize: 10 }}>({b.pct}%)</span></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div className="label" style={{ fontSize: 11, color:'var(--muted)' }}>Top Scorers · This Question</div>
            <div className="num" style={{ fontSize: 14, color:'var(--cyan)', marginTop: 4, marginBottom: 12 }}>● Fastest correct answers earn the most</div>
            <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
              {fastest.map((p, i) => (
                <div key={p.n} style={{
                  display:'flex', alignItems:'center', gap: 10,
                  background:'var(--panel)', border:'2px solid #000', borderRadius: 3,
                  padding:'8px 10px',
                }}>
                  <div className="num" style={{ width: 22, color: i === 0 ? 'var(--yellow)' : 'var(--muted)' }}>#{i+1}</div>
                  <div className={`avatar sm ${p.c}`}>{p.n.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
                  <div className="body" style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{p.n}</div>
                  <div className="label" style={{ fontSize: 10, color:'var(--muted)' }}>{p.t}</div>
                  <div className="num" style={{ color:'var(--yellow)', fontSize: 14 }}>+{p.pts}</div>
                </div>
              ))}
            </div>

            <div className="divider" style={{ margin:'14px 0' }} />

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
              <div className="stat" style={{ padding:'10px 12px' }}>
                <div className="num" style={{ fontSize: 22, color:'var(--cyan)' }}>4.8s</div>
                <div className="cap">Avg Response</div>
              </div>
              <div className="stat" style={{ padding:'10px 12px' }}>
                <div className="num" style={{ fontSize: 22, color:'var(--green)' }}>57%</div>
                <div className="cap">Correct Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// H6 — Question Bank Manager
// ============================================================
function H6BankManager() {
  const banks = [
    { n: 'Science Pack v2', q: 84, src: 'Mixed', edited: '2 days ago', sel: true },
    { n: 'Pop Culture Pack', q: 122, src: 'Manual', edited: '5 days ago' },
    { n: 'Sports Trivia', q: 56, src: 'OpenTDB', edited: '1 week ago' },
    { n: 'Geography Mega', q: 96, src: 'OpenTDB', edited: '2 weeks ago' },
    { n: 'Lightning Round', q: 40, src: 'Manual', edited: '3 weeks ago' },
    { n: 'Movie Quotes', q: 64, src: 'Manual', edited: '1 month ago' },
    { n: 'History 101', q: 78, src: 'Mixed', edited: '1 month ago' },
  ];
  const questions = [
    { q: 'Which organelle is known as the powerhouse of the cell?', ans: 4, pts: 1000, t: '20s', src: 'Manual', cat: 'Cell Biology' },
    { q: 'What planet has the most moons?', ans: 4, pts: 1000, t: '20s', src: 'OpenTDB', cat: 'Astronomy' },
    { q: 'Which element has the chemical symbol Fe?', ans: 4, pts: 800, t: '15s', src: 'OpenTDB', cat: 'Chemistry' },
    { q: 'What is the largest desert on Earth?', ans: 4, pts: 1000, t: '20s', src: 'Manual', cat: 'Geology' },
    { q: 'In what year was DNA double helix structure discovered?', ans: 4, pts: 1500, t: '25s', src: 'Manual', cat: 'Biology' },
    { q: 'Which gas makes up most of Earth\'s atmosphere?', ans: 4, pts: 800, t: '15s', src: 'OpenTDB', cat: 'Earth Science' },
    { q: 'What\'s the speed of light in vacuum (km/s)?', ans: 4, pts: 1500, t: '25s', src: 'Manual', cat: 'Physics' },
  ];
  return (
    <div className="host-shell">
      <div className="halftone-bg" />
      <SidebarNav active="banks" />
      <div className="main">
        <TopBar
          title="Question Banks"
          subtitle="Reusable pools of questions. Build rounds from these."
          right={<button className="btn btn-primary">+ New Bank</button>}
        />

        <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap: 14 }}>
          <div className="card" style={{ padding: 0, overflow:'hidden' }}>
            <div style={{ padding: 12, borderBottom:'2px solid #000' }}>
              <input className="input" placeholder="Search banks..." style={{ fontSize: 13, padding: '8px 12px' }} />
            </div>
            <div style={{ maxHeight: 580, overflow:'auto' }}>
              {banks.map((b, i) => (
                <div key={i} style={{
                  padding: '12px 14px',
                  borderBottom: '1.5px solid #0a0a0a',
                  borderLeft: b.sel ? '4px solid var(--yellow)' : '4px solid transparent',
                  background: b.sel ? 'rgba(245,200,0,0.06)' : 'transparent',
                  cursor:'pointer',
                }}>
                  <div className="display" style={{ fontSize: 14, color: b.sel ? 'var(--yellow)' : 'var(--text)' }}>{b.n}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 4 }}>
                    <div className="label" style={{ fontSize: 10, color:'var(--muted)' }}>{b.q} Q · {b.src}</div>
                    <div className="label" style={{ fontSize: 9, color:'var(--muted-2)' }}>{b.edited}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 16, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 14 }}>
              <div>
                <div className="label" style={{ fontSize: 10, color:'var(--muted)' }}>Editing Bank</div>
                <input className="input" defaultValue="Science Pack v2" style={{ fontFamily:'Rajdhani', fontWeight: 700, fontSize: 22, padding:'4px 8px', background:'transparent', border:'2px dashed transparent' }} />
              </div>
              <div style={{ display:'flex', gap: 8 }}>
                <button className="btn btn-cyan">Import OpenTDB</button>
                <button className="btn btn-primary">+ Add Question</button>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
              {[['84','Questions','var(--yellow)'],['7','Categories','var(--cyan)'],['62','Manual','var(--orange)'],['22','OpenTDB','var(--magenta)']].map(([n,c,col]) => (
                <div key={c} className="stat" style={{ padding: 10 }}>
                  <div className="num" style={{ fontSize: 22, color: col }}>{n}</div>
                  <div className="cap">{c}</div>
                </div>
              ))}
            </div>

            <table className="tbl">
              <thead><tr>
                <th style={{ width: 30 }}><input type="checkbox" /></th>
                <th>Question</th>
                <th style={{ width: 110 }}>Category</th>
                <th style={{ width: 70 }}>Points</th>
                <th style={{ width: 60 }}>Timer</th>
                <th style={{ width: 90 }}>Source</th>
                <th style={{ width: 80 }}></th>
              </tr></thead>
              <tbody>
                {questions.map((q, i) => (
                  <tr key={i}>
                    <td><input type="checkbox" /></td>
                    <td style={{ fontWeight: 500 }}>{q.q}</td>
                    <td><span className="tag-outline" style={{ fontSize: 9 }}>{q.cat}</span></td>
                    <td><span className="num" style={{ color:'var(--yellow)' }}>{q.pts.toLocaleString()}</span></td>
                    <td>{q.t}</td>
                    <td><span className="label" style={{ fontSize: 9, color: q.src === 'OpenTDB' ? 'var(--cyan)' : 'var(--muted)' }}>{q.src}</span></td>
                    <td style={{ textAlign:'right' }}>
                      <button style={{ background:'none', border:'none', color:'var(--cyan)', cursor:'pointer', fontSize: 11, fontFamily:'Barlow Condensed', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Edit</button>
                      <button style={{ background:'none', border:'none', color:'var(--magenta)', cursor:'pointer', fontSize: 11, marginLeft: 6, fontFamily:'Barlow Condensed', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// H7 — OpenTDB Import Modal
// ============================================================
function H7ImportModal() {
  const [diff, setDiff] = useStateH('medium');
  const previews = [
    { q: 'What is the rarest blood type?', a: 'AB Negative', d: 'medium', sel: true },
    { q: 'Which is the only mammal capable of true flight?', a: 'Bat', d: 'easy', sel: true },
    { q: 'What is the smallest country in the world?', a: 'Vatican City', d: 'medium', sel: true },
    { q: 'How many bones are in the adult human body?', a: '206', d: 'medium', sel: true },
    { q: 'Which planet rotates on its side?', a: 'Uranus', d: 'medium', sel: false },
    { q: 'What gas do plants absorb during photosynthesis?', a: 'Carbon Dioxide', d: 'easy', sel: true },
    { q: 'Who proposed the theory of general relativity?', a: 'Albert Einstein', d: 'easy', sel: true },
  ];
  return (
    <div className="host-shell" style={{ position:'relative' }}>
      <div className="halftone-bg" />
      <SidebarNav active="banks" />
      <div className="main" style={{ filter:'blur(1px) brightness(0.45)', pointerEvents:'none' }}>
        <TopBar title="Question Banks" subtitle="Reusable pools of questions." right={<button className="btn btn-primary">+ New Bank</button>} />
        <div className="card" style={{ height: 600 }} />
      </div>

      {/* Modal */}
      <div style={{
        position:'absolute', inset: 0, background:'rgba(10,10,10,0.7)',
        display:'flex', alignItems:'center', justifyContent:'center', zIndex: 10
      }}>
        <div className="card-deep" style={{ width: 760 }}>
          <div className="card" style={{ background:'var(--card-2)', borderWidth: 3 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 18px', borderBottom:'2px solid #000' }}>
              <div>
                <div className="label" style={{ fontSize: 10, color:'var(--cyan)' }}>● Open Trivia Database</div>
                <div className="display" style={{ fontSize: 20 }}>Import Questions</div>
              </div>
              <button style={{ background:'none', border:'2px solid #000', color:'var(--text)', width:32, height:32, fontSize:18, cursor:'pointer' }}>✕</button>
            </div>

            <div style={{ padding: 18 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <div className="label" style={{ fontSize: 10, color:'var(--muted)', marginBottom: 6 }}>Category</div>
                  <select className="input" defaultValue="Science: Nature">
                    <option>Science: Nature</option>
                    <option>Science: Computers</option>
                    <option>General Knowledge</option>
                    <option>Entertainment: Film</option>
                  </select>
                </div>
                <div>
                  <div className="label" style={{ fontSize: 10, color:'var(--muted)', marginBottom: 6 }}>Number of Questions</div>
                  <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                    <input type="range" min="1" max="50" defaultValue="20" style={{ flex: 1 }} />
                    <div className="num" style={{ color:'var(--yellow)', fontSize: 20, minWidth: 30 }}>20</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div className="label" style={{ fontSize: 10, color:'var(--muted)', marginBottom: 6 }}>Difficulty</div>
                <div style={{ display:'flex', gap: 8 }}>
                  {['any','easy','medium','hard'].map(d => {
                    const sel = diff === d;
                    return (
                      <button key={d} onClick={()=>setDiff(d)} className="btn" style={{
                        flex: 1,
                        background: sel ? 'var(--cyan)' : 'transparent',
                        color: sel ? '#000' : 'var(--cyan)',
                        border: '2.5px solid var(--cyan)',
                        boxShadow: sel ? '3px 3px 0 #000' : 'none',
                        padding: '8px',
                      }}>{d}</button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8 }}>
                <div className="label" style={{ fontSize: 10, color:'var(--muted)' }}>Preview · Select to import</div>
                <div style={{ display:'flex', gap: 8 }}>
                  <button className="btn btn-ghost" style={{ padding:'4px 10px', fontSize: 11 }}>Select All</button>
                  <button className="btn btn-ghost" style={{ padding:'4px 10px', fontSize: 11 }}>Refetch</button>
                </div>
              </div>
              <div style={{ maxHeight: 240, overflow:'auto', border:'2px solid #000', borderRadius: 3 }}>
                {previews.map((p, i) => (
                  <div key={i} style={{
                    display:'flex', alignItems:'center', gap: 10,
                    padding:'10px 12px',
                    borderBottom:'1.5px solid #0a0a0a',
                    background: p.sel ? 'rgba(0,229,255,0.05)' : 'transparent',
                  }}>
                    <input type="checkbox" defaultChecked={p.sel} />
                    <div style={{ flex: 1 }}>
                      <div className="body" style={{ fontWeight: 600, fontSize: 13 }}>{p.q}</div>
                      <div className="body" style={{ fontSize: 11, color:'var(--muted)', marginTop: 2 }}>
                        Correct: <span style={{ color:'var(--green)' }}>{p.a}</span>
                      </div>
                    </div>
                    <div className="pill" style={{
                      fontSize: 9,
                      background: p.d === 'easy' ? 'var(--green)' : p.d === 'medium' ? 'var(--yellow)' : 'var(--magenta)'
                    }}>{p.d}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 18px', borderTop:'2px solid #000' }}>
              <div className="label" style={{ fontSize: 11, color:'var(--muted)' }}>
                <span className="num" style={{ color:'var(--cyan)', fontSize: 18 }}>6</span> of 7 selected
              </div>
              <div style={{ display:'flex', gap: 10 }}>
                <button className="btn btn-ghost">Cancel</button>
                <button className="btn btn-primary">Import 6 Questions →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// H8 — Round Builder
// ============================================================
function H8RoundBuilder() {
  const qs = [
    { q: 'Which organelle is known as the powerhouse of the cell?', pts: 1000, t: '20s', src: 'Science Pack v2' },
    { q: 'What planet has the most moons?', pts: 1000, t: '20s', src: 'Science Pack v2' },
    { q: 'In what year did the Apollo 11 land on the moon?', pts: 1500, t: '25s', src: 'History 101' },
    { q: 'Which element has the chemical symbol Fe?', pts: 800, t: '15s', src: 'Science Pack v2' },
    { q: 'What is the largest desert on Earth?', pts: 1000, t: '20s', src: 'Geography Mega' },
    { q: 'Which gas makes up most of Earth\'s atmosphere?', pts: 800, t: '15s', src: 'Science Pack v2' },
    { q: 'How many bones are in the adult human body?', pts: 1000, t: '20s', src: 'Science Pack v2' },
    { q: 'What\'s the speed of light in vacuum (km/s)?', pts: 1500, t: '25s', src: 'Science Pack v2' },
  ];
  return (
    <div className="host-shell">
      <div className="halftone-bg" />
      <SidebarNav active="rounds" />
      <div className="main">
        <TopBar
          title="Round Builder"
          subtitle="Drag questions to reorder. Tweak points and timer per question."
          right={
            <div style={{ display:'flex', gap: 10 }}>
              <button className="btn btn-ghost">Save Draft</button>
              <button className="btn btn-primary">Save Round →</button>
            </div>
          }
        />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap: 14 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display:'flex', gap: 12, alignItems:'flex-start', marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <div className="label" style={{ fontSize: 10, color:'var(--muted)', marginBottom: 6 }}>Round Name</div>
                <input className="input focused" defaultValue="Science & Nature Round" />
              </div>
              <div style={{ width: 160 }}>
                <div className="label" style={{ fontSize: 10, color:'var(--muted)', marginBottom: 6 }}>Theme Color</div>
                <div style={{ display:'flex', gap: 6 }}>
                  {['var(--yellow)','var(--cyan)','var(--orange)','var(--magenta)'].map((c, i) => (
                    <div key={i} style={{
                      width: 36, height: 36, background: c, border: i===1 ? '3px solid #fff' : '2.5px solid #000',
                      borderRadius: 3, boxShadow:'2px 2px 0 #000', cursor:'pointer'
                    }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="divider" style={{ margin:'4px 0 14px' }} />

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10 }}>
              <div className="label" style={{ fontSize: 11, color:'var(--muted)' }}>Questions in this Round</div>
              <button className="btn btn-cyan" style={{ padding:'6px 12px', fontSize: 12 }}>+ Add Questions</button>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
              {qs.map((q, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap: 10,
                  background:'var(--panel)',
                  border:'2px solid #000', borderRadius: 3,
                  padding: '10px 12px',
                  boxShadow: i === 0 ? '3px 3px 0 var(--cyan)' : 'none',
                }}>
                  <span style={{ color:'var(--muted)', fontFamily:'monospace', fontSize: 14, cursor:'grab' }}>⋮⋮</span>
                  <span className="num" style={{ color:'var(--yellow)', width: 24, fontSize: 16 }}>{i+1}</span>
                  <div style={{ flex: 1 }}>
                    <div className="body" style={{ fontWeight: 600, fontSize: 13 }}>{q.q}</div>
                    <div className="label" style={{ fontSize: 9, color:'var(--muted)', marginTop: 2 }}>From {q.src}</div>
                  </div>
                  <div style={{ display:'flex', gap: 6 }}>
                    <input className="input" defaultValue={q.pts} style={{ width: 70, padding:'4px 6px', fontSize: 12, textAlign:'center', color:'var(--yellow)' }} />
                    <input className="input" defaultValue={q.t} style={{ width: 50, padding:'4px 6px', fontSize: 12, textAlign:'center' }} />
                  </div>
                  <button style={{ background:'none', border:'none', color:'var(--magenta)', cursor:'pointer', fontSize: 14 }}>✕</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="card" style={{ padding: 16, marginBottom: 14 }}>
              <div className="label" style={{ fontSize: 11, color:'var(--muted)', marginBottom: 12 }}>Round Summary</div>
              <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span className="label" style={{ fontSize: 11, color:'var(--muted)' }}>Questions</span>
                  <span className="num" style={{ color:'var(--yellow)', fontSize: 22 }}>8</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span className="label" style={{ fontSize: 11, color:'var(--muted)' }}>Total Points</span>
                  <span className="num" style={{ color:'var(--yellow)', fontSize: 22 }}>8,600</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span className="label" style={{ fontSize: 11, color:'var(--muted)' }}>Est. Time</span>
                  <span className="num" style={{ color:'var(--cyan)', fontSize: 22 }}>~14 min</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span className="label" style={{ fontSize: 11, color:'var(--muted)' }}>Banks Used</span>
                  <span className="num" style={{ color:'var(--orange)', fontSize: 22 }}>3</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 16 }}>
              <div className="label" style={{ fontSize: 11, color:'var(--muted)', marginBottom: 10 }}>Bank Picker</div>
              <input className="input" placeholder="Search banks..." style={{ marginBottom: 10 }} />
              <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
                {['Science Pack v2','Pop Culture Pack','Sports Trivia','Geography Mega','Lightning Round'].map((b, i) => (
                  <div key={b} style={{
                    display:'flex', alignItems:'center', gap: 10,
                    padding:'8px 10px', background:'var(--panel)', border:'2px solid #000', borderRadius: 3,
                    cursor:'pointer'
                  }}>
                    <div className="display" style={{ fontSize: 12, flex: 1 }}>{b}</div>
                    <div className="label" style={{ fontSize: 9, color:'var(--muted)' }}>{[84,122,56,96,40][i]} Q</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// H9 — End Game (host)
// ============================================================
function H9HostEndGame() {
  const top3 = [
    { rank: 1, name: 'Tiny Tina', tag: 'SOLO', score: 7840, correct: 7, avg: '4.1s', color: 'yellow' },
    { rank: 2, name: 'The Mitochondrias', tag: 'TEAM · 4', score: 7210, correct: 6, avg: '4.6s', color: 'cyan' },
    { rank: 3, name: 'Lilith', tag: 'SOLO', score: 6580, correct: 6, avg: '5.2s', color: 'orange' },
  ];
  const rest = [
    { rank: 4, name: 'Sirens', tag: 'TEAM · 3', score: 5420, correct: 5, avg: '5.8s' },
    { rank: 5, name: 'Mordecai', tag: 'SOLO', score: 4880, correct: 5, avg: '6.2s' },
    { rank: 6, name: 'Crimson Lance', tag: 'TEAM · 2', score: 4310, correct: 4, avg: '6.5s' },
    { rank: 7, name: 'Roland', tag: 'SOLO', score: 3920, correct: 4, avg: '7.1s' },
    { rank: 8, name: 'Claptrap', tag: 'SOLO', score: 2840, correct: 3, avg: '8.4s' },
    { rank: 9, name: 'Maya', tag: 'TEAM · 3', score: 2640, correct: 3, avg: '9.1s' },
    { rank: 10, name: 'Wilhelm', tag: 'SOLO', score: 1820, correct: 2, avg: '10.2s' },
  ];
  return (
    <div className="host-shell">
      <div className="halftone-bg" />
      <SidebarNav active="games" />
      <div className="main">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 18 }}>
          <div>
            <div className="pill pill-magenta" style={{ marginBottom: 8 }}>● Game Complete</div>
            <div className="display" style={{ fontSize: 36, color:'var(--yellow)', textShadow:'4px 4px 0 #000', lineHeight: 1 }}>
              Friday Night Trivia
            </div>
            <div className="body" style={{ color:'var(--muted)', marginTop: 6 }}>
              Apr 30 · 4 rounds · 32 questions · 14 players · ran 47 minutes
            </div>
          </div>
          <div style={{ display:'flex', gap: 10 }}>
            <button className="btn btn-ghost">Export Results</button>
            <button className="btn btn-cyan">Back to Dashboard</button>
            <button className="btn btn-primary">Start New Game →</button>
          </div>
        </div>

        {/* Podium */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr 1fr', gap: 12, alignItems:'end', marginBottom: 18 }}>
          {[top3[1], top3[0], top3[2]].map((p) => {
            const isFirst = p.rank === 1;
            const colorMap = { yellow: 'var(--yellow)', cyan: 'var(--cyan)', orange: 'var(--orange)' };
            const color = colorMap[p.color];
            return (
              <div key={p.rank} className="card-deep">
                <div className="card" style={{
                  padding: 18,
                  background: isFirst ? 'rgba(245,200,0,0.07)' : 'var(--card)',
                  borderColor: color, borderWidth: 3,
                  minHeight: isFirst ? 220 : 180,
                  position:'relative',
                  textAlign:'center',
                }}>
                  <div style={{
                    position:'absolute', top: -16, left: '50%', transform:'translateX(-50%)',
                    background: color, color:'#000',
                    border:'2.5px solid #000', borderRadius: 2,
                    width: 36, height: 36,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'Rajdhani', fontWeight:700, fontSize: 18,
                    boxShadow:'2px 2px 0 #000'
                  }}>{p.rank}</div>
                  {isFirst && <div className="label" style={{ fontSize: 11, color: color, marginTop: 8 }}>★ Winner</div>}
                  <div className={`avatar lg ${p.color}`} style={{
                    margin:'14px auto 8px', width: isFirst ? 70 : 54, height: isFirst ? 70 : 54, fontSize: isFirst ? 26 : 20
                  }}>{p.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
                  <div className="display" style={{ fontSize: isFirst ? 20 : 16 }}>{p.name}</div>
                  <div className="label" style={{ fontSize: 10, color:'var(--muted)', marginTop: 2 }}>{p.tag}</div>
                  <div className="num" style={{ fontSize: isFirst ? 36 : 26, color, marginTop: 8 }}>{p.score.toLocaleString()}</div>
                  <div style={{ display:'flex', justifyContent:'center', gap: 10, marginTop: 10 }}>
                    <div className="pill pill-dark" style={{ fontSize: 9 }}>{p.correct}/8 correct</div>
                    <div className="pill pill-dark" style={{ fontSize: 9 }}>{p.avg} avg</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full table */}
        <div className="card" style={{ padding: 0, overflow:'hidden' }}>
          <div style={{ padding:'12px 16px', borderBottom:'2px solid #000', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div className="display" style={{ fontSize: 16 }}>Final Standings</div>
            <div style={{ display:'flex', gap: 8 }}>
              <div className="pill pill-cyan" style={{ fontSize: 9 }}>Avg score 4,738</div>
              <div className="pill" style={{ fontSize: 9 }}>72% correct rate</div>
            </div>
          </div>
          <table className="tbl">
            <thead><tr>
              <th style={{ width: 50 }}>Rank</th><th>Player / Team</th><th style={{ width: 80 }}>Mode</th>
              <th style={{ width: 80 }}>Correct</th><th style={{ width: 110 }}>Avg Response</th><th style={{ width: 100 }}>Score</th>
            </tr></thead>
            <tbody>
              {rest.map(p => (
                <tr key={p.rank}>
                  <td><span className="num" style={{ color:'var(--muted)' }}>#{p.rank}</span></td>
                  <td style={{ display:'flex', alignItems:'center', gap: 8 }}>
                    <div className="avatar sm">{p.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                  </td>
                  <td><span className="label" style={{ fontSize: 10, color: p.tag === 'SOLO' ? 'var(--cyan)' : 'var(--muted)' }}>{p.tag}</span></td>
                  <td><span className="num" style={{ color:'var(--green)' }}>{p.correct} / 8</span></td>
                  <td>{p.avg}</td>
                  <td><span className="num" style={{ color:'var(--yellow)', fontSize: 16 }}>{p.score.toLocaleString()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  H1Dashboard, H2CreateGame, H3HostLobby, H4HostLive,
  H5HostReveal, H6BankManager, H7ImportModal, H8RoundBuilder, H9HostEndGame
});
