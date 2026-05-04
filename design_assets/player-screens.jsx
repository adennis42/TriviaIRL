/* global React */
const { useState } = React;

// ============================================================
// Shared atoms
// ============================================================
const Logo = ({ size = 22 }) => (
  <span className="logo-wm" style={{ fontSize: size }}>
    <span className="y">Trivia</span><span className="c">IRL</span>
  </span>
);

const Halftone = () => (
  <div style={{
    position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(circle, #ffffff07 1px, transparent 1px)',
    backgroundSize: '6px 6px',
    pointerEvents: 'none', zIndex: 1
  }} />
);

const PhoneFrame = ({ children }) => (
  <div className="phone">
    <div className="phone-notch" />
    <div className="phone-inner">{children}</div>
  </div>
);

// ============================================================
// P1 — Join Screen (two states: empty + filled)
// ============================================================
function P1Join({ filled = false }) {
  const digits = filled ? ['8','4','7','2','9','1'] : ['','','','','',''];
  return (
    <PhoneFrame>
      <div style={{ display:'flex', justifyContent:'center', marginBottom: 38, marginTop: 18 }}>
        <Logo size={28} />
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="label" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14, textAlign: 'center' }}>
          Enter Game Code
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', gap: 6 }}>
          {digits.map((d, i) => (
            <div key={i} style={{
              flex: 1, aspectRatio: '1',
              background: '#0d0d0d',
              border: '2.5px solid #000',
              borderRadius: 4,
              boxShadow: '3px 3px 0 #000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 32,
              color: 'var(--yellow)',
              ...(i === (filled ? 5 : 0) && !filled ? { borderColor: 'var(--cyan)', boxShadow: '0 0 0 2px rgba(0,229,255,.25), 3px 3px 0 #000' } : {})
            }}>
              {d || (i === 0 && !filled ? <span style={{ width:2, height:28, background:'var(--cyan)', animation:'tirl-pulse 1s infinite' }} /> : '')}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <div className="tag-outline" style={{ marginBottom: 14, display: 'inline-flex' }}>
          <span style={{ width:6, height:6, background:'var(--cyan)' }} /> Live Game
        </div>
        <button className={`btn btn-block ${filled ? 'btn-primary' : 'btn-disabled'}`}>
          {filled ? 'Join Game →' : 'Enter 6 Digits'}
        </button>
        <div className="body" style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12, marginTop: 14, letterSpacing: '0.04em' }}>
          No account needed · No app to download
        </div>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="label" style={{ fontSize: 10, color: 'var(--muted-2)' }}>v1.0 · Cardstock Edition</div>
        <div style={{ display:'flex', gap: 4 }}>
          <span style={{ width:8, height:8, background:'var(--yellow)', border:'1.5px solid #000' }} />
          <span style={{ width:8, height:8, background:'var(--orange)', border:'1.5px solid #000' }} />
          <span style={{ width:8, height:8, background:'var(--cyan)', border:'1.5px solid #000' }} />
          <span style={{ width:8, height:8, background:'var(--magenta)', border:'1.5px solid #000' }} />
        </div>
      </div>
    </PhoneFrame>
  );
}

// ============================================================
// P2 — Name + Mode Selection
// ============================================================
function P2NameMode() {
  const [mode, setMode] = useState('team');
  const [name, setName] = useState('Vault Hunter');
  const [team, setTeam] = useState('The Mitochondrias');

  return (
    <PhoneFrame>
      <div style={{ textAlign:'center', marginBottom: 16 }}>
        <Logo size={20} />
        <div className="display" style={{ fontSize: 22, color: 'var(--text)', marginTop: 14, lineHeight: 1.1 }}>
          Friday Night Trivia
        </div>
        <div className="label" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
          <span style={{ color: 'var(--cyan)' }}>● </span>14 players waiting · code 847291
        </div>
      </div>

      <div className="divider" style={{ marginBottom: 18 }} />

      <div style={{ marginBottom: 14 }}>
        <div className="label" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Display Name</div>
        <input className="input focused" value={name} onChange={e=>setName(e.target.value)} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <div className="label" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Play As</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          {['solo','team'].map(m => (
            <button key={m} onClick={()=>setMode(m)} style={{
              background: mode === m ? 'rgba(0,229,255,0.08)' : 'var(--card)',
              border: mode === m ? '2.5px solid var(--cyan)' : '2.5px solid #000',
              boxShadow: mode === m ? '4px 4px 0 var(--cyan)' : '4px 4px 0 #000',
              borderRadius: 4,
              padding: '14px 10px',
              cursor: 'pointer',
              textAlign: 'left',
            }}>
              <div style={{
                width: 30, height: 30, marginBottom: 8,
                background: mode === m ? 'var(--cyan)' : 'var(--dark)',
                border: '2px solid #000', borderRadius: 3,
                display:'flex', alignItems:'center', justifyContent:'center',
                color: mode === m ? '#000' : 'var(--text)',
                fontFamily:'Rajdhani', fontWeight:700, fontSize: 14
              }}>
                {m === 'solo' ? '◉' : '⋮⋮'}
              </div>
              <div className="display" style={{ fontSize: 16, color: mode === m ? 'var(--cyan)' : 'var(--text)' }}>
                {m === 'solo' ? 'Solo' : 'Team'}
              </div>
              <div className="body" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, textTransform:'none', letterSpacing: 0 }}>
                {m === 'solo' ? 'Play alone' : 'Squad up'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {mode === 'team' && (
        <div style={{ marginBottom: 14 }}>
          <div className="label" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Team Name</div>
          <input className="input" value={team} onChange={e=>setTeam(e.target.value)} />
          <div className="body" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, fontStyle:'italic' }}>
            Type to join an existing team or create a new one
          </div>
        </div>
      )}

      <button className="btn btn-primary btn-block" style={{ marginTop: 'auto' }}>
        Join the Game →
      </button>
    </PhoneFrame>
  );
}

// ============================================================
// P3 — Lobby
// ============================================================
function P3Lobby() {
  const players = [
    { name: 'Vault Hunter', tag: 'The Mitochondrias', color: 'orange', me: true },
    { name: 'Tiny Tina', tag: 'SOLO', color: 'cyan' },
    { name: 'Zer0', tag: 'The Mitochondrias', color: 'orange' },
    { name: 'Lilith', tag: 'Sirens', color: 'magenta' },
    { name: 'Mordecai', tag: 'SOLO', color: 'cyan' },
    { name: 'Roland', tag: 'Crimson Lance', color: 'yellow' },
    { name: 'Claptrap', tag: 'SOLO', color: 'cyan' },
    { name: 'Maya', tag: 'Sirens', color: 'magenta' },
    { name: 'Axton', tag: 'Crimson Lance', color: 'yellow' },
  ];

  return (
    <PhoneFrame>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 12 }}>
        <Logo size={18} />
        <div className="pill pill-cyan">● Connected</div>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 14, background: 'var(--panel)' }}>
        <div className="label" style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>Game Code</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div className="display" style={{ fontSize: 32, color: 'var(--yellow)', letterSpacing: '0.18em' }}>847 291</div>
          <button className="btn-ghost btn" style={{ padding:'8px 12px', fontSize: 11 }}>Copy</button>
        </div>
      </div>

      <div className="card" style={{ padding: 12, marginBottom: 14, display:'flex', alignItems:'center', gap: 10 }}>
        <div className="avatar lg" style={{ background: 'var(--orange)' }}>VH</div>
        <div style={{ flex: 1 }}>
          <div className="display" style={{ fontSize: 16 }}>Vault Hunter</div>
          <div className="label" style={{ fontSize: 10, color: 'var(--cyan)' }}>Team · The Mitochondrias</div>
        </div>
        <div className="pill pill-cyan" style={{ fontSize: 10 }}>You</div>
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8 }}>
        <div className="label" style={{ fontSize: 11, color: 'var(--muted)' }}>In the Lobby</div>
        <div className="label" style={{ fontSize: 11, color: 'var(--yellow)' }}>14 players</div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
          {players.map((p, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap: 10,
              background: p.me ? 'rgba(0,229,255,0.06)' : 'var(--card)',
              border: p.me ? '2px solid var(--cyan)' : '2px solid #000',
              borderRadius: 3,
              padding: '8px 10px',
            }}>
              <div className={`avatar sm ${p.color}`}>{p.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
              <div className="body" style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{p.name}</div>
              <div className="label" style={{ fontSize: 9, color: p.tag === 'SOLO' ? 'var(--cyan)' : 'var(--muted)' }}>{p.tag}</div>
            </div>
          ))}
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height: 30,
          background: 'linear-gradient(transparent, var(--black))' }} />
      </div>

      <div style={{ marginTop: 10, padding: 10, border: '2px dashed #2a2a2a', borderRadius: 3 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <span className="pulse-dot" />
          <div className="display" style={{ fontSize: 13 }}>Waiting for host to start...</div>
        </div>
        <div className="body" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, fontStyle:'italic' }}>
          Get ready — first question drops any second.
        </div>
      </div>
    </PhoneFrame>
  );
}

// ============================================================
// P4 — Question Screen
// ============================================================
function P4Question({ selectedDefault = null }) {
  const [selected, setSelected] = useState(selectedDefault);
  const answers = [
    { letter: 'A', text: 'The Endoplasmic Reticulum' },
    { letter: 'B', text: 'The Mitochondria' },
    { letter: 'C', text: 'The Golgi Apparatus' },
    { letter: 'D', text: 'The Ribosome' },
  ];
  const timer = 14;
  const danger = timer <= 8;

  return (
    <PhoneFrame>
      {/* status row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10 }}>
        <Logo size={16} />
        <div className="pill" style={{ fontSize: 10 }}>Round 2 · Science</div>
        <div className="display" style={{ fontSize: 13, color: 'var(--muted)' }}>3 / 8</div>
      </div>

      {/* player bar */}
      <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 10 }}>
        <div className="avatar sm">VH</div>
        <div className="display" style={{ fontSize: 12, flex: 1 }}>Vault Hunter</div>
        <div className="pill"><span className="num">2,840</span><span style={{ fontSize: 9 }}>PTS</span></div>
      </div>

      {/* timer */}
      <div className="card" style={{ padding: 10, marginBottom: 10 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6 }}>
          <div className="label" style={{ fontSize: 10, color: 'var(--muted)' }}>Time Left</div>
          <div className="num" style={{ fontSize: 28, color: danger ? 'var(--magenta)' : 'var(--yellow)' }}>{timer}s</div>
        </div>
        <div className="progress"><div className="fill" style={{ width: '46%', background: danger ? 'var(--magenta)' : 'var(--yellow)' }} /></div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 6 }}>
          <div className="pill pill-dark" style={{ fontSize: 10 }}>● Up to 1000 pts</div>
          <div className="label" style={{ fontSize: 9, color: 'var(--muted)' }}>Faster = More</div>
        </div>
      </div>

      {/* question card */}
      <div className="card-deep" style={{ marginBottom: 10 }}>
        <div className="card" style={{ padding: 14, border:'3px solid #000' }}>
          <div className="tag-outline" style={{ marginBottom: 8 }}>Cell Biology</div>
          <div className="display" style={{ fontSize: 17, lineHeight: 1.15, color: 'var(--text)', textWrap:'balance' }}>
            Which organelle is known as the powerhouse of the cell?
          </div>
        </div>
      </div>

      {/* answers */}
      <div style={{ display:'flex', flexDirection:'column', gap: 7, marginBottom: 10 }}>
        {answers.map(a => {
          const sel = selected === a.letter;
          return (
            <button key={a.letter} onClick={()=>setSelected(a.letter)} style={{
              display:'flex', alignItems:'center', gap: 10,
              background: sel ? 'rgba(0,229,255,0.1)' : 'var(--card)',
              border: sel ? '2.5px solid var(--cyan)' : '2.5px solid #000',
              borderRadius: 3,
              boxShadow: sel ? '3px 3px 0 var(--cyan)' : '3px 3px 0 #000',
              padding: '8px 10px',
              cursor: 'pointer',
              textAlign:'left',
            }}>
              <span className={`ltile ${sel ? 'cyan' : ''}`}>{a.letter}</span>
              <span className="body" style={{ flex: 1, fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{a.text}</span>
            </button>
          );
        })}
      </div>

      <button className={`btn btn-block ${selected ? 'btn-primary' : 'btn-disabled'}`} style={{ marginTop:'auto' }}>
        {selected ? 'Lock It In →' : 'Pick an Answer'}
      </button>
    </PhoneFrame>
  );
}

// ============================================================
// P5 — Locked / Waiting
// ============================================================
function P5Locked() {
  return (
    <PhoneFrame>
      {/* dimmed background */}
      <div style={{ opacity: 0.25, pointerEvents:'none' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10 }}>
          <Logo size={16} />
          <div className="pill" style={{ fontSize: 10 }}>Round 2</div>
          <div className="display" style={{ fontSize: 13 }}>3 / 8</div>
        </div>
        <div className="card" style={{ padding: 14, marginBottom: 10 }}>
          <div className="display" style={{ fontSize: 17, lineHeight: 1.15 }}>
            Which organelle is known as the powerhouse of the cell?
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
          {['A','B','C','D'].map(l => (
            <div key={l} style={{ height: 38, background:'var(--card)', border:'2.5px solid #000', borderRadius: 3 }} />
          ))}
        </div>
      </div>

      {/* overlay */}
      <div style={{
        position:'absolute', inset: 0,
        background: 'rgba(10,10,10,0.85)',
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex: 5,
      }}>
        <div className="card-deep" style={{ width: '88%' }}>
          <div className="card" style={{ padding: 22, textAlign:'center', background:'var(--card-2)' }}>
            <div style={{
              width: 60, height: 60,
              background: 'var(--cyan)',
              border: '3px solid #000',
              borderRadius: 4,
              boxShadow: '3px 3px 0 #000',
              display: 'inline-flex', alignItems:'center', justifyContent:'center',
              fontSize: 32, color: '#000', fontWeight: 900,
              marginBottom: 14,
            }}>✓</div>
            <div className="display" style={{ fontSize: 28, color: 'var(--cyan)' }}>Locked In</div>
            <div className="label" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 8 }}>You answered</div>
            <div className="display" style={{ fontSize: 18, color: 'var(--text)', marginTop: 2 }}>
              B · The Mitochondria
            </div>
            <div className="divider" style={{ margin: '16px 0' }} />
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap: 8 }}>
              <span className="pulse-dot" />
              <div className="label" style={{ fontSize: 11, color: 'var(--muted)' }}>Waiting for host to reveal...</div>
            </div>
            <div className="body" style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 10, fontStyle:'italic' }}>
              Locked in 4.2s · 9 of 14 answered
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ============================================================
// P6 — Reveal (correct + wrong variants)
// ============================================================
function P6Reveal({ correct = true }) {
  const answers = [
    { letter:'A', text:'The Endoplasmic Reticulum', state:'idle' },
    { letter:'B', text:'The Mitochondria', state: correct ? 'correct-mine' : 'mine-wrong' },
    { letter:'C', text:'The Golgi Apparatus', state:'idle' },
    { letter:'D', text:'The Ribosome', state:'idle' },
  ];
  if (!correct) {
    answers[1] = { letter:'B', text:'The Mitochondria', state:'correct' }; // actual correct
    answers[2] = { letter:'C', text:'The Golgi Apparatus', state:'mine-wrong' }; // user picked C
  }

  return (
    <PhoneFrame>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10 }}>
        <Logo size={16} />
        <div className="pill" style={{ fontSize: 10 }}>Round 2</div>
        <div className="display" style={{ fontSize: 13, color:'var(--muted)' }}>3 / 8</div>
      </div>

      <div className="card-deep" style={{ marginBottom: 12 }}>
        <div className="card" style={{
          padding: 18, textAlign:'center',
          background: correct ? 'rgba(74,222,128,0.08)' : 'rgba(255,45,120,0.08)',
          borderColor: correct ? 'var(--green)' : 'var(--magenta)',
          borderWidth: '3px'
        }}>
          <div className="label" style={{ fontSize: 11, color: 'var(--muted)' }}>Result</div>
          <div className="display" style={{
            fontSize: 36, marginTop: 4,
            color: correct ? 'var(--green)' : 'var(--magenta)',
          }}>
            {correct ? 'Correct!' : 'Incorrect'}
          </div>
          <div className="num" style={{
            fontSize: 44, marginTop: 8,
            color: correct ? 'var(--yellow)' : 'var(--muted)',
          }}>
            {correct ? '+840' : '+0'} <span style={{ fontSize: 18 }}>PTS</span>
          </div>
          {correct && (
            <div style={{ display:'flex', justifyContent:'center', gap: 10, marginTop: 10 }}>
              <div className="pill pill-cyan" style={{ fontSize: 10 }}>● Answered in 6s</div>
              <div className="pill pill-dark" style={{ fontSize: 10 }}>3rd fastest</div>
            </div>
          )}
        </div>
      </div>

      <div className="label" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>The Question</div>
      <div className="body" style={{ fontSize: 14, marginBottom: 12, fontWeight: 500, lineHeight: 1.25 }}>
        Which organelle is known as the powerhouse of the cell?
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap: 7, marginBottom: 12 }}>
        {answers.map(a => {
          let bg = 'var(--card)', border = '2.5px solid #000', tile = '', icon = null, color = 'var(--text)';
          if (a.state === 'correct' || a.state === 'correct-mine') {
            bg = 'rgba(74,222,128,0.18)'; border = '2.5px solid var(--green)'; tile = 'green';
            icon = '✓';
          }
          if (a.state === 'mine-wrong') {
            bg = 'rgba(255,45,120,0.15)'; border = '2.5px solid var(--magenta)'; tile = 'magenta';
            icon = '✕';
          }
          return (
            <div key={a.letter} style={{
              display:'flex', alignItems:'center', gap: 10,
              background: bg, border, borderRadius: 3,
              boxShadow: '3px 3px 0 #000',
              padding: '8px 10px',
            }}>
              <span className={`ltile ${tile}`}>{a.letter}</span>
              <span className="body" style={{ flex: 1, fontWeight: 600, fontSize: 13, color }}>{a.text}</span>
              {icon && <span style={{
                width: 22, height: 22, borderRadius: 3,
                background: a.state === 'mine-wrong' ? 'var(--magenta)' : 'var(--green)',
                border: '2px solid #000',
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                color: '#000', fontWeight: 900, fontSize: 12,
              }}>{icon}</span>}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', padding: 10, background:'var(--panel)', border:'2px solid #000', borderRadius: 3, display:'flex', alignItems:'center', gap: 8 }}>
        <span className="pulse-dot" />
        <div className="label" style={{ fontSize: 11, color: 'var(--muted)' }}>Leaderboard pushing in 3s...</div>
      </div>
    </PhoneFrame>
  );
}

// ============================================================
// P7 — Leaderboard
// ============================================================
function P7Leaderboard() {
  const top3 = [
    { rank: 1, name: 'Tiny Tina', tag: 'SOLO', score: 6840, color: 'yellow' },
    { rank: 2, name: 'The Mitochondrias', tag: 'TEAM · 4', score: 6210, color: 'cyan', me: true },
    { rank: 3, name: 'Lilith', tag: 'SOLO', score: 5980, color: 'orange' },
  ];
  const rest = [
    { rank: 4, name: 'Sirens', tag: 'TEAM · 3', score: 5420 },
    { rank: 5, name: 'Mordecai', tag: 'SOLO', score: 4880 },
    { rank: 6, name: 'Crimson Lance', tag: 'TEAM · 2', score: 4310 },
    { rank: 7, name: 'Roland', tag: 'SOLO', score: 3920 },
    { rank: 8, name: 'Claptrap', tag: 'SOLO', score: 2840 },
  ];
  return (
    <PhoneFrame>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10 }}>
        <Logo size={16} />
        <div className="pill pill-dark" style={{ fontSize: 10 }}>After Round 2</div>
      </div>

      <div className="display" style={{ fontSize: 26, color:'var(--yellow)', textAlign:'center', textShadow: '3px 3px 0 #000', marginBottom: 14 }}>
        Leaderboard
      </div>

      {/* Podium row */}
      <div style={{ display:'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 6, alignItems:'end', marginBottom: 14 }}>
        {[top3[1], top3[0], top3[2]].map((p, i) => {
          const isFirst = p.rank === 1;
          const colorMap = { yellow: 'var(--yellow)', cyan: 'var(--cyan)', orange: 'var(--orange)' };
          return (
            <div key={p.rank} style={{
              background: 'var(--card)',
              border: '2.5px solid #000',
              borderRadius: 3,
              boxShadow: '3px 3px 0 #000',
              padding: 8,
              textAlign:'center',
              minHeight: isFirst ? 130 : 110,
              position:'relative'
            }}>
              <div style={{
                position:'absolute', top: -12, left: '50%', transform:'translateX(-50%)',
                background: colorMap[p.color], color: '#000',
                border: '2px solid #000', borderRadius: 2,
                width: 26, height: 26,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'Rajdhani', fontWeight:700, fontSize: 14,
                boxShadow:'2px 2px 0 #000'
              }}>{p.rank}</div>
              <div className={`avatar lg ${p.color}`} style={{ margin:'14px auto 6px', width: isFirst ? 50 : 40, height: isFirst ? 50 : 40 }}>
                {p.name.split(' ').map(s=>s[0]).slice(0,2).join('')}
              </div>
              <div className="display" style={{ fontSize: 11, lineHeight: 1.1, marginTop: 4 }}>{p.name}</div>
              <div className="label" style={{ fontSize: 8, color: 'var(--muted)', marginTop: 2 }}>{p.tag}</div>
              <div className="num" style={{ fontSize: 18, color: colorMap[p.color], marginTop: 4 }}>{p.score.toLocaleString()}</div>
            </div>
          );
        })}
      </div>

      {/* List */}
      <div style={{ display:'flex', flexDirection:'column', gap: 4, flex: 1, overflow:'hidden' }}>
        {rest.map(p => {
          const me = p.rank === 6 ? false : false;
          return (
            <div key={p.rank} style={{
              display:'flex', alignItems:'center', gap: 8,
              background: 'var(--card)',
              border: '2px solid #000', borderRadius: 3,
              padding: '6px 8px',
            }}>
              <div className="num" style={{ width: 22, fontSize: 14, color:'var(--muted)' }}>#{p.rank}</div>
              <div className="avatar sm">{p.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
              <div className="body" style={{ flex: 1, fontWeight:600, fontSize: 12 }}>{p.name}</div>
              <div className="label" style={{ fontSize: 8, color:'var(--muted)' }}>{p.tag}</div>
              <div className="num" style={{ fontSize: 14, color:'var(--yellow)' }}>{p.score.toLocaleString()}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 10, padding: 10, background:'var(--panel)', border:'2px dashed #2a2a2a', borderRadius: 3, display:'flex', alignItems:'center', gap: 8 }}>
        <span className="pulse-dot" />
        <div className="label" style={{ fontSize: 11, color:'var(--muted)' }}>Next question in 8s...</div>
      </div>
    </PhoneFrame>
  );
}

// ============================================================
// P8 — Game Over
// ============================================================
function P8GameOver() {
  return (
    <PhoneFrame>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10 }}>
        <Logo size={16} />
        <div className="pill pill-magenta" style={{ fontSize: 10 }}>Final · 8/8</div>
      </div>

      <div style={{ textAlign:'center', marginTop: 6, marginBottom: 14 }}>
        <div className="label" style={{ fontSize: 11, color:'var(--muted)' }}>Friday Night Trivia</div>
        <div className="display" style={{ fontSize: 38, color:'var(--yellow)', textShadow:'4px 4px 0 #000', lineHeight: 0.95, marginTop: 4 }}>Game Over</div>
      </div>

      {/* Winner callout */}
      <div className="card-deep" style={{ marginBottom: 14 }}>
        <div className="card" style={{ padding: 14, background:'var(--card-2)', borderColor:'var(--yellow)', borderWidth: 3 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div className="label" style={{ fontSize: 10, color:'var(--yellow)' }}>★ Winner</div>
            <div className="label" style={{ fontSize: 10, color:'var(--muted)' }}>Solo</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap: 10, marginTop: 8 }}>
            <div className="avatar lg yellow" style={{ width: 50, height: 50, fontSize: 20 }}>TT</div>
            <div style={{ flex: 1 }}>
              <div className="display" style={{ fontSize: 20 }}>Tiny Tina</div>
              <div className="num" style={{ fontSize: 28, color:'var(--yellow)', lineHeight: 1 }}>7,840 <span style={{ fontSize: 12 }}>PTS</span></div>
            </div>
          </div>
          <div style={{ display:'flex', gap: 6, marginTop: 8 }}>
            <div className="pill pill-cyan" style={{ fontSize: 9 }}>7/8 correct</div>
            <div className="pill pill-dark" style={{ fontSize: 9 }}>4.1s avg</div>
          </div>
        </div>
      </div>

      <div className="label" style={{ fontSize: 11, color:'var(--muted)', marginBottom: 6 }}>Final Standings</div>
      <div style={{ display:'flex', flexDirection:'column', gap: 4, flex: 1, overflow:'hidden' }}>
        {[
          { r: 2, n: 'The Mitochondrias', s: 7210, me: true },
          { r: 3, n: 'Lilith', s: 6580 },
          { r: 4, n: 'Sirens', s: 5420 },
          { r: 5, n: 'Mordecai', s: 4880 },
        ].map(p => (
          <div key={p.r} style={{
            display:'flex', alignItems:'center', gap: 8,
            background: p.me ? 'rgba(0,229,255,0.08)' : 'var(--card)',
            border: p.me ? '2px solid var(--cyan)' : '2px solid #000',
            borderRadius: 3,
            padding: '6px 8px',
          }}>
            <div className="num" style={{ width: 22, fontSize: 14, color:'var(--muted)' }}>#{p.r}</div>
            <div className="avatar sm">{p.n.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
            <div className="body" style={{ flex: 1, fontWeight:600, fontSize: 12 }}>{p.n}</div>
            {p.me && <div className="pill pill-cyan" style={{ fontSize: 8 }}>You</div>}
            <div className="num" style={{ fontSize: 14, color:'var(--yellow)' }}>{p.s.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, display:'flex', flexDirection:'column', gap: 8 }}>
        <button className="btn btn-primary btn-block">Play Again →</button>
        <button className="btn btn-cyan btn-block">Host Your Own</button>
      </div>

      <div className="body" style={{ fontSize: 10, color:'var(--muted)', textAlign:'center', marginTop: 10, fontStyle:'italic' }}>
        Thanks for playing TriviaIRL · Try <span style={{ color:'var(--cyan)' }}>BingoIRL</span> next
      </div>
    </PhoneFrame>
  );
}

// expose
Object.assign(window, { Logo, PhoneFrame, P1Join, P2NameMode, P3Lobby, P4Question, P5Locked, P6Reveal, P7Leaderboard, P8GameOver });
