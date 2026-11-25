import {useEffect,useMemo,useState} from 'react';
const MARKETS=[['R_10','Volatility 10'],['R_25','Volatility 25'],['R_50','Volatility 50'],['R_75','Volatility 75'],['R_100','Volatility 100']];
export default function App(){
 const [symbol,setSymbol]=useState('R_10'),[ticks,setTicks]=useState([]),[status,setStatus]=useState('Connecting'),[error,setError]=useState('');
 useEffect(()=>{setTicks([]);setError('');setStatus('Connecting');const scheme=location.protocol==='https:'?'wss':'ws';const ws=new WebSocket(`${scheme}://127.0.0.1:8000/ws/ticks/${symbol}`);
 ws.onopen=()=>setStatus('Connected');ws.onmessage=e=>{const d=JSON.parse(e.data);if(d.type==='error'){setError(d.message);setStatus('Error')}else if(d.type==='tick')setTicks(old=>[d,...old].slice(0,100))};
 ws.onerror=()=>{setError('Cannot reach backend. Check that FastAPI is running on port 8000.');setStatus('Connection error')};ws.onclose=()=>setStatus(s=>s==='Error'?s:'Disconnected');return()=>ws.close()},[symbol]);
 const counts=useMemo(()=>{const c=Array(10).fill(0);ticks.forEach(t=>c[t.digit]++);return c},[ticks]);
 const odd=ticks.filter(t=>t.digit%2).length,over=ticks.filter(t=>t.digit>5).length,under=ticks.filter(t=>t.digit<5).length;
 let streak='—';if(ticks.length){const first=ticks[0].odd_even;let n=0;for(const t of ticks){if(t.odd_even!==first)break;n++}streak=`${first} × ${n}`}
 return <main className="shell"><header><div className="brand">DIGITRON<small>QUANTITATIVE DIGIT INTELLIGENCE</small></div><div className="status">{status}</div></header>
 <section className="hero"><p>DERIV MARKET INTELLIGENCE</p><h1>Study every tick.<br/><em>Test every sequence.</em></h1><span>Live public tick observations and last-digit distribution. Research only — no trades are placed.</span></section>
 <section className="toolbar"><label>Market </label><select value={symbol} onChange={e=>setSymbol(e.target.value)}>{MARKETS.map(([v,l])=><option value={v} key={v}>{l} ({v})</option>)}</select><span>{ticks.length} / 100 ticks</span></section>
 {error&&<div className="error">{error} Check DERIV_APP_ID in the root .env file.</div>}
 <section className="metrics">{[['Ticks',ticks.length],['Odd',odd],['Even',ticks.length-odd],['Over 5',over],['Under 5',under],['Current streak',streak]].map(([l,v])=><div className="metric" key={l}><small>{l}</small><strong>{v}</strong></div>)}</section>
 <section className="panel"><h2>Last-digit distribution <small>Latest 100 ticks</small></h2><div className="digits">{counts.map((n,d)=><div className="digit" key={d}><div className="barbox"><i style={{height:`${n/Math.max(...counts,1)*100}%`}}/></div><b>{d}</b><small>{n}</small></div>)}</div></section>
 <section className="panel"><h2>Latest ticks</h2><div className="tablewrap"><table><thead><tr><th>Time</th><th>Quote</th><th>Digit</th><th>Parity</th><th>Over/Under 5</th></tr></thead><tbody>{ticks.slice(0,15).map((t,i)=><tr key={`${t.epoch}-${i}`}><td>{new Date(t.epoch*1000).toLocaleTimeString()}</td><td>{t.quote}</td><td>{t.digit}</td><td>{t.odd_even}</td><td>{t.over_under_5}</td></tr>)}{!ticks.length&&<tr><td colSpan="5">Waiting for ticks…</td></tr>}</tbody></table></div></section>
 <footer>DIGITRON v0.1.0 · Public market data · Research only. A streak is an observation, not a prediction.</footer></main>
}
