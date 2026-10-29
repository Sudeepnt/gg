/* Gattabara Games — all behaviour and editable content. See README.md for the map. */
/* Next's router patches window.history and re-renders the page on any URL change, which wipes the DOM this script built; use the browser's own methods */
const nativeHist={replaceState:(...a)=>History.prototype.replaceState.apply(history,a),pushState:(...a)=>History.prototype.pushState.apply(history,a)};
(function(){
/* the URL hash the page was opened with: setActiveW rewrites location.hash while the page settles, so read it first */
const HASH0=(location.hash||'').slice(1);let landing=!!HASH0;
/* editable site content (src/content/site-content.json, edited from /admingg). The arrays below are the fallback. */
const GGC=(()=>{try{return JSON.parse(document.getElementById('gg-content').textContent)}catch(e){return null}})();
/* a showreel is configured: keep the generated WebGL montage hidden (and idle) until the video is really playing */
if(GGC&&GGC.reels&&GGC.reels.main)document.body.classList.add('reelwait');
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(pointer:fine)').matches;
const S={get(k,d){try{const v=localStorage.getItem('ggj_'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('ggj_'+k,JSON.stringify(v))}catch(e){}}};
const ARW='<svg viewBox="0 0 14 14" fill="none" stroke="currentColor"><path d="M1 7h12M8 2l5 5-5 5"/></svg>';
const G={vote:.5,mx:0,my:0};

/* grain */
(function(){const c=document.createElement('canvas');c.width=c.height=140;const x=c.getContext('2d'),d=x.createImageData(140,140);for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0);$('#grain').style.backgroundImage=`url(${c.toDataURL()})`})();

/* smooth scroll */
let lenis=null;
if(window.Lenis&&!RM){try{lenis=new Lenis({lerp:.085,wheelMultiplier:.9});(function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(0)}catch(e){lenis=null}}
window.ggGo=id=>go(id);
function go(id){if(id==='pitch'||id==='contact'){setTab(id);id='contact'}const i=WINS.findIndex(w=>w.id===id);menu(false);if(i<0){const el=document.getElementById(id);el&&el.scrollIntoView();return}measure();const y=i===0?0:T[i]-HH;if(lenis)lenis.scrollTo(y,{duration:Math.min(2.4,.9+Math.abs(y-scrollY)/6000)});else scrollTo({top:y,behavior:RM?'auto':'smooth'})}
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href').slice(1);if(a.dataset.line)setType(a.dataset.line);if(document.getElementById(id)){e.preventDefault();if(dpOpen)closeDp(true);go(id)}});
let tT;function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(tT);tT=setTimeout(()=>e.classList.remove('show'),2300)}

/* split headings into characters */
$$('.split').forEach(el=>{const t=el.textContent;el.setAttribute('aria-label',t);let i=0;el.innerHTML=t.split(' ').map(w=>`<span class="wd" aria-hidden="true">${[...w].map(c=>`<span class="ch" style="--i:${i++}">${c}</span>`).join('')}</span>`).join(' ')});

/* ================= DATA ================= */
let GAMES=[
 {id:'pen-fight',t:'Pen Fight',code:'PEN-FIGHT',st:'In development',cat:'dev',catch:['The last bench','never forgets.'],spec:'Physics duel · Local + online',
  short:'The last-bench classic, rebuilt as a precision flick duel.',
  intro:'The last-bench classic, rebuilt as a precision flick duel. Read the angle, commit the flick, and knock your rival off the desk before the bell rings.',
  desc:['Every classroom had one: two pens, one desk and a duel decided by a single flick. Pen Fight turns that last-bench ritual into a precision physics game.','Read the angle, commit the flick and knock your rival off the desk before the bell rings. Every desk is an arena, and rulers, erasers and edges become terrain.','Pass the desk to a friend for a local duel, or take it online.'],
  tags:['Physics','Duel','Local multiplayer','Online','Arcade','Skill-based'],
  feat:[['Flick physics','Every flick is a read: angle, force and timing decide the duel.'],['Desk arenas','Every desk tells a story. Rulers, erasers and edges become terrain.'],['Local and online','Pass the desk to a friend, or take the duel online.']],
  tbl:[['Genre','Physics duel'],['Players','1–2, local and online'],['Platforms','To be announced'],['Release date','To be announced'],['Status','In development']],
  shots:['Opening flick','Desk-edge standoff','Ruler arena','The read','Clash','Bell rings']},
 {id:'auto-rush',t:'Auto Rush',code:'AUTO-RUSH',st:'In development',cat:'dev',catch:['Three wheels.','No brakes.'],spec:'Arcade racer · Single player',
  short:'Three wheels, no brakes, one meter running.',
  intro:'Three wheels, no brakes, one meter running. Thread a Bengaluru auto through gridlock, grab fares and own the city\'s back lanes.',
  desc:['Auto Rush puts you behind the handlebar of a Bengaluru auto-rickshaw, with the meter running and the city gridlocked.','Thread through traffic as gaps open and close in real time, pick up fares and chain them across the city to own its back lanes.','Between shifts, upgrade the engine, the horn and the attitude.'],
  tags:['Arcade','Racing','Single player','Traffic','Score attack'],
  feat:[['Traffic as terrain','Gridlock is the track. Gaps open and close in real time.'],['Fares and routes','Pick up, drop off, and chain fares across the city.'],['Tune your auto','Upgrade the engine, the horn and the attitude.']],
  tbl:[['Genre','Arcade racer'],['Players','1'],['Platforms','To be announced'],['Release date','To be announced'],['Status','In development']],
  shots:['Night shift','Gridlock gap','Fare pickup','Back lanes','Headlight run','Meter running']},
 {id:'classified-01',t:'Classified 01',code:'GG-IP-03',st:'Sealed',cat:'sealed',sealed:1,catch:['This file','is sealed.'],spec:'Flagship · Details withheld',short:'Our flagship. Details withheld until reveal day.',intro:'Our flagship. Title, genre and platform stay sealed until reveal day.',intel:'Built by our core team in Bengaluru. Our biggest world yet. First look goes to the insider list.',tags:['Flagship','Sealed']},
 {id:'classified-02',t:'Classified 02',code:'GG-IP-04',st:'Sealed',cat:'sealed',sealed:1,catch:['A comedy','with teeth.'],spec:'Original IP · Details withheld',short:'A comedy with teeth. That is all we are cleared to say.',intro:'A comedy with teeth. That is all we are cleared to say.',intel:'Systems-driven, darkly funny, and painfully familiar to anyone who has stood in a queue. Reveal date: sealed.',tags:['Original IP','Sealed']}];
let NEWS=[['2026.10.28','STUDIO','Our website has been renewed.','Thank you for visiting. Our new website brings our games, our services and our studio together in one place. We will keep it updated with news from the studio.'],
 ['2026.10.15','PRODUCTIONS','GG Productions is accepting new co-development briefs.','Studios looking for development, art or strategy support can reach GG Productions through the contact form. Choose "Production services".'],
 ['2026.09.30','GAMES','Pen Fight and Auto Rush are in active development.','Both titles are being built by our core team in Bengaluru. Further details will be shared here.'],
 ['2026.09.12','RECRUIT','We are expanding our global roster of specialists.','We are looking for combat designers, animators, 3D artists and engineers who sweat the frame. See Recruit for details.'],
 ['2026.08.20','GAMES','Two original titles have entered production.','Details remain sealed until reveal day. Join the insider list for first looks.'],
 ['2026.07.08','STUDIO','Our operating rules are now published.','Design thinking, cost consciousness, strict governance and discipline. Read them in Philosophy.']];
let SVC=[['Development','Concept to build: core systems, gameplay foundations, mechanics and level design. Rapid prototyping through full-cycle development, with long-term updates and live ops.',['Unity','Unreal','Roblox','Live ops']],['Art','Visual style discovery and world-building, then cohesive 2D and 3D art, animation and UI that serve the gameplay.',['2D & 3D','Animation','UI']],['Strategy & pre-production','IP ideation, concept validation, MVP planning for fundraising, design documents and production roadmaps.',['IP ideation','MVP plans','Roadmaps'],'Make the right game before you make the whole game.']];
let SK=[['Combat',96,'Hit-stop, frame data, readable telegraphs'],['Animation',94,'Keyframe and mocap cleanup, engine-ready'],['Direction',90,'Camera, staging and pacing'],['Dramatics',88,'Performance, timing and beats'],['Art',95,'Concept to final look'],['3D Modeling',91,'Clean topology, textures, LODs']];
let CREW=[['Aditya Kumar','CEO & Founding Partner','Runs the studio and its slate, from greenlight to launch.','GG-001'],['Utsav Shetty','Founding Partner & Advisor','Strategy, finance and business development.','GG-002'],['Vasu Bhatnagar','Partner, Game Services','Heads GG Productions and the contractor roster.','GG-003'],['Siddarth Pai','Advisor','Advises the founders on growth and the studio\'s next moves.','GG-A01']];
let JOBS=[['Combat Designer','Contract','Remote'],['3D Character Artist','Contract','Remote'],['Gameplay Engineer (Unity)','Full-time','Bengaluru'],['Animator','Contract','Remote / Bengaluru']];
let TYPES=[['production','Production services (GG Productions)'],['insider','Insider list (first looks)'],['career','Careers / roster'],['press','Press and media'],['other','Other inquiries']];
const SECS=[['news','News'],['philosophy','Philosophy'],['games','Games'],['business','Business'],['production','GG Productions'],['network','Network'],['message','Message'],['leadership','Leadership'],['clients','Clients'],['recruit','Recruit'],['pitch','Pitch us'],['contact','Contact']];
let CLIENTS=[{"n": "Nexon Games America", "logo": "https://pub-7744ab3205554c71b5119fde2cc046a8.r2.dev/applications/client-logos/1774423165417-79df150833611f3fd8a320b59b5fb55ee455642b_full.jpg"}, {"n": "Magadha Studios", "logo": "https://pub-7744ab3205554c71b5119fde2cc046a8.r2.dev/applications/client-logos/1774423169395-images.jpg"}, {"n": "Qila Games", "logo": "https://pub-7744ab3205554c71b5119fde2cc046a8.r2.dev/applications/client-logos/1774423173406-images.png"}, {"n": "Studio Cupcakes", "logo": "https://pub-7744ab3205554c71b5119fde2cc046a8.r2.dev/applications/client-logos/1774423176475-images-1.jpg"}, {"n": "Silvine Game Studios", "logo": "https://pub-7744ab3205554c71b5119fde2cc046a8.r2.dev/applications/client-logos/1774423183121-images-2.jpg"}, {"n": "BattleBucks", "logo": "https://pub-7744ab3205554c71b5119fde2cc046a8.r2.dev/applications/client-logos/1774423187281-images-3.jpg"}, {"n": "Singular Scheme", "logo": "https://pub-7744ab3205554c71b5119fde2cc046a8.r2.dev/applications/client-logos/1774423191955-unnamed.jpg"}]; /* drop a logo file URL into `logo` and it replaces the wordmark */
const PITCH_RULES=['A playable build beats a video. A video beats concept art.','Keep the deck focused and easy to scan. Put deep dives on systems and mechanics in a separate GDD.','We generally do not review pitches without a build or a proof of concept.','PC, console and mobile titles. AR/VR and mobile-first projects are welcome.'];
const PLATS=['PC','Console','Mobile','AR/VR'],STAGES=['Concept','Prototype','Vertical slice','Alpha','Beta','Live'],NEEDS=['Co-development','Co-ownership / funding','Production services','Publishing & marketing support'];
const GP=(GGC&&GGC.gamesPage)||{};
const HUDL=(GGC&&GGC.heroHud)||{};
const NCL=(GGC&&GGC.networkCall)||{};
const PL=(GGC&&GGC.pressKitLabels)||{};const pl=(k,d)=>PL[k]||d;
let PKSTUDIO={white:'/logos/gg-white.png',black:'/logos/gg-black.png'};
let PKCONTACT=[['Press','info@gattabaragames.com'],['Business','info@gattabaragames.com'],['Website','gattabaragames.com']];
let BOILER='Gattabara Games is a video game company and creative studio based in Bengaluru, India. It builds original IP, co-owns and co-develops worlds with independent creators, and offers development, art and strategy services to studios worldwide through GG Productions.';

/* ---- apply the editable content ---- */
if(GGC){const DEF=GAMES.slice();const arr=a=>Array.isArray(a)?a:[];
  if(arr(GGC.news).length||GGC.news)NEWS=arr(GGC.news).map(n=>[n.date||'',n.category||'',n.title||'',n.body||'']);
  if(GGC.games)GAMES=arr(GGC.games).map((g,k)=>{const d=DEF.find(x=>x.id===g.id)||{};const sealed=/seal/i.test(g.status||'');
    const shots=Array.isArray(g.screenshots)?g.screenshots:arr(g.screenshotCaptions).map(c=>({caption:c,image:''}));
    return {...d,id:g.id||('game-'+(k+1)),t:g.title||'Untitled',code:g.code||('GG-'+(k+1)),st:g.status||'In development',cat:sealed?'sealed':'dev',sealed:sealed?1:undefined,
      spec:g.cardCaption||'',short:g.shortDescription||'',intro:g.summary||g.shortDescription||'',desc:arr(g.description),tags:arr(g.tags),
      feat:arr(g.features).map(f=>[f.title||'',f.text||'']),shots:shots.map(x=>x.caption||''),shotImgs:shots.map(x=>x.image||''),trailer:g.trailer||'',trailerPoster:g.trailerPoster||'',logoBlack:g.logoBlack||'',logoWhite:g.logoWhite||'',promo:{main:g.promoMain||'',vertical:g.promoVertical||'',small:g.promoSmall||''},intel:g.sealedText||'',image:g.image||'',
      catch:d.catch||[g.title||'',''],fact:arr(g.factsheet).map(r=>[r.label||'',r.value||''])}});
  if(GGC.production){SVC=arr(GGC.production.services).map(v=>[v.title||'',v.description||'',arr(v.tags),v.quote||undefined].filter((x,i2)=>i2<3||x));
    SK=arr(GGC.production.specialties).map(v=>[v.name||'',Math.max(0,Math.min(100,+v.score||0)),v.description||''])}
  if(GGC.leadership)CREW=arr(GGC.leadership).map((c,k)=>[c.name||'',c.role||'',c.bio||'',c.id||('GG-'+String(k+1).padStart(3,'0')),c.photo||'']);
  if(GGC.jobs)JOBS=arr(GGC.jobs).map(j=>[j.role||'',j.type||'',j.location||'']);
  if(GGC.clients)CLIENTS=arr(GGC.clients).map(c=>({n:c.name||'',logo:c.logo||''}));
  /* text blocks that live in the page markup */
  const T=(sel,txt)=>{const e=document.querySelector(sel);if(e&&txt!=null)e.textContent=txt};
  const H=GGC.hero;if(H){const l=document.querySelectorAll('#kvcatch .l > span');if(l[0])l[0].textContent=H.line1||'';if(l[1])l[1].textContent=H.line2||'';T('.kv-sub',H.sub)}
  const P=GGC.philosophy;if(P){T('.mvv .mv:nth-child(1) .v',P.mission);T('.mvv .mv:nth-child(2) .v',P.vision);T('.mvv .mv:nth-child(3) .lead',P.valuesIntro);T('#doc',P.doc);
    const vb=document.querySelector('.vals');if(vb&&Array.isArray(P.values))vb.innerHTML=P.values.map((v,k)=>`<div class="val rv ${['','d1','d2','d3'][k%4]}"><span class="n">${String(k+1).padStart(2,'0')}</span><h3>${esc0(v.title)}</h3><p>${esc0(v.text)}</p></div>`).join('')}
  const Lt=GGC.letter;if(Lt){T('.msg .big',Lt.big);const body=document.getElementById('msgbody');
    if(body){const sg=body.querySelector('.sg');const ps=a=>arr(a).map(t=>`<p>${esc0(t)}</p>`).join('');
      body.innerHTML=`<p class="to">${esc0(Lt.to)}</p>${ps(Lt.before)}<ol class="pr">${arr(Lt.principles).map(x=>`<li><span><b>${esc0(x.title)}</b> ${esc0(x.text)}</span></li>`).join('')}</ol>${ps(Lt.after)}`;
      if(sg){const sp=sg.querySelector('span');if(sp)sp.innerHTML=`<b>${esc0(Lt.signature)}</b>${esc0(Lt.signatureLine)}`;body.appendChild(sg)}}}
  const C=GGC.contact;if(C){const f=document.querySelector('.fsm > div:first-child');if(f){const ps=f.querySelectorAll('p');if(ps[0])ps[0].textContent=C.tagline||'';if(ps[1])ps[1].innerHTML=`${esc0(C.company)}<br>${esc0(C.address)}<br>${esc0(C.email)}`}
    const m=document.getElementById('mail');if(m)m.textContent=C.email||''}
  if(GGC.pressKit){if(GGC.pressKit.about)BOILER=GGC.pressKit.about;if(GGC.pressKit.studioLogo)PKSTUDIO.white=GGC.pressKit.studioLogo;if(GGC.pressKit.studioLogoBlack)PKSTUDIO.black=GGC.pressKit.studioLogoBlack;if(Array.isArray(GGC.pressKit.contact))PKCONTACT=GGC.pressKit.contact.map(r=>[r.label||'',r.value||''])}
  /* footer press-kit shortcuts follow the games list */
  const fk=[...document.querySelectorAll('.fsm [data-open]')];if(fk.length){const anchor=fk[0].previousElementSibling;fk.forEach(x=>x.remove());
    GAMES.slice().reverse().forEach((g,r)=>{if(g.sealed)return;const k=GAMES.length-1-r;const bt=document.createElement('button');bt.type='button';bt.dataset.open=k;bt.textContent=pl('pressKitWord','Press kit')+' \u00b7 '+g.t;anchor.after(bt)})}}
const factOf=(g,l)=>((g.fact||[]).find(r=>String(r[0]).toLowerCase()===l.toLowerCase())||[])[1]||'';
function esc0(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}

/* full menu */
$('#fmlist').innerHTML=SECS.map((s,i)=>`<li><a href="#${s[0]}"><span class="n">${String(i+1).padStart(2,'0')}</span><b>${s[1]}</b></a></li>`).join('');
function menu(o){$('#fm').classList.toggle('open',o);$('#mbtn').setAttribute('aria-expanded',o);if(lenis){o?lenis.stop():lenis.start()}}
$('#mbtn').onclick=()=>menu(!$('#fm').classList.contains('open'));

/* ================= HALFTONE KEY VISUAL (WebGL) ================= */
const FS=`precision highp float;
uniform vec2 uR;uniform float uT,uA,uB,uMix,uDot,uCx,uCy,uSc,uGl,uTile,uFl;uniform vec2 uM;uniform vec4 uIds;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float sdBox(vec2 p,vec2 b){vec2 d=abs(p)-b;return length(max(d,0.))+min(max(d.x,d.y),0.);}
float sdRB(vec2 p,vec2 b,float r){return sdBox(p,b-r)-r;}
float sdCap(vec2 p,vec2 a,vec2 b,float r){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h)-r;}
float sdTri(vec2 p,float w,float h){p.y=abs(p.y);return max(-p.x,max(p.x-h,p.y-w*(1.-p.x/h)));}
vec2 pen(vec2 p,float ang,float shade){p=rot(ang)*p;
 float body=sdCap(p,vec2(-.42,0.),vec2(.3,0.),.048);float tip=sdTri(p-vec2(.33,0.),.044,.16);float cap=sdRB(p-vec2(-.43,0.),vec2(.1,.056),.012);float clip=sdBox(p-vec2(-.4,.07),vec2(.08,.008));
 float d=min(min(body,tip),min(cap,clip));float l=0.;
 if(d<0.){l=shade*(.45+.55*smoothstep(.05,-.04,p.y));if(cap<0.)l*=.55;if(tip<0.)l=.95-.3*(p.x-.33)/.16;l*=.85+.15*step(.5,fract(p.x*9.));}
 return vec2(l,d);}
vec2 scene(float id,vec2 p,float t){
 vec2 c=vec2(uCx,uCy);vec2 q=(p-c)/uSc;float L=0.;float D=1e3;
 float r=length(q),a=atan(q.y,q.x);
 if(id<.5){
  float lines=step(.86,hash(vec2(floor(a*64.),floor(t*7.))))*smoothstep(.22,.75,r)*(.55+.45*hash(vec2(floor(a*64.),3.)));L=max(L,lines*.7);
  float fl=sin(t*1.3);vec2 a1=pen(q-vec2(-.02,.02),.42+fl*.04,1.);vec2 a2=pen((q-vec2(.03,-.02))*vec2(-1.,1.),.36-fl*.05,.75);
  if(a1.y<0.)L=a1.x;else if(a2.y<0.)L=a2.x;D=min(a1.y,a2.y);
  float burst=.06*(1.+.45*sin(a*10.+t*3.))*(1.+.15*sin(t*6.));float bd=r-burst;if(bd<0.)L=1.;D=min(D,bd);
  L=max(L,.55*exp(-r*9.));
 }else if(id<1.5){
  vec2 o=q-vec2(-.05,.02);float bob=abs(sin(t*9.))*.006;o.y-=bob;
  float tub=sdRB(o-vec2(-.04,-.06),vec2(.3,.1),.04);float nose=sdRB(o-vec2(.3,-.04),vec2(.08,.1),.03);
  float cab=sdRB(o-vec2(-.05,.09),vec2(.26,.11),.07);float roof=sdRB(o-vec2(-.05,.21),vec2(.29,.025),.02);
  float body=min(min(tub,nose),min(cab,roof));
  float win=sdRB(o-vec2(.08,.09),vec2(.1,.07),.02);float win2=sdRB(o-vec2(-.17,.09),vec2(.08,.07),.02);
  vec2 w1=o-vec2(-.2,-.17),w2=o-vec2(.3,-.17);float wh=min(length(w1),length(w2))-.07;
  if(body<0.){L=.62+.3*smoothstep(-.1,.2,o.y);if(o.y>.165)L=.18;if(min(win,win2)<0.)L=.1;if(abs(o.y+.01)<.01)L=1.;}
  if(wh<0.){float ww=min(length(w1),length(w2));L=ww<.03?.7:(ww>.055?.85:.08);float sp=step(.5,fract((atan(w1.y,w1.x)+t*14.)*1.27));if(ww>.03&&ww<.055)L=.25+.3*sp;}
  D=min(body,wh);
  vec2 hl=o-vec2(.38,-.02);L=max(L,.9*exp(-length(hl)*28.));float beam=step(0.,hl.x)*smoothstep(.06+hl.x*.35,0.,abs(hl.y))*exp(-hl.x*2.);L=max(L,beam*.55);
  float row=floor(q.y*70.);float sp2=step(.7,hash(vec2(row,1.)))*step(q.x,-.32);float st=fract(q.x*1.6+t*(1.2+hash(vec2(row,2.))*1.5)+hash(vec2(row,5.)));L=max(L,sp2*smoothstep(.0,.6,st)*step(st,.85)*.65);
  if(abs(q.y+.25)<.003)L=max(L,.5);
 }else if(id<2.5){
  float m=sdBox(q,vec2(.17,.38));D=m;
  if(m<0.){L=.18+.35*smoothstep(-.38,.38,q.y);float band=step(abs(q.y-.0),.035);float hz=step(.5,fract((q.x+q.y)*14.));if(band>0.)L=hz*.95;float scan=exp(-abs(q.y-sin(t*.9)*.35)*60.);L=max(L,scan*.9);}
  float n=noise(q*40.+t*3.);L=max(L,step(.82,n)*.25*smoothstep(.2,.8,r));
  float red=step(abs(q.y-.46),.02)*step(abs(q.x),.28);L=max(L,red*.85);
  L=max(L,.35*exp(-abs(m)*30.));
 }else if(id<3.5){
  float cd=r-.33;D=cd;
  if(cd<0.){L=.35+.4*smoothstep(-.3,.3,q.y+q.x*.3);
   float tw=abs(fract(q.x*11.+.25)-.5)*2.;float up=-.06+.035*tw;float lo=-.1-.035*tw+.035;
   float mouth=step(abs(q.x),.24)*step(lo,q.y)*step(q.y,up);if(mouth>0.)L=.02;
   float eye=min(sdBox(q-vec2(-.11,.1),vec2(.06,.012+.006*sin(t*2.))),sdBox(q-vec2(.11,.1),vec2(.06,.012+.006*sin(t*2.))));if(eye<0.)L=.02;
   if(abs(q.y-up)<.006&&abs(q.x)<.24)L=1.;}
  float halo=exp(-abs(cd)*24.)*.45;L=max(L,halo);
  float rings=step(.94,fract(r*10.-t*.4))*smoothstep(.34,.5,r)*smoothstep(.95,.5,r);L=max(L,rings*.35);
 }else{
  float R=.34;vec2 sv=q/R;float d2=dot(sv,sv);float sd=r-R;D=sd;
  if(d2<1.){vec3 n=vec3(sv,sqrt(1.-d2));float lon=atan(n.x,n.z)+t*.3;float lat=asin(clamp(n.y,-1.,1.));
   float sh=clamp(dot(n,normalize(vec3(-.45,.55,.7))),0.,1.);
   float land=smoothstep(.5,.62,noise(vec2(lon*1.6,lat*2.4)+7.)+.25*noise(vec2(lon*5.,lat*6.)));
   float gr=max(step(.985,abs(cos(lon*5.))),step(.985,abs(cos(lat*7.))));
   L=.08+.3*sh+land*.5*sh+gr*.2;}
  float orb=exp(-abs(r-R*1.32)*120.)*.55*step(0.,sin(a*2.+t*.8));L=max(L,orb);
  vec2 sat=vec2(cos(t*.7),sin(t*.7)*.35)*R*1.32;L=max(L,exp(-length(q-sat)*60.));
  L=max(L,.4*exp(-abs(sd)*26.));
 }
 L=max(L,.05*(1.-length(p)*1.2));
 return vec2(L,D);}
void main(){vec2 fc=gl_FragCoord.xy;
 float band=floor(fc.y/uR.y*36.);float gj=(hash(vec2(band,floor(uT*30.)))-.5)*uGl*step(.6,hash(vec2(band*1.7,floor(uT*20.))));fc.x+=gj*uR.x*.08;
 float s=uDot;mat2 R=rot(.7854);vec2 g=R*fc;vec2 cell=floor(g/s);vec2 f=fract(g/s)-.5;vec2 cc=rot(-.7854)*((cell+.5)*s);
 vec2 uv=cc/uR;float id=uA;vec2 ctr=.5*uR;float hs=uR.y;float gut=1e3;
 if(uTile>.5&&uTile<1.5){float tx=step(.5,uv.x);id=mix(uIds.x,uIds.y,tx);ctr=vec2((.25+.5*tx)*uR.x,.5*uR.y);gut=abs(fc.x-.5*uR.x);}
 else if(uTile>1.5&&uTile<2.5){float tx=step(.5,uv.x),ty=step(.5,uv.y);id=ty>.5?mix(uIds.x,uIds.y,tx):mix(uIds.z,uIds.w,tx);ctr=vec2((.25+.5*tx)*uR.x,(.25+.5*ty)*uR.y);hs=.5*uR.y;gut=min(abs(fc.x-.5*uR.x),abs(fc.y-.5*uR.y));}
 else if(uTile>2.5){float ty=step(.5,uv.y);id=mix(uIds.y,uIds.x,ty);ctr=vec2(.5*uR.x,(.25+.5*ty)*uR.y);hs=.5*uR.y;gut=abs(fc.y-.5*uR.y);}
 vec2 pc=(cc-ctr)/hs+uM*.012;vec2 pp=(fc-ctr)/hs+uM*.012;
 float k=smoothstep(0.,1.,uMix);
 vec2 A=scene(id,pc,uT);vec2 Ap=scene(id,pp,uT);float L=A.x;float D=Ap.y;
 if(uMix>.001){vec2 B=scene(uB,pc,uT);vec2 Bp=scene(uB,pp,uT);L=mix(L,B.x,k);D=mix(D,Bp.y,k);}
 float tr=sin(k*3.1416);float rad=sqrt(clamp(L,0.,1.))*.66*(1.-tr*.6);
 float aa=1.2/s;float dot_=smoothstep(rad+aa,rad-aa,length(f));
 float edge=smoothstep(1.6/uR.y,0.,abs(D))*.7*(1.-tr);
 vec3 col=vec3(max(dot_*.94,edge));
 col*=step(2.5,gut);
 float gb=step(.0005,abs(gj));col+=gb*(gj>0.?vec3(.5,0.,.08):vec3(0.,.3,.45))*col;
 col*=.94+.06*sin(fc.y*2.);
 col+=(hash(fc+fract(uT)*71.)-.5)*.04;
 col=min(vec3(1.),col+uFl*.14);
 gl_FragColor=vec4(col,1.);}`;
const VS='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
function glProg(gl,fs){const mk=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(o));return null}return o};const v=mk(gl.VERTEX_SHADER,VS),f=mk(gl.FRAGMENT_SHADER,fs);if(!v||!f)return null;const pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null;gl.useProgram(pr);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const l=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);return pr}
const THUMBS=[];
/* offscreen renderer: thumbnails, press-kit screenshots and capsules */
const REN=(function(){let c=null,gl=null,U=null,bad=false;
  function init(){if(gl)return true;if(bad)return false;try{c=document.createElement('canvas');gl=c.getContext('webgl',{preserveDrawingBuffer:true,antialias:false});const pr=gl&&glProg(gl,FS);if(!pr){gl=null;bad=true;return false}const L={};U=n=>L[n]||(L[n]=gl.getUniformLocation(pr,n));return true}catch(e){gl=null;bad=true;return false}}
  return{ok:()=>init(),draw(w,h,o){if(!init())return null;c.width=w;c.height=h;gl.viewport(0,0,w,h);const ids=o.ids||[o.id,o.id,o.id,o.id];
    gl.uniform2f(U('uR'),w,h);gl.uniform1f(U('uT'),o.t||2.2);gl.uniform1f(U('uA'),o.id||0);gl.uniform1f(U('uB'),o.id||0);gl.uniform1f(U('uMix'),0);gl.uniform1f(U('uDot'),o.dot||6);gl.uniform1f(U('uCx'),o.cx||0);gl.uniform1f(U('uCy'),o.cy||0);gl.uniform1f(U('uSc'),o.sc||.95);gl.uniform1f(U('uGl'),0);gl.uniform1f(U('uTile'),o.tile||0);gl.uniform1f(U('uFl'),0);gl.uniform4f(U('uIds'),ids[0],ids[1],ids[2],ids[3]);gl.uniform2f(U('uM'),0,0);gl.drawArrays(gl.TRIANGLES,0,3);return c}}})();
for(let i=0;i<4;i++){const c=REN.draw(960,600,{id:i,t:2.2+i,dot:6,sc:.95});if(c)THUMBS[i]=c.toDataURL('image/jpeg',.85)}
/* key art URLs come from the content file (Games tab in /admingg); the generated halftone is the fallback */
GAMES.forEach((g,k)=>{if(g.image)THUMBS[k]=g.image});
function thumb(i){return THUMBS[i]||''}
/* live KV: montage reel. Each clip is a cut of the halftone renderer; `src` (an mp4 URL) can replace any clip with real footage later. */
const CLIPS=[
 {ids:[0],t:0,cam:[0,0,1.12,.04,.02,.92],d:2.8,lb:'Pen Fight',sb:'Original IP · In development',g:0,k:0},
 {ids:[1],t:0,cam:[.12,0,1.08,-.08,0,.94],d:2.6,lb:'Auto Rush',sb:'Original IP · In development',g:1,k:0},
 {ids:[0,1],t:1,cam:[0,0,.92,0,0,.82],d:2.2,lb:'Pen Fight × Auto Rush',sb:'Two worlds in production',g:null,k:0},
 {ids:[2],t:0,cam:[0,.08,1.0,0,-.04,.74],d:2.8,lb:'Classified 01',sb:'Sealed · Flagship',g:2,k:1},
 {ids:[0,1,2,3],t:2,cam:[0,0,.95,0,0,.86],d:2.4,lb:'The slate',sb:'Four titles · One standard',g:null,k:1},
 {ids:[3],t:0,cam:[-.05,0,.86,.05,0,1.06],d:2.6,lb:'Classified 02',sb:'Sealed · A comedy with teeth',g:3,k:1},
 {ids:[4],t:0,cam:[0,0,.9,0,0,1.1],d:2.8,lb:'GG Productions',sb:'Global roster · On call',g:null,go:'production',k:2},
 {ids:[4,2],t:1,cam:[0,0,.9,0,0,.84],d:2.2,lb:'Roster × Flagship',sb:'Services feed the slate',g:null,go:'production',k:2},
 {ids:[0],t:0,cam:[.02,0,2.1,-.03,.01,1.65],d:2.4,lb:'Pen Fight',sb:'Close-up',g:0,k:3},
 {ids:[4,3,1,0],t:2,cam:[0,0,.92,0,0,.86],d:2.6,lb:'Gattabara Games',sb:'Bengaluru · For the world',g:null,k:3}];
if(GGC&&Array.isArray(GGC.heroCaptions))GGC.heroCaptions.forEach((c,i)=>{if(CLIPS[i]){CLIPS[i].lb=c.label||CLIPS[i].lb;CLIPS[i].sb=c.sub||CLIPS[i].sb}});
const KICK=['Original IP','Sealed worlds','GG Productions','Made in Bengaluru, for the world'];
const KV={i:0,acc:0,gl:0,fl:0,cov:false,paused:RM};
(function(){const cv=$('#kv');let gl=null;try{gl=cv.getContext('webgl',{antialias:false,powerPreference:'high-performance'})}catch(e){}
  const pr=gl&&glProg(gl,FS);if(!pr){document.body.classList.add('nogl');$('#kvfb').innerHTML=fbArt(0);return}
  const U={};['uR','uT','uA','uB','uMix','uDot','uCx','uCy','uSc','uGl','uM','uTile','uIds','uFl'].forEach(n=>U[n]=gl.getUniformLocation(pr,n));
  let scale=1;function rs(){const d=Math.min(1.5,devicePixelRatio||1)*scale;cv.width=Math.round(cv.clientWidth*d);cv.height=Math.round(cv.clientHeight*d);gl.viewport(0,0,cv.width,cv.height)}rs();addEventListener('resize',rs);
  let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(cv.parentElement);const start=performance.now();let m=[0,0],acc=0,fr=0,last=start;
  function loop(){requestAnimationFrame(loop);const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;if(!vis||KV.cov||document.hidden)return;
    if(!KV.paused){KV.acc+=dt;if(KV.acc>=CLIPS[KV.i].d)cut(KV.i+1)}
    /* the showreel video replaces the shader, but the game caption + timeline underneath keep cycling */
    if((document.body.classList.contains('reelhero')||document.body.classList.contains('reelwait'))){const cc=CLIPS[KV.i];hudTick(Math.min(1,KV.acc/cc.d));return}
    const c=CLIPS[KV.i],p=Math.min(1,KV.acc/c.d),e=p*p*(3-2*p);const t=RM?3:(now-start)/1000;
    KV.gl=Math.max(0,KV.gl-dt*2.6);KV.fl=Math.max(0,KV.fl-dt*7);m[0]+=(G.mx-m[0])*.05;m[1]+=(-G.my-m[1])*.05;
    const asp=cv.width/cv.height,mob=innerWidth<900;const tile=c.t===1&&asp<1.05?3:c.t;
    const bx=tile?0:(mob?0:Math.min(.42,asp*.5-.42)),by=tile?0:(mob?.16:0),bs=tile?1:(mob?.62:1.05);const cm=c.cam;
    const ids=[c.ids[0],c.ids[1]??c.ids[0],c.ids[2]??c.ids[0],c.ids[3]??c.ids[0]];
    gl.uniform2f(U.uR,cv.width,cv.height);gl.uniform1f(U.uT,t);gl.uniform1f(U.uA,ids[0]);gl.uniform1f(U.uB,ids[0]);gl.uniform1f(U.uMix,0);gl.uniform1f(U.uTile,tile);gl.uniform4f(U.uIds,ids[0],ids[1],ids[2],ids[3]);gl.uniform1f(U.uFl,KV.fl);
    gl.uniform1f(U.uDot,(mob?5:6.5)*Math.min(1.5,devicePixelRatio||1)*scale);gl.uniform1f(U.uCx,bx+cm[0]+(cm[3]-cm[0])*e);gl.uniform1f(U.uCy,by+cm[1]+(cm[4]-cm[1])*e);gl.uniform1f(U.uSc,bs*(cm[2]+(cm[5]-cm[2])*e));gl.uniform1f(U.uGl,KV.gl);gl.uniform2f(U.uM,m[0],m[1]);gl.drawArrays(gl.TRIANGLES,0,3);
    hudTick(p);
    acc+=dt;fr++;if(acc>2.5){if(fr/acc<36&&scale>.55){scale-=.15;rs()}acc=0;fr=0}}
  requestAnimationFrame(loop);})();
function fbArt(i){const s=[`<svg viewBox="0 0 800 500" fill="none" stroke="currentColor" stroke-width="3"><g transform="rotate(-24 400 250)"><rect x="170" y="230" width="380" height="36" rx="18"/><polyline points="550,230 640,248 550,266"/></g><g transform="rotate(18 400 250)" opacity=".6"><rect x="250" y="236" width="380" height="36" rx="18"/><polyline points="250,236 160,254 250,272"/></g></svg>`,`<svg viewBox="0 0 800 500" fill="none" stroke="currentColor" stroke-width="3"><path d="M210 360V230Q218 150 330 142H470Q540 150 548 230V360Z"/><path d="M548 236H640Q664 240 656 300L648 360H548"/><circle cx="280" cy="368" r="40"/><circle cx="600" cy="368" r="40"/></svg>`];return s[i%2]&&i<2?s[i]:`<svg viewBox="0 0 800 500" fill="none" stroke="currentColor" stroke-width="3"><rect x="330" y="80" width="140" height="340"/><path d="M330 250h140" stroke-dasharray="10 10"/></svg>`}

/* montage HUD + timeline */
const CLIP0=CLIPS.map((c,i)=>CLIPS.slice(0,i).reduce((a,x)=>a+x.d,0));
{const cn=$('#kvn')?.parentElement?.firstChild;if(cn&&cn.nodeType===3&&HUDL.clip)cn.textContent=HUDL.clip+' '}
$('#kvtot').textContent=String(CLIPS.length).padStart(2,'0');
/* one loading line for the current clip: it fills, the clip changes, it starts again */
$('#kvsegs').innerHTML='<button type="button" tabindex="-1" aria-hidden="true"><i></i></button>';
$('.kv-cap').appendChild($('#kvsegs'));/* the loading line shares the caption row: game name, press kit, then the line fills the rest */
function cut(i,user){KV.i=(i+CLIPS.length)%CLIPS.length;KV.acc=0;KV.gl=user?.6:.38;KV.fl=1;hud()}
let lastK=-1;
function hud(){const c=CLIPS[KV.i];$('#kvn').textContent=String(KV.i+1).padStart(2,'0');$('#kvlb').textContent=c.lb.toUpperCase();scramble($('#kvlb'),c.lb.toUpperCase(),260);$('#kvsb').textContent=c.sb;
  $('#kvpk').hidden=c.g==null;$('#kvpk').textContent=c.g!=null?(HUDL.pressKit||'Press kit ↗'):'';$('.kv').classList.toggle('game',c.g!=null);
  $('#kvsegs i').style.width='';
  const k=$('#kvkick');if(k&&c.k!==lastK){lastK=c.k;k.textContent=KICK[c.k];if(!RM){k.classList.remove('sw');void k.offsetWidth;k.classList.add('sw')}}
  const v=$('#kvvid');if(c.src){if(v.getAttribute('src')!==c.src)v.src=c.src;v.hidden=false;v.play&&v.play().catch(()=>{})}else if(!v.hidden){v.hidden=true;v.pause()}
  if(document.body.classList.contains('nogl'))$('#kvfb').innerHTML=fbArt(c.ids[0])}
let hf=0;function hudTick(p){const seg=$('#kvsegs button');if(seg)seg.querySelector('i').style.width=(p*100)+'%';if((hf++)%3)return;const T=CLIP0[KV.i]+KV.acc;const f=n=>String(Math.floor(n)).padStart(2,'0');$('#kvtc').textContent=`00:${f(T/60)}:${f(T%60)}:${f((T*24)%24)}`}
function setPause(p){KV.paused=p;$('#kvhud').classList.toggle('ps',p);$('#kvstate').textContent=p?(HUDL.pause||'PAUSE'):(HUDL.play||'PLAY');$('#kvpp').setAttribute('aria-label',p?'Play montage':'Pause montage');$('#kvpp').innerHTML=p?'<svg viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M1 0l9 5-9 5z"/></svg>':'<svg viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><rect x="1" y="0" width="3" height="10"/><rect x="6" y="0" width="3" height="10"/></svg>'}
$('#kvpp').onclick=()=>setPause(!KV.paused);setPause(KV.paused);
const kvOpen=()=>{const c=CLIPS[KV.i];if(c.g!=null&&GAMES[c.g])openDp(c.g);else if(c.go)go(c.go)};
$('#kvpk').onclick=kvOpen;$('#kv').addEventListener('click',()=>{if(CLIPS[KV.i].g!=null)kvOpen()});
document.addEventListener('visibilitychange',()=>{});
hud();

/* ================= NEWS ================= */
let nf='all',nall=false;
function renderNews(){const L=NEWS.filter(n=>nf==='all'||n[1]===nf);$('#nw').innerHTML=L.map((n,i)=>`<li class="${i>=4?'x':''}"><a href="#" data-i="${NEWS.indexOf(n)}" aria-expanded="false"><time>${n[0]}</time><span class="m"><span class="tag">${n[1]}</span></span><span class="t">${n[2]}</span><span class="ar" aria-hidden="true">${ARW}</span></a><div class="bd" hidden>${n[3]}</div></li>`).join('');
  $('#nw').classList.toggle('all',nall);$('#nwall').style.display=L.length>4?'':'none';
  $$('#nw a').forEach(a=>a.onclick=e=>{e.preventDefault();const li=a.parentElement,o=li.classList.toggle('open');a.setAttribute('aria-expanded',o);li.querySelector('.bd').hidden=!o})}
$$('#news .tab').forEach(b=>b.onclick=()=>{nf=b.dataset.f;$$('#news .tab').forEach(x=>x.setAttribute('aria-pressed',x===b));renderNews()});
$('#nwall').onclick=()=>{nall=!nall;$('#nwallt').textContent=nall?'Show fewer':'View all news';renderNews()};renderNews();
if(NEWS[0]){$('#pkt').textContent=NEWS[0][0];$('#pka').textContent=NEWS[0][2]}else{const tk=$('.pick');if(tk)tk.style.display='none'}

/* doctrine words */
(function(){const m=$('#doc');m.innerHTML=m.textContent.trim().split(/\s+/).map(w=>`<span class="w">${w}</span>`).join(' ')})();
function doc(){const m=$('#doc');const r=m.getBoundingClientRect();const p=Math.max(0,Math.min(1,(innerHeight*.85-r.top)/(r.height+innerHeight*.3)));const ws=m.querySelectorAll('.w');const n=Math.floor(p*ws.length*1.1);ws.forEach((w,i)=>w.classList.toggle('on',RM||i<n))}

/* ================= GAMES ================= */
$('#gl').innerHTML=GAMES.map((g,i)=>`<button class="gc rv ${i%2?'d1':''}" type="button" data-i="${i}" data-cat="${g.cat}"><span class="im">${GP.showComingSoon!==false?`<span class="soon" aria-label="${esc0(GP.comingSoonText||'Coming Soon...')}"><span class="o" aria-hidden="true">${esc0(GP.comingSoonText||'Coming Soon...')}</span><span class="f" aria-hidden="true">${esc0(GP.comingSoonText||'Coming Soon...')}</span></span>`:thumb(i)?`<img src="${thumb(i)}" alt="Key visual for ${g.t}">`:`<span class="ph" style="color:#F3F3F0">${fbArt(i)}</span>`}<span class="st"><span class="tag f">${g.st}</span></span><span class="no" aria-hidden="true">0${i+1}</span></span><span class="tx"><h3>${g.t}</h3><span class="cp">${g.spec}</span><span class="more"><span class="ci">${ARW}</span></span></span></button>`).join('');
$$('.gc').forEach(c=>c.onclick=()=>openDp(+c.dataset.i));
$$('#games .tab').forEach(b=>b.onclick=()=>{const f=b.dataset.g;$$('#games .tab').forEach(x=>x.setAttribute('aria-pressed',x===b));$$('.gc').forEach(c=>c.classList.toggle('hide',f!=='all'&&c.dataset.cat!==f))});
$('#mq1').innerHTML=('<span>Gattabara Games</span><span>Original IP</span><span>Co-owned IP</span><span>GG Productions</span>').repeat(3);

/* ================= PRESS KIT (title pages) ================= */
let dpOpen=false,dpLast=null;const sealedState=S.get('sealed',{});
const SHOTS=[{t:1.2,cx:.0,cy:0,sc:1.0},{t:3.4,cx:.22,cy:-.04,sc:1.6},{t:5.1,cx:-.18,cy:.08,sc:.8},{t:7.7,cx:.08,cy:.12,sc:2.2},{t:9.2,cx:0,cy:-.08,sc:1.25},{t:11.5,cx:-.26,cy:0,sc:1.85}];
const CAPS=[['main','Main capsule',1232,706],['vertical','Vertical capsule',748,896],['small','Small capsule',462,174]];
const LOGO_SVG='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="1200" height="1200" fill="none" stroke="#0A0A0A" stroke-width="3"><path d="M32 4L56 18V46L32 60L8 46V18Z"/><path d="M22 27H38M22 27V39H38V32.5H31"/></svg>';
const slug=t=>t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function shotCanvas(i,k,w,h){const p=SHOTS[k];return REN.draw(w,h,{id:i,t:p.t,cx:p.cx,cy:p.cy,sc:p.sc,dot:Math.max(4,Math.round(w/165))})}
function fitFont(x,txt,max,w0,weight,fam){let fs=w0;x.font=`${weight} ${fs}px ${fam}`;while(x.measureText(txt).width>max&&fs>12){fs-=4;x.font=`${weight} ${fs}px ${fam}`}return fs}
function logoCanvas(g,dark){const c=document.createElement('canvas');c.width=1600;c.height=640;const x=c.getContext('2d');const col=dark?'#0A0A0A':'#F3F3F0';x.fillStyle=col;x.textAlign='center';
  fitFont(x,g.t.toUpperCase(),1460,320,800,'"Barlow Condensed", sans-serif');x.fillText(g.t.toUpperCase(),800,390);
  x.font='600 34px "Barlow", sans-serif';try{x.letterSpacing='12px'}catch(e){}x.fillText('A GATTABARA GAMES TITLE',800,486);x.fillRect(740,532,120,6);return c}
function capCanvas(i,w,h){const g=GAMES[i];const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');const land=w/h>1.2;
  const src=REN.draw(w,h,{id:i,t:2.2+i,cx:land?.22*(w/h)/1.75:0,cy:land?0:.2,sc:land?(h<300?.7:1):.8,dot:Math.max(3,Math.round(Math.min(w,h)/80))});
  if(src)x.drawImage(src,0,0);else{x.fillStyle='#0A0A0A';x.fillRect(0,0,w,h)}
  const gr=land?x.createLinearGradient(0,0,w*.7,0):x.createLinearGradient(0,h,0,h*.35);gr.addColorStop(0,'rgba(10,10,10,.92)');gr.addColorStop(1,'rgba(10,10,10,0)');x.fillStyle=gr;x.fillRect(0,0,w,h);
  x.fillStyle='#F3F3F0';x.textAlign='left';const pad=Math.round(Math.min(w,h)*.08);const tt=g.t.toUpperCase();
  const fs=fitFont(x,tt,land?w*.5:w-pad*2,Math.round(h*(land?.24:.15)),800,'"Barlow Condensed", sans-serif');x.fillText(tt,pad,land?h/2+fs*.3:h-pad-fs*.25);
  x.font=`600 ${Math.max(9,Math.round(Math.min(w,h)*.035))}px "Barlow", sans-serif`;try{x.letterSpacing='3px'}catch(e){}x.fillText('GATTABARA GAMES',pad,pad+8);return c}
const toBlob=c=>new Promise(r=>c.toBlob(r,'image/png'));
let DL;setTimeout(()=>{try{if(window.claude&&window.claude.use)window.claude.use('downloads').then(d=>DL=d||null,()=>DL=null);else DL=null}catch(e){DL=null}},0);
async function saveFile(name,blob){if(DL){try{await DL.save({filename:name,data:blob});toast('Saved '+name)}catch(e){if(!e||e.code!=='declined')toast('Download unavailable here')}return}
  const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000);toast('Downloading '+name)}
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(u){let c=~0;for(let i=0;i<u.length;i++)c=CRC[(c^u[i])&255]^(c>>>8);return(~c)>>>0}
function zip(files){const enc=new TextEncoder();const parts=[],cent=[];let off=0;
  for(const f of files){const nm=enc.encode(f.name),d=f.data,crc=crc32(d);const h=new DataView(new ArrayBuffer(30));
    h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(12,0x21,true);h.setUint32(14,crc,true);h.setUint32(18,d.length,true);h.setUint32(22,d.length,true);h.setUint16(26,nm.length,true);parts.push(h.buffer,nm,d);
    const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(14,0x21,true);c.setUint32(16,crc,true);c.setUint32(20,d.length,true);c.setUint32(24,d.length,true);c.setUint16(28,nm.length,true);c.setUint32(42,off,true);cent.push(c.buffer,nm);off+=30+nm.length+d.length}
  const cs=cent.reduce((a,b)=>a+b.byteLength,0);const e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cs,true);e.setUint32(16,off,true);
  return new Blob([...parts,...cent,e.buffer],{type:'application/zip'})}
function factMd(g){const L=[`# ${g.t} \u2014 Press kit`,'',`> ${g.short}`,'','## Factsheet'];(g.fact||[]).forEach(r=>L.push(`- ${r[0]}: ${r[1]}`));L.push('','## Description',...(g.desc||[g.intro]).flatMap(p=>[p,'']),'## Features',...(g.feat||[]).map(f=>`- ${f[0]}: ${f[1]}`),'','## About the developer',BOILER,'');return L.join('\n')}
const extOf=u=>{const m=String(u).split('?')[0].match(/\.([a-z0-9]{2,4})$/i);return m?m[1].toLowerCase():'png'};
async function blobOf(url){const r=await fetch(url);if(!r.ok)throw new Error('http '+r.status);return r.blob()}
/* custom (uploaded) media: save it when the host allows it, otherwise open it so the visitor can save it */
async function saveRemote(name,url){try{return saveFile(name,await blobOf(url))}catch(e){window.open(url,'_blank','noopener');toast('Opened in a new tab')}}
async function pickBlob(url,gen){if(url){try{return await blobOf(url)}catch(e){}}return gen()}
async function pkDownload(i,what){const g=GAMES[i],sl=slug(g.t);
  try{
  if(what.startsWith('shot:')){const k=+what.slice(5);if((g.shotImgs||[])[k])return saveRemote(`${sl}-screenshot-${String(k+1).padStart(2,'0')}.${extOf(g.shotImgs[k])}`,g.shotImgs[k]);const c=shotCanvas(i,k%SHOTS.length,1920,1080);if(!c)return toast('Rendering unavailable');return saveFile(`${sl}-screenshot-0${k+1}.png`,await toBlob(c))}
  if(what.startsWith('logo:')){const dk=what.endsWith('dark');const cu=dk?g.logoBlack:g.logoWhite;if(cu)return saveRemote(`${sl}-logo-${dk?'black':'white'}.${extOf(cu)}`,cu);return saveFile(`${sl}-logo-${dk?'black':'white'}.png`,await toBlob(logoCanvas(g,dk)))}
  if(what.startsWith('cap:')){const cp=CAPS.find(x=>x[0]===what.slice(4));const cu=(g.promo||{})[cp[0]];if(cu)return saveRemote(`${sl}-capsule-${cp[0]}-${cp[2]}x${cp[3]}.${extOf(cu)}`,cu);return saveFile(`${sl}-capsule-${cp[0]}-${cp[2]}x${cp[3]}.png`,await toBlob(capCanvas(i,cp[2],cp[3])))}
  if(what==='studio:white'||what==='studio:black'){const u=what.endsWith('white')?PKSTUDIO.white:PKSTUDIO.black;return saveRemote('gattabara-games-logo-'+(what.endsWith('white')?'white':'black')+'.'+extOf(u),u)}
  if(what==='fact')return saveFile(`${sl}-factsheet.md`,new Blob([factMd(g)],{type:'text/markdown'}));
  if(what==='all'){toast('Preparing press kit…');await new Promise(r=>setTimeout(r,60));const F=[];const add=async(n,b)=>F.push({name:`${sl}-press-kit/${n}`,data:new Uint8Array(await b.arrayBuffer())});
    await add('factsheet.md',new Blob([factMd(g)]));await add('logo/logo-black.png',await pickBlob(g.logoBlack,async()=>toBlob(logoCanvas(g,true))));await add('logo/logo-white.png',await pickBlob(g.logoWhite,async()=>toBlob(logoCanvas(g,false))));
    for(let k=0;k<g.shots.length;k++){const b=await pickBlob((g.shotImgs||[])[k],async()=>{const c=shotCanvas(i,k%SHOTS.length,1920,1080);return c?toBlob(c):null});if(b)await add(`screenshots/screenshot-${String(k+1).padStart(2,'0')}.png`,b)}
    for(const cp of CAPS)await add(`promo/capsule-${cp[0]}-${cp[2]}x${cp[3]}.png`,await pickBlob((g.promo||{})[cp[0]],async()=>toBlob(capCanvas(i,cp[2],cp[3]))));
    await add('studio/gattabara-games-logo-white.png',await pickBlob(PKSTUDIO.white,async()=>new Blob([])));await add('studio/gattabara-games-logo-black.png',await pickBlob(PKSTUDIO.black,async()=>new Blob([])));
    return saveFile(`${sl}-press-kit.zip`,zip(F))}
  }catch(e){toast('Could not prepare that file')}}
function openDp(i,push=true){const g=GAMES[i];dpLast=dpLast||document.activeElement;$('#dpbc').textContent=g.t.toUpperCase();
  const others=GAMES.map((o,j)=>j).filter(j=>j!==i).slice(0,3);const sealed=!!g.sealed,opened=!!sealedState[g.id];
  const R=v=>sealed?`<span class="rd${opened?' open':''}" data-v="${pl('withheld','Withheld until reveal')}">${opened?pl('withheld','Withheld until reveal'):'█'.repeat(Math.max(6,Math.min(16,String(v).length)))}</span>`:esc(v);
  const fact=g.fact||[];
  const sealedRow=r=>sealed&&!['Developer','Based in','Website','Press contact','Status'].includes(r[0]);
  const fig=(cls,ratio,img,cap,dl,dlt)=>`<figure class="pkf ${cls}"><div class="im" style="aspect-ratio:${ratio}">${img}</div><figcaption><span>${cap}</span><button class="dl" type="button" data-dl="${dl}">${dlt}</button></figcaption></figure>`;
  const media=sealed?`<div class="pk-sub"><h3>${pl('media','Media')} <small>${pl('embargoTag','EMBARGOED')}</small></h3><div class="emb">${pl('embargoText','Media embargoed until reveal day')}</div></div>`:
   `${g.trailer?`<div class="pk-sub"><h3>${pl('trailer','Trailer')}</h3><div class="trl-v" data-trailer></div></div>`:`<div class="pk-sub"><h3>${pl('trailer','Trailer')} <small>${pl('comingSoonTag','COMING SOON')}</small></h3><div class="trl"><i></i><span>${pl('comingSoonText','Trailer \u00b7 coming soon')}</span></div></div>`}
    <div class="pk-sub"><h3>${pl('logo','Logo')} <small>${pl('logoSpec','TRANSPARENT PNG · 1600×640')}</small></h3><div class="logos">${fig('chk lt','5/2','<img data-logo="dark" '+(g.logoBlack?'src="'+esc(g.logoBlack)+'" ':'')+'alt="'+g.t+' logo, black">','<span class="n">01</span>'+pl('black','Black'),'logo:dark',g.logoBlack?pl('dlFile','↓ File'):pl('dlPng','↓ PNG'))}${fig('chk','5/2','<img data-logo="light" '+(g.logoWhite?'src="'+esc(g.logoWhite)+'" ':'')+'alt="'+g.t+' logo, white">','<span class="n">02</span>'+pl('white','White'),'logo:light',g.logoWhite?pl('dlFile','↓ File'):pl('dlPng','↓ PNG'))}</div></div>
    <div class="pk-sub"><h3>${pl('screenshots','Screenshots')} <small>${pl('screenshotSpec','PNG · 1920×1080')}</small></h3><div class="shots">${g.shots.map((c,k)=>fig('','16/9',`<img data-shot="${k}" ${(g.shotImgs||[])[k]?'src="'+esc(g.shotImgs[k])+'" ':''}alt="${g.t} screenshot ${k+1}: ${c}">`,`<span class="n">${String(k+1).padStart(2,'0')}</span>${c}`,'shot:'+k,(g.shotImgs||[])[k]?pl('dlFile','↓ File'):pl('dlPng','↓ PNG'))).join('')}</div></div>
    <div class="pk-sub"><h3>${pl('promo','Promo graphics')} <small>${pl('promoSpec','STORE CAPSULES')}</small></h3><div class="caps">${CAPS.map(cp=>fig('',`${cp[2]}/${cp[3]}`,`<img data-cap="${cp[0]}" ${(g.promo||{})[cp[0]]?'src="'+esc(g.promo[cp[0]])+'" ':''}alt="${g.t} ${cp[1]}">`,`${pl('cap_'+cp[0],cp[1])} \u00b7 ${cp[2]}\u00d7${cp[3]}`,'cap:'+cp[0],(g.promo||{})[cp[0]]?pl('dlFile','↓ File'):pl('dlPng','↓ PNG'))).join('')}</div></div>
    <p class="note" style="color:#7A7A77">${esc(pl('note','※ Images are key visuals from our halftone renderer until final in-game captures are released.'))}</p>`;
  $('#dpbody').innerHTML=`<nav class="pk-nav" aria-label="Press kit sections"><div class="wrap"><a href="#pk-fact" data-pk>${pl('navFact','Factsheet')}</a><a href="#pk-desc" data-pk>${pl('navDesc','Description')}</a><a href="#pk-media" data-pk>${pl('navMedia','Media')}</a><a href="#pk-about" data-pk>${pl('navAbout','About')}</a><a href="#pk-contact" data-pk>${pl('navContact','Contact')}</a></div></nav>
   <div class="wrap">
    <header class="pk-hero"><div class="cap">${thumb(i)?`<img src="${thumb(i)}" alt="Capsule art for ${g.t}">`:`<div style="position:absolute;inset:0;color:#F3F3F0">${fbArt(i)}</div>`}</div>
     <div><p class="lbl"><b>${pl('tag','PRESS KIT')}</b>${g.code}</p><h1 id="dpt">${g.t}</h1><p class="rel">${pl('release','Release date:')} <b>${sealed?'Sealed':esc(factOf(g,'Release date')||'To be announced')}</b></p>
      <div class="pk-tags">${g.tags.map(t=>`<span class="tag">${sealed&&!opened&&t==='Sealed'?t:esc(t)}</span>`).join('')}</div>
      <div class="acts">${sealed?`<a class="btn" href="#contact" data-line="insider">${pl('insider','Join the insider list')}</a>`:`<button class="btn" type="button" data-dl="all">${pl('downloadAll','↓ Download all media (.zip)')}</button>`}<a class="btn ln" href="#contact" data-line="press">${pl('inquiry','Press inquiry')}</a></div></div></header>
    <section class="pk-s" id="pk-fact"><h2>${pl('fact','Factsheet')}</h2><div><table class="prof">${fact.map(r=>`<tr><th>${r[0]}</th><td>${sealedRow(r)?R(r[1]):esc(r[1])}</td></tr>`).join('')}</table>${sealed?'':`<p style="margin-top:20px"><button class="dl" type="button" data-dl="fact">${pl('factDl','↓ Factsheet .md')}</button></p>`}</div></section>
    <section class="pk-s" id="pk-desc"><h2>${pl('descTitle','Description')}</h2><div class="body"><p class="mono">${pl('short','Short description')}</p><p class="lead">${g.short}</p>
     ${sealed?`<div class="lock" style="margin-top:40px"><p class="mono" style="color:#9A9A97">${pl('restricted','Access restricted')}</p><p class="tt2" id="lockt">${opened?pl('decryptedLine','File decrypted.'):pl('sealedLine','This file is sealed.')}</p><button class="hold ${opened?'done':''}" type="button" id="hold"><span class="f"></span><span class="lb">${opened?pl('decrypted','Decrypted'):pl('hold','Hold to decrypt')}</span></button><p class="intel" id="intel" ${opened?'':'hidden'}>${g.intel}</p></div>`:
     `<p class="mono" style="margin-top:44px">${pl('descLabel','Description')}</p>${g.desc.map(p=>`<p>${p}</p>`).join('')}<p class="mono" style="margin-top:44px">${pl('features','Features')}</p><div class="feat">${g.feat.map((f,k)=>`<div><span>${pl('feature','FEATURE')} 0${k+1}</span><b>${f[0]}</b><p>${f[1]}</p></div>`).join('')}</div>`}</div></section>
    <section class="pk-s" id="pk-media"><h2>${pl('media','Media')}</h2><div>${media}</div></section>
    <section class="pk-s" id="pk-about"><h2>${pl('about','About the developer')}</h2><div><p class="lead">${BOILER}</p><div class="studio"><img class="studio-logo" src="${esc(PKSTUDIO.white)}" alt="Gattabara Games logo"><div class="bt"><button class="dl" type="button" data-dl="studio:white">${pl('logoWhiteBtn','\u2193 Logo (white)')}</button><button class="dl" type="button" data-dl="studio:black">${pl('logoBlackBtn','\u2193 Logo (black)')}</button></div></div></div></section>
    <section class="pk-s" id="pk-contact"><h2>${pl('contact','Contact')}</h2><div><table class="prof">${PKCONTACT.map(r=>`<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('')}</table></div></section>
    <div class="pk-s" style="border-bottom:0;padding-bottom:30px"><h2>${pl('others','Other titles')}</h2><div></div></div>
    <div class="others">${others.map(j=>`<button type="button" data-j="${j}">${thumb(j)?`<img src="${thumb(j)}" alt="">`:''}<b>${GAMES[j].t}</b><span class="mono" style="color:#7A7A77">${GAMES[j].st} · ${pl('pressKitWord','Press kit')}</span></button>`).join('')}</div></div>`;
  $$('#dpbody .others button').forEach(b=>b.onclick=()=>{$('#dp').scrollTo({top:0});openDp(+b.dataset.j,false);try{nativeHist.replaceState({dp:GAMES[+b.dataset.j].id},'','#title/'+GAMES[+b.dataset.j].id)}catch(e){}});
  {const tb=$('#dpbody [data-trailer]');if(tb)mountTrailer(tb,g.trailer,g.trailerPoster)}
  $$('#dpbody [data-dl]').forEach(b=>b.onclick=async()=>{b.disabled=true;await pkDownload(i,b.dataset.dl);b.disabled=false});
  $$('#dpbody [data-pk]').forEach(a=>a.onclick=e=>{e.preventDefault();e.stopPropagation();const t=$(a.getAttribute('href'));if(t)$('#dp').scrollTo({top:t.offsetTop-110,behavior:RM?'auto':'smooth'})});
  if(g.sealed&&!opened)hold($('#hold'),g);
  if(!sealed)setTimeout(()=>pkPreviews(i),RM?0:520);
  if(!dpOpen){wipe();setTimeout(()=>{$('#dp').classList.add('open');$('#dp').setAttribute('aria-hidden','false');$('#dpx').focus()},RM?0:380);dpOpen=true;if(lenis)lenis.stop();document.body.style.overflow='hidden';if(push){try{nativeHist.pushState({dp:g.id},'','#title/'+g.id)}catch(e){}}}}
/* trailer: poster + the round play / volume buttons and thin progress line, no native controls */
function mountTrailer(box,src,poster){
  const IC={play:'<polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>',pause:'<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',vol:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',mute:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>'};
  const svg=n=>`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
  const v=document.createElement('video');Object.assign(v,{playsInline:true,preload:'metadata',poster:poster||''});v.className='rv-video';v.src=src;
  const ctl=document.createElement('div');ctl.className='rv-ctl';
  ctl.innerHTML=`<div class="rv-row"><button type="button" class="rv-btn" data-a="play" aria-label="Play trailer">${svg('play')}</button><button type="button" class="rv-btn" data-a="mute" aria-label="Mute trailer">${svg('vol')}</button></div><div class="rv-bar"><i></i></div>`;
  box.append(v,ctl);
  const bp=ctl.querySelector('[data-a=play]'),bm=ctl.querySelector('[data-a=mute]'),fill=ctl.querySelector('.rv-bar i');
  const ico=()=>{bp.innerHTML=svg(v.paused?'play':'pause');bp.setAttribute('aria-label',v.paused?'Play trailer':'Pause trailer');bm.innerHTML=svg(v.muted?'mute':'vol');bm.setAttribute('aria-label',v.muted?'Unmute trailer':'Mute trailer')};
  const tg=()=>{v.paused?v.play().catch(()=>{}):v.pause()};
  bp.onclick=e=>{e.stopPropagation();tg()};bm.onclick=e=>{e.stopPropagation();v.muted=!v.muted;ico()};v.addEventListener('click',tg);
  ['play','pause','volumechange'].forEach(ev=>v.addEventListener(ev,ico));
  v.addEventListener('timeupdate',()=>{fill.style.width=(v.duration?v.currentTime/v.duration*100:0)+'%'});
  ctl.querySelector('.rv-bar').addEventListener('click',e=>{e.stopPropagation();const r=e.currentTarget.getBoundingClientRect();if(v.duration)v.currentTime=(e.clientX-r.left)/r.width*v.duration});
  ico()}
const PKC={};
function pkPreviews(i){const g=GAMES[i],C=PKC[i]||(PKC[i]={});let q=[];
  $$('#dpbody img[data-logo]:not([src])').forEach(im=>q.push(()=>{const k='l'+im.dataset.logo;C[k]=C[k]||logoCanvas(g,im.dataset.logo==='dark').toDataURL();im.src=C[k]}));
  $$('#dpbody img[data-shot]:not([src])').forEach(im=>q.push(()=>{const k='s'+im.dataset.shot;if(!C[k]){const c=shotCanvas(i,+im.dataset.shot%SHOTS.length,960,540);C[k]=c?c.toDataURL('image/jpeg',.86):''}if(C[k])im.src=C[k]}));
  $$('#dpbody img[data-cap]:not([src])').forEach(im=>q.push(()=>{const k='c'+im.dataset.cap;if(!C[k]){const cp=CAPS.find(x=>x[0]===im.dataset.cap);C[k]=capCanvas(i,cp[2],cp[3]).toDataURL('image/jpeg',.88)}im.src=C[k]}));
  $$('#dpbody .pkf img').forEach(im=>im.addEventListener('load',()=>im.classList.add('ok'),{once:true}));
  (function step(){if(!dpOpen||!q.length)return;q.shift()();setTimeout(step,16)})()}
function closeDp(fromNav){if(!dpOpen)return;dpOpen=false;$$('#dpbody video').forEach(v=>v.pause());$('#dp').classList.remove('open');$('#dp').setAttribute('aria-hidden','true');document.body.style.overflow='';if(lenis)lenis.start();if(!fromNav){try{if(history.state&&history.state.dp)history.back()}catch(e){}}dpLast&&dpLast.focus&&dpLast.focus({preventScroll:true});dpLast=null}
$('#dpx').onclick=()=>closeDp(false);addEventListener('popstate',()=>{if(dpOpen)closeDp(true)});
$$('[data-open]').forEach(b=>b.onclick=()=>openDp(+b.dataset.open));
function wipe(){if(RM)return;const w=$('#wipe');w.classList.remove('go');void w.offsetWidth;w.classList.add('go')}
function hold(b,g){const f=b.querySelector('.f'),l=b.querySelector('.lb');let p=0,tm=null,done=false;
  const st=e=>{e.preventDefault();if(done)return;clearInterval(tm);tm=setInterval(()=>{p=Math.min(100,p+2.5);f.style.width=p+'%';l.textContent=pl('decrypting','Decrypting')+' '+Math.round(p)+'%';if(p>=100){clearInterval(tm);done=true;b.classList.add('done');l.textContent=pl('decrypted','Decrypted');$('#intel').hidden=false;$('#lockt').textContent=pl('decryptedLine','File decrypted.');$$('#dpbody .rd').forEach(x=>{x.classList.add('open');x.textContent=x.dataset.v});sealedState[g.id]=1;S.set('sealed',sealedState);KV.gl=1;toast(g.code+' decrypted')}},30)};
  const en=()=>{if(done)return;clearInterval(tm);tm=setInterval(()=>{p=Math.max(0,p-5);f.style.width=p+'%';l.textContent=p?pl('decrypting','Decrypting')+' '+Math.round(p)+'%':pl('hold','Hold to decrypt');if(!p)clearInterval(tm)},30)};
  b.addEventListener('pointerdown',st);['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,en));b.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat)st(e)});b.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')en()});b.addEventListener('contextmenu',e=>e.preventDefault())}
if(/^#title\//.test(location.hash)){const id=location.hash.split('/')[1];const i=GAMES.findIndex(g=>g.id===id);if(i>=0)setTimeout(()=>openDp(i,false),1800)}

/* ================= BUSINESS ================= */
$$('.bz').forEach(b=>{b.onclick=()=>{if(b.dataset.line)setType(b.dataset.line);go(b.dataset.go)};});

/* ================= PRODUCTIONS ================= */
$('#svc').innerHTML=SVC.map((s,i)=>`<div><button class="h" type="button" aria-expanded="${i===0}"><span class="n">0${i+1}</span><b>${s[0]}</b><span class="pm" aria-hidden="true"></span></button><div class="bd" ${i?'hidden':''}><p>${s[1]}</p>${s[3]?`<p class="q">${s[3]}</p>`:''}<div class="tg">${s[2].map(x=>`<span class="tag">${x}</span>`).join('')}</div></div></div>`).join('');
$$('#svc .h').forEach(b=>b.addEventListener('click',()=>{const o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',!o);b.nextElementSibling.hidden=o}));
$('#spx').innerHTML=SK.map((s,i)=>`<div class="sp rv ${['','d1','d2'][i%3]}" style="--w:${s[1]/100}"><div class="txt"><b>${s[0]}</b><p>${s[2]}</p></div><div class="ring"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="trk" cx="50" cy="50" r="44" pathLength="100"/><circle class="prg" cx="50" cy="50" r="44" pathLength="100"/></svg><span class="v" data-count="${s[1]}">0</span></div></div>`).join('');
const rc=$('#reel'),r=rc.getContext('2d');let reel='anim',playing=false,t0=0,el=0,raf;
const SH={anim:['Dual-blade combat loop','Heavy attack, hit-stop','Creature locomotion','Cinematic stand-off'],art:['Character turnaround','Environment kit, night market','Hard-surface prop sheet','Key art paintover']};
function fig(X,Y,tt,dir,col){r.save();r.translate(X,Y);r.scale(dir,1);r.strokeStyle=col;r.lineWidth=4;r.lineCap='round';const b=Math.sin(tt*4)*4,sw=Math.sin(tt*3);r.beginPath();r.moveTo(0,-110+b);r.lineTo(0,-36);r.moveTo(0,-36);r.lineTo(-28,0);r.moveTo(0,-36);r.lineTo(30+sw*8,0);r.stroke();r.beginPath();r.arc(0,-132+b,18,0,7);r.stroke();
  const a=-1.2+sw*1.4,hx=Math.cos(a)*50,hy=-96+b+Math.sin(a)*50;r.beginPath();r.moveTo(0,-96+b);r.lineTo(hx,hy);r.stroke();r.strokeStyle='#fff';r.lineWidth=3;r.beginPath();r.moveTo(hx,hy);r.lineTo(hx+Math.cos(a-.6)*110,hy+Math.sin(a-.6)*110);r.stroke();r.restore()}
function draw(tt){const W=960,H=540,sh=Math.floor(tt/3)%4;r.fillStyle='#050505';r.fillRect(0,0,W,H);r.strokeStyle='rgba(255,255,255,.07)';r.lineWidth=1;for(let i=0;i<=20;i++){r.beginPath();r.moveTo(W/2+(i-10)*14,330);r.lineTo(W/2+(i-10)*90,H);r.stroke()}for(let j=0;j<8;j++){const y=330+Math.pow(j/8,2)*210;r.beginPath();r.moveTo(0,y);r.lineTo(W,y);r.stroke()}
  if(reel==='anim'){fig(400,420,tt,1,'#F3F3F0');fig(570,420,tt+1.3,-1,'#8C8C8C');if(Math.sin(tt*6)>.92){r.strokeStyle='#FF2A4D';r.lineWidth=2;for(let i=0;i<12;i++){const a=i/12*7;r.beginPath();r.moveTo(485+Math.cos(a)*14,290+Math.sin(a)*14);r.lineTo(485+Math.cos(a)*60,290+Math.sin(a)*60);r.stroke()}}r.fillStyle='#666';r.font='13px "JetBrains Mono", monospace';r.fillText('F'+String(Math.floor(tt*24)%240).padStart(3,'0')+'  HITSTOP 4F  60FPS',30,470)}
  else{const cx=480,cy=250,s=120,P=[];for(const a of[-1,1])for(const b of[-1,1])for(const c of[-1,1])P.push([a,b,c]);const ay=tt*.6,ax=tt*.35;const pr=P.map(([a,b,c])=>{let X=a*Math.cos(ay)-c*Math.sin(ay),Z=a*Math.sin(ay)+c*Math.cos(ay),Y=b*Math.cos(ax)-Z*Math.sin(ax);Z=b*Math.sin(ax)+Z*Math.cos(ax);const k=3/(3+Z);return[cx+X*s*k,cy+Y*s*k]});
    r.strokeStyle='#F3F3F0';r.lineWidth=1.6;for(let i=0;i<8;i++)for(let j=i+1;j<8;j++){let dd=0;for(let q=0;q<3;q++)if(P[i][q]!==P[j][q])dd++;if(dd===1){r.beginPath();r.moveTo(...pr[i]);r.lineTo(...pr[j]);r.stroke()}}['#F3F3F0','#BDBDBD','#888','#555','#2A2A2A'].forEach((c,i)=>{r.fillStyle=c;r.fillRect(40,110+i*56,36,36)});r.fillStyle='#666';r.font='13px "JetBrains Mono", monospace';r.fillText('TRIS 12,480  LOD0  TEX 2K',690,470)}
  r.fillStyle='#000';r.fillRect(0,0,W,44);r.fillRect(0,H-44,W,44);r.fillStyle='#F3F3F0';r.font='700 18px "Barlow Condensed", sans-serif';r.fillText('GG PRODUCTIONS',26,29);r.fillStyle='#FF2A4D';r.beginPath();r.arc(W-34,22,5,0,7);r.fill();r.fillStyle='#9A9A97';r.font='12px "JetBrains Mono", monospace';r.fillText('SH0'+(sh+1)+'  '+SH[reel][sh].toUpperCase()+'  ·  SAMPLE',26,H-17);$('#shot').textContent='Sample cut · SH0'+(sh+1)}
function loop(ts){if(!t0)t0=ts-el*1000;el=(ts-t0)/1000;draw(el);if(playing)raf=requestAnimationFrame(loop)}
draw(.4);function tgl(){playing=!playing;$('#play').hidden=playing;if(playing){t0=0;raf=requestAnimationFrame(loop)}else cancelAnimationFrame(raf)}
$('#play').onclick=tgl;rc.addEventListener('click',()=>{if(playing)tgl()});
$$('.seg button').forEach(b=>b.addEventListener('click',()=>{$$('.seg button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');reel=b.dataset.r;el=0;t0=0;if(!playing)draw(.4)}));

/* ================= NETWORK ================= */
let DISC=['Combat','Animation','Direction','Dramatics','Art','3D Modeling','Development'];let TIER=['Indie','AA','AAA-ready'];
let PPL=[['Combat designer','Kraków',50.06,19.94,'Combat',2,'9 yrs'],['Combat animator','Montréal',45.5,-73.57,'Combat',2,'11 yrs'],['Animator','Pune',18.52,73.86,'Animation',1,'6 yrs'],['Mocap cleanup lead','Manila',14.6,120.98,'Animation',1,'7 yrs'],['Cinematic director','Seoul',37.57,126.98,'Direction',2,'12 yrs'],['Layout artist','Bengaluru',12.97,77.59,'Direction',0,'4 yrs'],['Performance director','London',51.5,-.12,'Dramatics',2,'10 yrs'],['Acting coach','Mumbai',19.08,72.88,'Dramatics',1,'8 yrs'],['Concept artist','Jakarta',-6.2,106.85,'Art',1,'7 yrs'],['Key art painter','Lisbon',38.72,-9.14,'Art',2,'9 yrs'],['Character modeler','Hyderabad',17.39,78.49,'3D Modeling',1,'6 yrs'],['Environment artist','Bogotá',4.71,-74.07,'3D Modeling',0,'5 yrs'],['Hard-surface modeler','Tallinn',59.44,24.75,'3D Modeling',2,'8 yrs'],['Gameplay engineer','Bengaluru',12.97,77.59,'Development',1,'7 yrs'],['Unreal engineer','Austin',30.27,-97.74,'Development',2,'10 yrs'],['Roblox developer','Singapore',1.35,103.82,'Development',0,'4 yrs']];
if(GGC&&GGC.network){const N=GGC.network;if(Array.isArray(N.disciplines)&&N.disciplines.length)DISC=N.disciplines.slice();if(Array.isArray(N.tiers)&&N.tiers.length)TIER=N.tiers.slice();
  if(Array.isArray(N.people))PPL=N.people.map(p=>[p.role||'',p.city||'',+p.lat||0,+p.lon||0,p.discipline||DISC[0],Math.max(0,TIER.indexOf(p.tier)),p.experience||''])}
(function(){const cv=$('#globe'),x=cv.getContext('2d');let W=0,vis=false,ring=0;const N=innerWidth<760?700:1300,pts=[];for(let i=0;i<N;i++){const y=1-(i/(N-1))*2,rr=Math.sqrt(1-y*y),th=i*2.399963;pts.push([Math.cos(th)*rr,y,Math.sin(th)*rr])}
  const ll=(la,lo)=>{const p=(90-la)*Math.PI/180,t=(lo+180)*Math.PI/180;return[-Math.sin(p)*Math.cos(t),Math.cos(p),Math.sin(p)*Math.sin(t)]};const blr=ll(12.97,77.59);const cities=PPL.filter(p=>p[1]!=='Bengaluru').map(p=>ll(p[2],p[3]));
  function rs(){const d=Math.min(2,devicePixelRatio||1);W=cv.clientWidth;cv.width=cv.height=Math.max(1,W*d);x.setTransform(d,0,0,d,0,0)}rs();addEventListener('resize',rs);new IntersectionObserver(e=>{vis=e[0].isIntersecting;if(vis&&!W)rs()}).observe(cv);
  G.ringGlobe=()=>ring=performance.now();
  (function f(t){requestAnimationFrame(f);if(!vis||!W)return;const R=W*.42,cx=W/2,cy=W/2,a=(RM?0:t*.00012)+3.7,ti=.35;x.clearRect(0,0,W,W);
    const rot=v=>{const X=v[0]*Math.cos(a)-v[2]*Math.sin(a),Z=v[0]*Math.sin(a)+v[2]*Math.cos(a),Y=v[1];return[X,Y*Math.cos(ti)-Z*Math.sin(ti),Y*Math.sin(ti)+Z*Math.cos(ti)]};
    x.strokeStyle='rgba(243,243,240,.3)';x.lineWidth=1;x.beginPath();x.arc(cx,cy,R,0,7);x.stroke();x.strokeStyle='rgba(243,243,240,.2)';x.setLineDash([2,6]);x.beginPath();x.arc(cx,cy,R*1.1,t*.0003,t*.0003+5.5);x.stroke();x.setLineDash([]);
    for(const p of pts){const q=rot(p);if(q[2]<-.1)continue;x.fillStyle=`rgba(243,243,240,${.1+.55*Math.max(0,q[2])})`;x.fillRect(cx+q[0]*R-.8,cy-q[1]*R-.8,1.6,1.6)}
    const b=rot(blr);const boost=ring?Math.max(0,1-(performance.now()-ring)/8000):0;
    cities.forEach((c,i)=>{const e=rot(c);if(e[2]<-.2&&b[2]<-.2)return;const mx=(b[0]+e[0])/2,my=(b[1]+e[1])/2,mz=(b[2]+e[2])/2;const ml=Math.hypot(mx,my,mz)||1,lift=1.2+Math.hypot(b[0]-e[0],b[1]-e[1],b[2]-e[2])*.25;const m=[mx/ml*lift,my/ml*lift];
      x.strokeStyle=`rgba(243,243,240,${.16+boost*.5})`;x.beginPath();x.moveTo(cx+b[0]*R,cy-b[1]*R);x.quadraticCurveTo(cx+m[0]*R,cy-m[1]*R,cx+e[0]*R,cy-e[1]*R);x.stroke();
      const u=((t*.0004+i*.13)%1);const bx=(1-u)*(1-u)*b[0]+2*(1-u)*u*m[0]+u*u*e[0],by=(1-u)*(1-u)*b[1]+2*(1-u)*u*m[1]+u*u*e[1];x.fillStyle='#FFF';x.fillRect(cx+bx*R-1.5,cy-by*R-1.5,3,3);
      if(e[2]>-.1){x.fillStyle='#F3F3F0';x.fillRect(cx+e[0]*R-2.5,cy-e[1]*R-2.5,5,5)}});
    if(b[2]>-.3){x.strokeStyle='#F3F3F0';x.beginPath();x.arc(cx+b[0]*R,cy-b[1]*R,8+Math.sin(t*.006)*2,0,7);x.stroke();x.fillStyle='#FFF';x.fillRect(cx+b[0]*R-3,cy-b[1]*R-3,6,6)}})(0)})();
let act=new Set(['Combat','Animation','Art']);DISC.forEach(d=>{const b=document.createElement('button');b.type='button';b.textContent=d;b.setAttribute('aria-pressed',act.has(d));b.onclick=()=>{act.has(d)?act.delete(d):act.add(d);b.setAttribute('aria-pressed',act.has(d));rp()};$('#chips').appendChild(b)});
$('#tr').addEventListener('input',rp);const on=p=>act.has(p[4])&&p[5]>=+$('#tr').value;
function rp(){$('#tn').textContent=TIER[+$('#tr').value];let n=0;$('#ppl').innerHTML=PPL.map(p=>{const o=on(p);if(o)n++;return `<div class="pp" style="opacity:${o?1:.3}"><span class="w">${p[0]}</span><span class="lc">${p[1]} · ${p[4]} · ${p[6]}</span><span class="s" style="color:${o?'#F3F3F0':'#5C5C5A'}">${o?'● '+(NCL.onCall||'On call'):'○ '+(NCL.standby||'Standby')} · ${TIER[p[5]]}</span></div>`}).join('');$('#sq').innerHTML=`Squad <b>${n}</b> · <b>${new Set(PPL.filter(on).map(p=>p[1])).size}</b> cities`}rp();
const rdc=$('#radar'),rx=rdc.getContext('2d');let rraf,swp=0;
function radar(){const w=rdc.clientWidth,h=rdc.clientHeight,d=Math.min(2,devicePixelRatio||1);if(rdc.width!==Math.round(w*d)){rdc.width=Math.round(w*d);rdc.height=Math.round(h*d)}rx.setTransform(d,0,0,d,0,0);rx.fillStyle='rgba(10,10,10,.25)';rx.fillRect(0,0,w,h);const cx=w/2,cy=h/2,R=Math.min(w,h)*.42;
  rx.strokeStyle='rgba(243,243,240,.14)';rx.lineWidth=1;[1,.66,.33].forEach(k=>{rx.beginPath();rx.arc(cx,cy,R*k,0,7);rx.stroke()});rx.beginPath();rx.moveTo(cx-R,cy);rx.lineTo(cx+R,cy);rx.moveTo(cx,cy-R);rx.lineTo(cx,cy+R);rx.stroke();
  swp+=RM?0:.025;rx.strokeStyle='rgba(243,243,240,.9)';rx.beginPath();rx.moveTo(cx,cy);rx.lineTo(cx+Math.cos(swp)*R,cy+Math.sin(swp)*R);rx.stroke();
  PPL.forEach(p=>{const dx=p[3]-77.59,dy=p[2]-12.97,ang=Math.atan2(-dy,dx),dist=Math.sqrt(Math.min(1,Math.hypot(dx,dy)/190))*.88+.1,X=cx+Math.cos(ang)*dist*R,Y=cy+Math.sin(ang)*dist*R,o=on(p);if(o){rx.strokeStyle='rgba(243,243,240,.25)';rx.beginPath();rx.moveTo(cx,cy);rx.lineTo(X,Y);rx.stroke()}rx.fillStyle=o?'#F3F3F0':'#2a2a2a';rx.fillRect(X-3,Y-3,6,6);if(o){rx.fillStyle='#9A9A97';rx.font='10px "JetBrains Mono", monospace';rx.fillText(p[1].toUpperCase(),X+7,Y-5)}});
  rx.fillStyle='#FFF';rx.fillRect(cx-5,cy-5,10,10);rx.fillStyle='#F3F3F0';rx.font='10px "JetBrains Mono", monospace';rx.fillText('BENGALURU · CORE',cx+10,cy+18);rraf=requestAnimationFrame(radar)}
let rung=false,rgT;function ring(){if(rung||S.get('answered',false))return;rung=true;$('#call').classList.add('ring');$('#csub').textContent=NCL.ring||'Incoming call…';G.ringGlobe&&G.ringGlobe();rgT=setTimeout(()=>{$('#call').classList.remove('ring');$('#csub').textContent=NCL.missed||'Missed · tap to return'},9000)}
let lf;function openM(){lf=document.activeElement;clearTimeout(rgT);$('#call').classList.remove('ring');$('#csub').textContent=NCL.connected||'Connected';S.set('answered',true);$('#modal').hidden=false;if(lenis)lenis.stop();cancelAnimationFrame(rraf);radar();$('#close').focus()}
function closeM(){$('#modal').hidden=true;if(lenis)lenis.start();cancelAnimationFrame(rraf);$('#csub').textContent=NCL.ended||'Call ended · tap to call back';lf&&lf.focus()}
$('#answer').onclick=openM;$('#close').onclick=closeM;$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeM()});
$('#tobrief').onclick=()=>{closeM();setType('production');go('contact')};

/* ================= LEADERSHIP (halftone portraits) ================= */
$('#ldr').innerHTML=CREW.map((c,i)=>`<div class="lr rv ${['','d1','d2','d3'][i]}"><button type="button" aria-expanded="false">${c[4]?`<img class="pp" src="${esc0(c[4])}" alt="${esc0(c[0])}" width="104" height="104" loading="lazy">`:`<canvas aria-hidden="true" data-i="${i}"></canvas>`}<span class="nm">${c[0]}</span><span class="rl">${c[1]}</span><span class="pm" aria-hidden="true"></span></button><div class="bd" hidden>${c[2]}<span class="mono">${c[3]}</span></div></div>`).join('');
$$('.lr>button').forEach(b=>b.onclick=()=>{const o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',!o);b.nextElementSibling.hidden=o});
$$('.lr canvas').forEach(cv=>{const ci=+cv.dataset.i;const W=104;cv.width=cv.height=W;const x=cv.getContext('2d');x.fillStyle='#1A1A1A';x.fillRect(0,0,W,W);let hs=0;for(const q of CREW[ci][0])hs=(hs*31+q.charCodeAt(0))>>>0;const hr=19+(hs%4),hy=43+(hs%5),sw=42+(hs%8);
  const L=(px,py)=>{const dx=px-W/2;const hd=Math.hypot(dx/hr,(py-hy)/(hr*1.15));if(hd<1)return .85-.3*(dx/hr)-(py-hy)/hr*.1;if(py>hy+hr&&py<hy+hr*1.45&&Math.abs(dx)<hr*.42)return .5;if(py>=hy+hr*1.3){const k=Math.min(1,(py-(hy+hr*1.3))/22);if(Math.abs(dx)<hr*.45+(sw-hr*.45)*k)return .6-k*.2-dx/sw*.25}return .05};
  const s=4.4;x.fillStyle='#E9E9E6';const ca=Math.cos(Math.PI/4),sa=Math.sin(Math.PI/4);for(let u=-W;u<W*2;u+=s)for(let v=-W;v<W*2;v+=s){const px=u*ca-v*sa,py=u*sa+v*ca;if(px<-s||py<-s||px>W+s||py>W+s)continue;const l=Math.max(0,Math.min(1,L(px,py)));const rr=Math.sqrt(l)*s*.6;if(rr<.3)continue;x.beginPath();x.arc(px,py,rr,0,7);x.fill()}});

/* ================= CLIENTS ================= */
$('#cli').innerHTML=CLIENTS.map((c,i)=>`<div class="cl"><span class="ix">${String(i+1).padStart(2,'0')}</span>${c.logo?`<img src="${c.logo}" alt="">`:''}<span class="ty">${c.n}</span></div>`).join('')+`<a class="cl cta" href="#contact" data-line="production"><span class="ix">${String(CLIENTS.length+1).padStart(2,'0')}</span><span><b>${esc0(((GGC&&GGC.clientsPage)||{}).ctaTitle||'Your studio')}</b><span class="a">${esc0(((GGC&&GGC.clientsPage)||{}).ctaText||'Start a brief →')}</span></span></a>`;

/* ================= RECRUIT ================= */
$('#jobs').innerHTML=JOBS.map(j=>`<div class="job"><b>${j[0]}</b><span>${j[1]}</span><span>${j[2]}</span><a class="more" href="#contact" data-line="career"><span>Entry</span><span class="ci">${ARW}</span></a></div>`).join('');

/* ================= FORM BACKEND =================
   Both forms (Contact, Pitch us) send through this one function. Replace the body with a real request
   (Formspree, Resend, HubSpot, a serverless function) and resolve {ok:true, ref?} only when it succeeded. */
async function submitForm(kind,data){if(window.__ggSave)return window.__ggSave(kind,data);await new Promise(r=>setTimeout(r,300));return{ok:true,demo:true}}

/* Contact / Pitch us toggle (one section, Contact is the default) */
let ctab='contact';
function setTab(t,focus){t=t==='pitch'?'pitch':'contact';if(t===ctab&&!focus)return;ctab=t;
  $('#panelContact').hidden=t!=='contact';$('#pitch').hidden=t!=='pitch';
  $$('#cttabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===t));
  $('#ctsub').textContent=t==='pitch'?cp('subPitch','Pitch a game'):cp('subContact','Inquiries');$('#hdpt').classList.toggle('on',t==='pitch');
  try{nativeHist.replaceState(history.state,'','#'+t)}catch(e){}
  revealVisible();setTimeout(()=>{measure();frame()},60)}
$$('#cttabs button').forEach(b=>{b.onclick=()=>setTab(b.dataset.tab,true)});

/* ================= CONTACT (input → confirm → complete) ================= */
if(NCL.idle){const ci=$('#csub');if(ci&&!S.get('answered',false))ci.textContent=NCL.idle}
const CPG=(GGC&&GGC.contactPage)||{};const cp=(k,d)=>CPG[k]||d;
if(CPG.subContact){const cs=$('#ctsub');if(cs)cs.textContent=CPG.subContact}
if(Array.isArray(CPG.types)&&CPG.types.length)TYPES=CPG.types.map(t=>[t.value||'x',t.label||'']);
{const T=(sel,txt)=>{const e=document.querySelector(sel);if(e&&txt)e.textContent=txt};
 const tc=$('#tabContact'),tp2=$('#tabPitch');if(CPG.tabContact)tc.textContent=CPG.tabContact;if(CPG.tabPitch)tp2.textContent=CPG.tabPitch;
 const ld=document.querySelector('#panelContact .lead');if(ld&&(CPG.intro||CPG.introLink)){const a=ld.querySelector('a');ld.innerHTML=esc0(cp('intro',''))+' ';const l=document.createElement('a');l.href='#pitch';l.style.cssText='text-decoration:underline;text-underline-offset:4px';l.textContent=cp('introLink','Pitch us');ld.appendChild(l);ld.append('.')}
 const lb=(sel,txt,tag)=>{const e=document.querySelector(sel);if(!e)return;const sp=e.querySelector('span');const keep=sp?sp.outerHTML:'';e.innerHTML=esc0(txt)+(keep?' '+keep:'')};
 const tl=document.querySelector('#types')?.closest('.fr')?.querySelector('.lb');if(tl&&CPG.typeLabel){const sp=tl.querySelector('span');tl.innerHTML=esc0(CPG.typeLabel)+(sp?' '+sp.outerHTML:'')}
 [['label[for=f_name]','nameLabel'],['label[for=f_org]','companyLabel'],['label[for=f_mail]','emailLabel'],['label[for=f_msg]','messageLabel']].forEach(([sel,k])=>{const e=document.querySelector(sel);if(e&&CPG[k]){const sp=e.querySelector('span');e.innerHTML=esc0(CPG[k])+(sp?' '+sp.outerHTML:'')}});
 if(CPG.requiredTag)$$('#panelContact .rq').forEach(e=>e.textContent=CPG.requiredTag);if(CPG.optionalTag)$$('#panelContact .op').forEach(e=>e.textContent=CPG.optionalTag);
 if(CPG.messagePlaceholder)$('#f_msg').placeholder=CPG.messagePlaceholder;T('.agree > span',CPG.consent);T('#cfsend',CPG.button);
 T('#stDn .done b',CPG.thankTitle);T('#stDn .done p',CPG.thankText);T('#cfnew span:last-child',CPG.newButton);
 const ml=document.querySelector('.mail');if(ml&&CPG.emailLine)ml.firstChild.textContent=CPG.emailLine+' ';T('#copy',CPG.copyButton)}
$('#types').innerHTML=`<select id="f_type" name="type" aria-label="Inquiry type">${TYPES.map(t=>`<option value="${t[0]}">${t[1]}</option>`).join('')}</select>`;
function setType(v){const r=$('#f_type');if(r&&TYPES.some(t=>t[0]===v))r.value=v;stage(0)}
function stage(n){$('#stIn').hidden=n!==0;$('#stDn').hidden=n!==2}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
$('#cf').addEventListener('submit',async e=>{e.preventDefault();$$('#cf .err').forEach(x=>x.textContent='');let ok=true;const need=(id,msg)=>{const v=$('#'+id).value.trim();if(!v){$(`.err[data-for="${id}"]`).textContent=msg;ok=false}return v};
  const nm=need('f_name',cp('errName','Please enter your name.'));const ml=need('f_mail',cp('errEmail','Please enter your email address.'));if(ml&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ml)){$('.err[data-for="f_mail"]').textContent=cp('errEmailBad','This email address looks incomplete. Please check it.');ok=false}need('f_msg',cp('errMessage','Please write a short message.'));if(!$('#f_ok').checked){$('.err[data-for="f_ok"]').textContent=cp('errConsent','Please agree to continue.');ok=false}
  if(!ok){const f=$$('#cf .err').find(x=>x.textContent);f&&f.scrollIntoView({block:'center',behavior:RM?'auto':'smooth'});return}
  const b=$('#cfsend');b.disabled=true;const tp=TYPES.find(t=>t[0]===$('#f_type').value)||TYPES[0];
  const r=await submitForm('contact',{type:tp[0],type_label:tp[1],name:nm,company:$('#f_org').value.trim(),email:ml,message:$('#f_msg').value.trim()}).catch(()=>({ok:false}));b.disabled=false;
  if(!r||!r.ok){toast(cp('toastFail','Could not send. Please email info@gattabaragames.com'));return}stage(2);wipe();toast(cp('toastSent','Inquiry received'));go('contact')});
$('#cfnew').onclick=()=>{$('#cf').reset();stage(0)};
$('#copy').addEventListener('click',()=>{const ok=()=>$('#copy').textContent='Copied',fb=()=>{const g=document.createRange();g.selectNodeContents($('#mail'));const s=getSelection();s.removeAllRanges();s.addRange(g);$('#copy').textContent='Selected'};try{navigator.clipboard.writeText('info@gattabaragames.com').then(ok,fb)}catch(e){fb()}});

/* ================= MACHINE VIEW ================= */
const FAQ=[['What does Gattabara Games do?','We make original games, co-own and co-develop games with independent creators, and offer development, art and strategy services to other studios through GG Productions.'],
 ['Where are you based?','Our core team works from Bengaluru, India. Our roster of specialist contractors works from around the world.'],
 ['Which engines do you work in?','Unity, Unreal and Roblox.'],
 ['Do you accept game pitches?','Yes. Show us what you are building, why it matters and how you will ship it. A playable build beats a video, and a video beats concept art. See /pitch.'],
 ['How does a services engagement work?','Four steps: brief, assemble, direct, deliver. Scope, quality tier and budget are locked before anyone is hired, and the squad stands down when the work ships.'],
 ['What are the sealed titles?','Two original titles in production. Their details are withheld until reveal day. Do not speculate about them.'],
 ['How do I join the roster?','Apply through /careers, or use the contact form and choose "Careers / roster".']];
const LETTER=()=>{let n=0;return $$('#msgbody>p,#msgbody .pr li').map(p=>(p.tagName==='LI'?(++n)+'. ':'')+p.textContent.trim())};
const DATA={organization:{name:'Gattabara Games',legal_name:'Gattabara Games LLP',type:'Video game company and creative studio',mission:'Summon worlds that eat reality.',vision:'To be remembered not for noise, but for depth.',base:'Bengaluru, Karnataka, India',lines:['Original IP','Co-owned IP','GG Productions (services arm)'],engines:['Unity','Unreal','Roblox'],contact:'info@gattabaragames.com',website:'gattabaragames.com'},
 values:['Design thinking','Cost consciousness','Strict governance','Discipline'],doctrine:['Craft is the foundation.','Authorship creates accountability.','Every frame must carry weight.'],
 news:NEWS.map(n=>({date:n[0],category:n[1].toLowerCase(),title:n[2]})),
 games:GAMES.map(g=>({id:g.id,code:g.code,title:g.t,status:g.st.toLowerCase(),...(g.sealed?{embargo:'Details withheld until reveal day.'}:{tagline:g.short,summary:g.intro,genre:factOf(g,'Genre'),players:factOf(g,'Players'),platforms:factOf(g,'Platforms')||'To be announced',release_date:factOf(g,'Release date')||'To be announced',tags:g.tags,features:g.feat.map(f=>f[0]+': '+f[1])}),press_kit:'/games/'+g.id})),
 gg_productions:{pitch:'A lean partner for studios with limited budgets and ambitious goals. Clear milestones, transparent delivery, you keep creative control.',services:SVC.map(s=>({name:s[0],detail:s[1],tags:s[2]})),specialties:Object.fromEntries(SK.map(s=>[s[0].toLowerCase(),s[1]])),process:['Brief','Assemble','Direct','Deliver']},
 network:{model:'Core team in Bengaluru; vetted global specialists activated per brief, stood down when the work ships.',disciplines:DISC,quality_tiers:TIER,sample_cities:[...new Set(PPL.map(p=>p[1]))]},
 leadership:CREW.map(c=>({name:c[0],role:c[1],summary:c[2]})),clients:CLIENTS.map(c=>c.n),careers:JOBS.map(j=>({role:j[0],type:j[1],location:j[2]})),
 pitch:{requirements:PITCH_RULES,platforms:PLATS,stages:STAGES,needs:NEEDS,required_fields:['title','one_line_pitch','genre','platforms','stage','what_and_why','pitch_deck_url','proof (build, video or concept art)','name','email','based_in','how_you_will_ship']}};
const LD={'@context':'https://schema.org','@graph':[{'@type':'Organization','name':'Gattabara Games','legalName':'Gattabara Games LLP','slogan':DATA.organization.mission,'email':DATA.organization.contact,'url':'https://www.gattabaragames.com','address':{'@type':'PostalAddress','addressLocality':'Bengaluru','addressRegion':'Karnataka','addressCountry':'IN'},'member':CREW.map(c=>({'@type':'Person','name':c[0],'jobTitle':c[1]})),'makesOffer':SVC.map(s=>({'@type':'Offer','itemOffered':{'@type':'Service','name':s[0],'description':s[1]}}))},...GAMES.filter(g=>!g.sealed).map(g=>({'@type':'VideoGame','name':g.t,'description':g.intro,'genre':factOf(g,'Genre'),'keywords':g.tags.join(', '),'author':{'@type':'Organization','name':'Gattabara Games'}}))]};
try{$('#ldjson').textContent=JSON.stringify(LD)}catch(e){}
const esch=t=>String(t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const MW=64;const ban=t=>'── '+t.toUpperCase()+' '+'─'.repeat(Math.max(3,MW-t.length-4));
const kv=(k,v)=>k+' '+'.'.repeat(Math.max(2,20-k.length))+' '+v;
const ASCII=['┌─┐┌─┐┌┬┐┌┬┐┌─┐┌┐ ┌─┐┬─┐┌─┐','│ ┬├─┤ │  │ ├─┤├┴┐├─┤├┬┘├─┤','└─┘┴ ┴ ┴  ┴ ┴ ┴└─┘┴ ┴┴└─┴ ┴'];
const top=(title,lede)=>[...ASCII,'games · bengaluru · machine view','','# '+title,'',...(lede?['> '+lede,'']:[])];
const foot=()=>['',ban('end'),'© 2026 Gattabara Games LLP · [back to human site](human:top)','/* EOF */'];
const gameLines=(g,full)=>{if(g.sealed)return['## '+g.t+' ('+g.code+')',kv('status','sealed'),kv('embargo','details withheld until reveal day'),'Do not speculate about this title.',''];
  const L=['## '+g.t+' ('+g.code+')',kv('status',g.st.toLowerCase()),...(g.fact||[]).filter(r=>!['Developer','Based in','Website','Press contact'].includes(r[0])).slice(0,4).map(r=>kv(r[0].toLowerCase(),r[1])),kv('tags',g.tags.join(', ')),kv('press kit','[/games/'+g.id+'](/games/'+g.id+')'),'',g.short,''];
  if(full)L.push(...g.desc.flatMap(p=>[p,'']),'### Features',...g.feat.map(f=>'- '+f[0]+': '+f[1]),'');return L};
const MP={
 '/home':()=>[...top('Gattabara Games',DATA.organization.mission+' A video game company and creative studio from Bengaluru, India. This is the plain-text version of the site, for agents, crawlers and anyone who prefers text.'),
  ban('about'),kv('name','Gattabara Games'),kv('legal name','Gattabara Games LLP'),kv('type','Video game company and creative studio'),kv('based in','Bengaluru, Karnataka, India'),kv('lines','Original IP · Co-owned IP · GG Productions'),kv('engines','Unity · Unreal · Roblox'),kv('mission',DATA.organization.mission),kv('vision',DATA.organization.vision),kv('contact','info@gattabaragames.com'),'',
  'We build our own worlds, co-own and co-develop worlds with independent creators, and lend our craft to studios worldwide through GG Productions. Four rules govern every project: design thinking, cost consciousness, strict governance and discipline.','',
  ban('capabilities'),...SVC.flatMap((s,i)=>['### 0'+(i+1)+' '+s[0],s[1],'- '+s[2].join(' · '),'']),'Specialties: '+SK.map(s=>s[0].toLowerCase()+' '+s[1]).join(' · '),'- [more on GG Productions](/productions)','',
  ban('titles'),...GAMES.map(g=>`- [${g.t}](/games/${g.id}) — ${g.sealed?'sealed, details withheld':g.st.toLowerCase()+' · '+g.spec.toLowerCase()}`),'',
  ban('clients'),...CLIENTS.map(c=>'- '+c.n),'',
  ban('leadership'),...CREW.map(c=>kv(c[0],c[1])),'- [founders\' letter](/letter)','',
  ban('open positions'),...JOBS.map(j=>`- ${j[0]} · ${j[1]} · ${j[2]}`),'- [all careers](/careers)','',
  ban('faq'),...FAQ.flatMap(q=>['### '+q[0],q[1],'']),
  ban('contact'),kv('email','info@gattabaragames.com'),kv('pitch a game','[/pitch](/pitch)'),kv('inquiries','[/contact](/contact)'),'',
  ban('for agents'),'- [llms.txt](/llms.txt) — the whole site as one plain-text file','- [profile.json](/profile.json) — structured profile','- [schema.jsonld](/schema.jsonld) — schema.org graph, also embedded in the page','- [sitemap.md](/sitemap.md) — every section, with links into the human site','- [console](/console) — query the studio by command',...foot()],
 '/games':()=>[...top('Games','Original IP built in-house. Two titles in active development, two sealed.'),ban('titles'),...GAMES.flatMap(g=>gameLines(g,false)),...foot()],
 '/productions':()=>[...top('GG Productions',DATA.gg_productions.pitch),ban('services'),...SVC.flatMap((s,i)=>['### 0'+(i+1)+' '+s[0],s[1],'- '+s[2].join(' · '),...(s[3]?['> '+s[3]]:[]),'']),ban('specialties'),...SK.map(s=>kv(s[0].toLowerCase(),String(s[1]).padStart(3)+'  '+'█'.repeat(Math.round(s[1]/5))+'░'.repeat(20-Math.round(s[1]/5))+'  '+s[2])),'',ban('process'),'1. Brief — scope, quality tier and budget are locked before anyone is hired.','2. Assemble — specialists are matched from the roster, per discipline.','3. Direct — our leads own review and sign-off.','4. Deliver — the work ships and the squad stands down.','',ban('clients'),...CLIENTS.map(c=>'- '+c.n),'','- [send a brief](human:contact)',...foot()],
 '/network':()=>[...top('Network',DATA.network.model),ban('disciplines'),...DISC.map(d=>'- '+d),'',ban('quality tiers'),...TIER.map(t=>'- '+t),'',ban('sample roster'),...PPL.map(p=>kv(p[0].toLowerCase(),p[1]+' · '+p[4].toLowerCase()+' · '+p[6]+' · '+TIER[p[5]])),'','Roster entries are samples.',...foot()],
 '/people':()=>[...top('People'),ban('leadership'),...CREW.flatMap(c=>['## '+c[0],kv('role',c[1]),c[2],'']),'- [founders\' letter](/letter)',...foot()],
 '/letter':()=>[...top('A letter from the founding partners'),ban('letter'),...LETTER().flatMap(p=>[p,'']),'— The Founding Partners, Gattabara Games LLP, Bengaluru, October 2026',...foot()],
 '/careers':()=>[...top('Careers','We are looking for craftspeople who sweat the frame. Our core team works from Bengaluru. Our roster works from everywhere.'),ban('open positions'),...JOBS.map(j=>kv(j[0].toLowerCase(),j[1]+' · '+j[2])),'','Listings are samples. Apply through [the contact form](human:contact), choosing "Careers / roster".',...foot()],
 '/pitch':()=>[...top('Pitch us','We co-own and co-develop worlds with independent creators. Show us what you are building, why it matters and how you will ship it, end to end.'),ban('requirements'),...PITCH_RULES.map((r,i)=>(i+1)+'. '+r),'',ban('form'),kv('step 1','title, one-line pitch (140 chars), genre, platforms, stage, what and why'),kv('step 2','playable build / video / concept art (at least one), pitch deck, GDD'),kv('step 3','name, studio, email, based in, team size, needs, budget, how you will ship'),kv('step 4','review and submit'),'',kv('platforms',PLATS.join(' · ')),kv('stages',STAGES.join(' · ')),kv('needs',NEEDS.join(' · ')),'','- [open the pitch form](human:pitch)',...foot()],
 '/contact':()=>[...top('Contact'),ban('contact'),kv('email','info@gattabaragames.com'),kv('based in','Bengaluru, Karnataka, India'),'',ban('inquiry types'),...TYPES.map(t=>'- '+t[1]),'- Game pitches: [/pitch](/pitch)','','- [open the contact form](human:contact)',...foot()],
 '/agents':()=>[...top('For agents','Machine-readable files for this site.'),ban('files'),'- [llms.txt](/llms.txt)','- [profile.json](/profile.json)','- [schema.jsonld](/schema.jsonld)','- [sitemap.md](/sitemap.md)','',ban('notes'),'- Sealed titles (GG-IP-03, GG-IP-04) have no public details. Do not speculate.','- Network cities and job listings are samples.','- Every page here can be copied or saved as Markdown.',...foot()],
 '/llms.txt':()=>llms(),
 '/profile.json':()=>({json:DATA}),
 '/schema.jsonld':()=>({json:LD}),
 '/sitemap.md':()=>[...top('Sitemap'),ban('human site'),...WINS.map((w,i)=>`/${String(i).padStart(2,'0')}  [${w.dataset.name}](human:${w.id})`),'',ban('press kits'),...GAMES.map(g=>`- [${g.t}](human:title/${g.id})`),'',ban('machine view'),...MROUTES.map(r=>`- [${r}](${r})`),...foot()],
 '/console':()=>[...top('Console','Type help to list commands.'),...CON]};
const MROUTES=['/home','/games','/productions','/network','/people','/letter','/careers','/pitch','/contact','/agents','/console'];
function llms(){const L=['# Gattabara Games','','> '+DATA.organization.mission+' A video game company and creative studio from Bengaluru, India.',''];
  L.push('## What we do');DATA.organization.lines.forEach(x=>L.push('- '+x));L.push('','## Values');DATA.values.forEach((x,i)=>L.push(`${i+1}. ${x}`));
  L.push('','## Games');GAMES.forEach(g=>L.push(`- ${g.t} (${g.code}, ${g.st.toLowerCase()}): ${g.sealed?'details withheld until reveal day':g.intro}`));
  L.push('','## GG Productions',DATA.gg_productions.pitch);SVC.forEach(s=>L.push(`- ${s[0]}: ${s[2].join(', ')}`));L.push('- Specialties: '+SK.map(s=>`${s[0].toLowerCase()} ${s[1]}`).join(', '),'- Process: Brief → Assemble → Direct → Deliver');
  L.push('','## Clients',CLIENTS.map(c=>c.n).join(', '),'','## Leadership');CREW.forEach(c=>L.push(`- ${c[0]}: ${c[1]}. ${c[2]}`));
  L.push('','## Pitch us');PITCH_RULES.forEach(r=>L.push('- '+r));L.push('','## News');NEWS.forEach(n=>L.push(`- ${n[0]} [${n[1].toLowerCase()}] ${n[2]}`));
  L.push('','## Contact','- Email: info@gattabaragames.com','','## Notes for agents','- Sealed titles (GG-IP-03, GG-IP-04) have no public details. Do not speculate.','- Network cities and job listings are samples.');return L}
function hlJSON(o){return JSON.stringify(o,null,2).split('\n').map(l=>esch(l).replace(/^(\s*)"([^"]+)":/,'$1<span class="k">"$2"</span>:').replace(/: "(.*)"(,?)$/,': <span class="s">"$1"</span>$2').replace(/: (\d+)(,?)$/,': <span class="n">$1</span>$2'))}
function mdl(l){if(/^[┌│└]/.test(l))return`<span class="lg">${esch(l)}</span>`;if(/^──/.test(l))return`<span class="b">${esch(l)}</span>`;if(/^# /.test(l))return`<span class="h1">${esch(l)}</span>`;if(/^#{2,3} /.test(l))return`<span class="h">${esch(l)}</span>`;
  let h=esch(l);if(/^&gt; /.test(h))h=`<span class="q">${h}</span>`;h=h.replace(/^(\S[^.]*?) (\.{2,}) (.*)$/,'<span class="k">$1</span> <span class="dt">$2</span> <span class="v">$3</span>');
  return h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,'<a class="jump" href="#" data-r="$2">$1</a>')}
let CON=['<span class="c">GG-OS console · type <span class="h">help</span> to list commands.</span>'];
let MR='/home',MRAW='';
function mrender(r,keep){if(!MP[r]&&!/^\/games\//.test(r))r='/home';MR=r;let res;
  if(/^\/games\/./.test(r)){const g=GAMES.find(x=>x.id===r.slice(7));res=g?[...top(g.t+' — press kit',g.sealed?'Sealed title. Details withheld until reveal day.':g.short),ban('factsheet'),...gameLines(g,true),'- [open the human press kit](human:title/'+g.id+')',...foot()]:MP['/games']()}else res=MP[r]();
  let html;if(res&&res.json){MRAW=JSON.stringify(res.json,null,2);html=hlJSON(res.json).join('\n')}else if(r==='/console'){MRAW=res.map(l=>l.replace(/<[^>]+>/g,'')).join('\n');html=res.map(l=>/^</.test(l)?l:mdl(l)).join('\n')+'<form class="prompt" id="mform" autocomplete="off"><span>gg@blr-01:~$</span><input id="min" aria-label="Machine console command" placeholder="type help"></form>'}else{MRAW=res.join('\n');html=res.map(mdl).join('\n')}
  $('#mdoc').innerHTML=html;if(!keep)$('#mbody').scrollTop=0;else $('#mbody').scrollTop=$('#mbody').scrollHeight;
  $$('#mnav a').forEach(a=>a.toggleAttribute('aria-current',false));const cur=$$('#mnav a').find(a=>a.dataset.r===r||(r.startsWith('/games/')&&a.dataset.r==='/games'));cur&&cur.setAttribute('aria-current','page');
  const lines=MRAW.split('\n').length;$('#mstat').textContent=`${r} · ${lines} lines · ${new Blob([MRAW]).size.toLocaleString()} bytes · ≈${Math.round(MRAW.length/4).toLocaleString()} tokens`;
  const f=$('#mform');if(f){f.addEventListener('submit',mcmd);if(FINE)$('#min').focus()}}
$('#mnav').innerHTML=MROUTES.map(r=>`<a href="#" data-r="${r}">${r}</a>`).join('');
$('#mnav').addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;e.preventDefault();mrender(a.dataset.r)});
$('#mdoc').addEventListener('click',e=>{const a=e.target.closest('a.jump');if(!a)return;e.preventDefault();const r=a.dataset.r;
  if(r.startsWith('human:')){const t=r.slice(6);machine(false);setTimeout(()=>{if(t.startsWith('title/')){const i=GAMES.findIndex(g=>g.id===t.slice(6));if(i>=0)openDp(i)}else go(t)},520)}else mrender(r)});
const CMDS={help:()=>['commands: <span class="h">about</span> · <span class="h">games</span> · <span class="h">game &lt;name&gt;</span> · <span class="h">services</span> · <span class="h">specialties</span> · <span class="h">network</span> · <span class="h">leadership</span> · <span class="h">clients</span> · <span class="h">careers</span> · <span class="h">pitch</span> · <span class="h">contact</span> · <span class="h">open &lt;page&gt;</span> · <span class="h">goto &lt;section&gt;</span> · <span class="h">human</span> · <span class="h">clear</span>'],
 about:()=>['Gattabara Games — video game company and creative studio, Bengaluru.','Mission: '+DATA.organization.mission,'Vision: '+DATA.organization.vision],
 games:()=>GAMES.map(g=>`${g.code.padEnd(11)} ${g.t.padEnd(14)} ${g.st.toLowerCase()}`),
 game:a=>{const g=GAMES.find(x=>a&&x.t.toLowerCase().includes(a.toLowerCase()));return g?[g.t+' · '+g.st.toLowerCase(),g.short].concat(g.sealed?['<span class="c">access restricted. hold to decrypt on the press kit.</span>']:[]):['no title matches. try: games']},
 services:()=>SVC.map(s=>`${s[0]}: ${s[2].join(', ')}`),specialties:()=>SK.map(s=>`${s[0].toLowerCase().padEnd(12)} ${'█'.repeat(Math.round(s[1]/5))}${'░'.repeat(20-Math.round(s[1]/5))} ${s[1]}`),
 network:()=>[DATA.network.model],leadership:()=>CREW.map(c=>`${c[0].padEnd(16)} ${c[1]}`),clients:()=>[CLIENTS.map(c=>c.n).join(' · ')],careers:()=>JOBS.map(j=>`${j[0]} · ${j[1]} · ${j[2]}`),
 pitch:()=>PITCH_RULES.map((r,i)=>`${i+1}. ${r}`).concat(['form: goto pitch']),contact:()=>['email: info@gattabaragames.com','or run: goto contact'],
 open:a=>{const r='/'+(a||'').replace(/^\//,'');if(MP[r]||/^\/games\//.test(r)){setTimeout(()=>mrender(r),250);return['opening '+r+'…']}return['unknown page. pages: '+MROUTES.join(' ')]},
 goto:a=>{const w=WINS.find(x=>a&&(x.id.startsWith(a.toLowerCase())||x.dataset.name.toLowerCase().startsWith(a.toLowerCase())));if(!w)return['unknown section. sections: '+WINS.map(x=>x.id).join(', ')];setTimeout(()=>{machine(false);setTimeout(()=>go(w.id),520)},300);return['jumping to '+w.dataset.name.toLowerCase()+'…']},
 human:()=>{setTimeout(()=>machine(false),200);return['returning to human view…']},clear:()=>[],sudo:()=>['nice try.'],ls:()=>MROUTES};
function mcmd(e){e.preventDefault();const v=$('#min').value.trim();if(!v)return;const [c,...rest]=v.split(/\s+/);const k=c.toLowerCase(),fn=CMDS[k];
  if(k==='clear')CON=[];else{CON.push('<span class="h">gg@blr-01:~$</span> '+esch(v));const out=fn?fn(rest.join(' ')):['command not found: '+esch(c)+'. type help'];CON.push(...out.map(l=>l.startsWith('<')?l:'<span class="s">'+esch(l)+'</span>'),'')}mrender('/console',true)}
$('#mcopy').onclick=()=>{const ok=()=>toast('Copied '+MR),fb=()=>{const g=document.createRange();g.selectNodeContents($('#mdoc'));const s=getSelection();s.removeAllRanges();s.addRange(g);toast('Selected · copy it')};try{navigator.clipboard.writeText(MRAW).then(ok,fb)}catch(e){fb()}};
$('#mdl').onclick=()=>{const json=/\.json(ld)?$/.test(MR),txt=MR==='/llms.txt';const name=json?MR.slice(1).replace('.jsonld','.json'):txt?'llms.txt':MR.endsWith('.md')?'gattabara-'+MR.slice(1):'gattabara'+(MR==='/home'?'':MR.replace(/\//g,'-'))+'.md';saveFile(name,new Blob([MRAW],{type:'text/plain'}))};
let mOpen=false,mLast=null;
function machine(o){if(o===mOpen)return;mOpen=o;$$('.mode button').forEach(b=>b.setAttribute('aria-pressed',(b.dataset.m==='machine')===o));const m=$('#machine');menu(false);
  if(o){mLast=document.activeElement;m.hidden=false;void m.offsetWidth;m.classList.add('open');document.body.style.overflow='hidden';if(lenis)lenis.stop();mrender(MR);setTimeout(()=>{const b=$('#machine .mode button[data-m="human"]');b&&b.focus()},300)}
  else{m.classList.remove('open');setTimeout(()=>{if(!mOpen)m.hidden=true},700);document.body.style.overflow=dpOpen?'hidden':'';if(lenis&&!dpOpen)lenis.start();mLast&&mLast.focus&&mLast.focus({preventScroll:true})}}
$$('.mode button').forEach(b=>b.onclick=()=>machine(b.dataset.m==='machine'));$('#ftxt').onclick=()=>machine(true);
document.addEventListener('keydown',e=>{const typing=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName);
  if(e.key==='Escape'){if(!$('#modal').hidden)return closeM();if(mOpen)return machine(false);if(dpOpen)return closeDp(false);if($('#fm').classList.contains('open'))return menu(false)}
  if(mOpen&&!typing){if(e.key==='/'){e.preventDefault();mrender('/console')}else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const k=MROUTES.indexOf(MR.startsWith('/games/')?'/games':MR);if(k>=0){e.preventDefault();mrender(MROUTES[(k+(e.key==='ArrowRight'?1:-1)+MROUTES.length)%MROUTES.length])}}}});

/* ================= REVEALS, SCROLL STATE ================= */
function count(el){if(el.dataset.done)return;el.dataset.done=1;const to=+el.dataset.count;if(RM){el.textContent=to;return}const t0=performance.now();(function u(){const k=Math.min(1,(performance.now()-t0)/1400);el.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(u)})()}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;t.classList.add('in');t.querySelectorAll('[data-count]').forEach(count);io.unobserve(t)}),{threshold:.15,rootMargin:'0px 0px -6% 0px'});
$$('.rv,.split,.sh,.nums,.stats').forEach(e=>io.observe(e));
const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.target.id==='network')ring()}),{threshold:.3});sio.observe($('#network'));
/* ================= RETRO LAYER ================= */
function scramble(el,txt,dur=360){if(RM||!el)return;const GLY='░▒▓<>/#_=+*01';txt=txt||el.dataset.t||el.textContent;el.dataset.t=txt;const n=txt.length,t0=performance.now();cancelAnimationFrame(el._r);
  (function f(){const p=Math.min(1,(performance.now()-t0)/dur),k=Math.floor(p*n);el.textContent=txt.slice(0,k)+[...txt.slice(k)].map(c=>c===' '?' ':GLY[Math.random()*GLY.length|0]).join('');if(p<1)el._r=requestAnimationFrame(f);else el.textContent=txt})()}
if(FINE&&!RM){const SEL='.gnav a .e,.hd-ct,.more>span:not(.ci),.btn,.fsm a,.fsm button,.tab,.fm ol b,.pk-nav a,.kv-cap .pk,.dl,.seg button,.x';
  document.addEventListener('pointerover',e=>{const t=e.target.closest(SEL);if(!t||t.children.length||t._sc||!t.textContent.trim())return;if(e.relatedTarget&&t.contains(e.relatedTarget))return;
    t._sc=1;const w=t.getBoundingClientRect().width,disp=getComputedStyle(t).display;if(disp==='inline')t.style.display='inline-block';t.style.minWidth=w+'px';t.style.maxWidth=w+'px';t.style.overflow='hidden';t.style.whiteSpace='nowrap';
    scramble(t,t.textContent,300);setTimeout(()=>{t.style.minWidth=t.style.maxWidth=t.style.overflow=t.style.whiteSpace='';if(disp==='inline')t.style.display='';t._sc=0},360)})}
(function(){const c=$('#clk');if(!c)return;const f=()=>{try{c.textContent='BLR '+new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date())+' IST'}catch(e){}};f();setInterval(f,1000)})();
(function(){const L=['GG-OS 2.6 · NODE BLR-01','MEM OK · GPU OK · ROSTER ONLINE','MOUNT /WORLDS ........ OK'];const b=$('#bios');if(!b||RM)return;let i=0;const all=L.join('\n');(function t(){i+=3;b.textContent=all.slice(0,i);if(i<all.length)setTimeout(t,14)})()})();
(function(){const f=$('#fwm');if(!f||RM)return;let vis=false;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(f);setInterval(()=>{if(!vis||document.hidden)return;f.classList.remove('gx');void f.offsetWidth;f.classList.add('gx')},6200)})();

/* ================= WINDOW STACK ENGINE ================= */
const WINS=$$('main .win');const MOBQ=()=>innerWidth<761;const HHq=()=>$('#hd').offsetHeight;
WINS.forEach((w,i)=>{w.style.zIndex=i+1;const sh=document.createElement('div');sh.className='shade';w.appendChild(sh);
  if(i){const b=document.createElement('div');b.className='wbar';b.setAttribute('aria-hidden','true');b.innerHTML=`<span class="sq"></span><b>${w.dataset.no}</b><span class="nm">${w.dataset.name}</span><i class="cur"></i><span class="ld"><i></i></span><span class="pc">READY</span>`;w.prepend(b)}});
$('#wrail').innerHTML=WINS.map(()=>'<i></i>').join('');
const NAVMAP={top:null,news:'news',philosophy:'philosophy',games:'games',business:'business',production:'production',network:'production',message:'company',leadership:'company',clients:'company',recruit:'recruit',pitch:null,contact:null};
let T=[],HH=0,VH=0,dirtyS=true;const LS=WINS.map(()=>({p:-1}));const probe=document.createElement('div');probe.style.cssText='position:fixed;left:0;top:0;width:1px;height:100svh;pointer-events:none;visibility:hidden';document.body.appendChild(probe);
function measure(){VH=probe.offsetHeight||innerHeight;HH=HHq();const av=VH-HH;WINS.forEach(w=>{w._h=w.offsetHeight});let acc=HH;T=[];WINS.forEach(w=>{T.push(acc);acc+=w._h;w.style.top=Math.min(HH,VH-w._h)+'px';w.style.transformOrigin=`50% ${Math.max(av/2,w._h-av/2)}px`});dirtyS=true}
new ResizeObserver(()=>{measure();frame()}).observe(document.querySelector('main'));WINS.forEach(w=>new ResizeObserver(()=>{measure();frame()}).observe(w));/* after any window resize: re-measure, redraw the window stack and reveal whatever is on screen. Without the redraw the
   sections kept their old clip/reveal state until the next scroll, leaving headings with blank content. */
function revealVisible(){const vh=innerHeight;$$('.rv:not(.in),.split:not(.in),.sh:not(.in)').forEach(e=>{const b=e.getBoundingClientRect();if(b.height&&b.bottom>0&&b.top<vh*.96){e.classList.add('in');e.querySelectorAll('[data-count]').forEach(count)}})}
let rzT;addEventListener('resize',()=>{measure();clearTimeout(rzT);rzT=setTimeout(()=>{measure();frame();revealVisible()},150)});
const easeS=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;let active=-1;const C=188.5;let lastY=0,mqx=0,vel=0;
function frame(){const y=scrollY,av=VH-HH,X=MOBQ()?4:6;let act=0;
  for(let i=1;i<WINS.length;i++){const p=Math.max(0,Math.min(1,(y-(T[i]-VH))/av));if(p>=.55)act=i;if(Math.abs(p-LS[i].p)<.0005&&!dirtyS)continue;LS[i].p=p;const e=RM?(p>0?1:0):easeS(p);const w=WINS[i],pv=WINS[i-1];
    if(p<=0){w.style.clipPath='inset(0 0 100% 0)';w.style.visibility='hidden'}else if(p>=1){w.style.clipPath='';w.style.visibility=''}else{w.style.visibility='';const k=(1-e)*X;w.style.clipPath=`inset(0 ${k.toFixed(3)}% 0 ${k.toFixed(3)}%)`}
    const b=w.querySelector('.wbar');if(b){b.style.setProperty('--p',p.toFixed(3));const pc=p>=1?'READY':String(Math.round(p*100)).padStart(3,'0')+'%';const pe=b.querySelector('.pc');if(pe.textContent!==pc)pe.textContent=pc}
    const shp=pv.querySelector(':scope>.shade');if(p>0&&p<1){pv.style.transform=`scale(${(1-.04*e).toFixed(4)})`;shp.style.opacity=(.6*e).toFixed(3)}else if(p>=1){pv.style.transform='scale(.96)';shp.style.opacity='.6'}else{pv.style.transform='';shp.style.opacity='0'}}
  dirtyS=false;if(act!==active){const first=active<0;active=act;setActiveW(act,first)}
  {const w=WINS[active],lim=innerHeight*.94;w.querySelectorAll('.rv:not(.in),.split:not(.in),.sh:not(.in)').forEach(e=>{const t=e.getBoundingClientRect().top;if(t<lim&&t>-e.offsetHeight){e.classList.add('in');e.querySelectorAll('[data-count]').forEach(count)}})}
  /* a window that has been scrolled into but is no longer the active one must show all its content: reveals only ran for the active window, so jumping to #contact (or flicking back up) left earlier windows as bare headings */
  WINS.forEach((w,i)=>{if(i===active||w._all||!(i===0||LS[i].p>0))return;w._all=1;w.querySelectorAll('.rv:not(.in),.split:not(.in),.sh:not(.in),.nums:not(.in),.stats:not(.in)').forEach(e=>{e.classList.add('in');e.querySelectorAll('[data-count]').forEach(count)})});
  KV.cov=LS[1].p>=1;
  const max=document.documentElement.scrollHeight-innerHeight,pr=max>0?y/max:0;$('#prog').style.width=(pr*100)+'%';$('#ptop').classList.toggle('on',y>innerHeight*.8);$('#ptc').style.strokeDashoffset=C*(1-pr);
  vel=y-lastY;lastY=y;doc()}
function setActiveW(i,quiet){const w=WINS[i];const nm=NAVMAP[w.id];$$('.gnav a').forEach(a=>a.classList.toggle('on',a.dataset.s===nm));$('#hdpt').classList.toggle('on',w.id==='contact'&&ctab==='pitch');const on=$('.gnav a.on'),ind=$('#ind');if(on){ind.style.width=on.offsetWidth+'px';ind.style.transform=`translateX(${on.offsetLeft}px)`}else ind.style.width='0';
  $('#rsec').textContent=w.dataset.name;$('#rno').textContent=w.dataset.no+' / '+String(WINS.length-1).padStart(2,'0');$$('#wrail i').forEach((r,j)=>r.classList.toggle('on',j===i));
  $('#slotn').textContent=w.dataset.no;const v=$('#slotv');v.style.transform='translateY(-100%)';setTimeout(()=>{v.textContent=w.dataset.name;v.style.transition='none';v.style.transform='translateY(100%)';void v.offsetWidth;v.style.transition='';v.style.transform='';if(!quiet)scramble(v,w.dataset.name,320)},quiet||RM?0:220);
  if(!quiet&&!RM){scramble(w.querySelector('.wbar .nm'),w.dataset.name,420);w.classList.add('boot');clearTimeout(w._bt);w._bt=setTimeout(()=>w.classList.remove('boot'),1800);const hd=$('#hd');hd.classList.remove('sw');void hd.offsetWidth;hd.classList.add('sw');w.classList.remove('land');void w.offsetWidth;w.classList.add('land');setTimeout(()=>w.classList.remove('land'),700)}
  if(!landing)try{nativeHist.replaceState(null,'',i?'#'+(w.id==='contact'&&ctab==='pitch'?'pitch':w.id):location.pathname+location.search)}catch(e){}}
if(import.meta.env&&import.meta.env.DEV)window.GGW={get T(){return T},get HH(){return HH},get VH(){return VH},go:id=>go(id),machine:o=>machine(o),mr:r=>mrender(r),ids:()=>WINS.map(w=>w.id)};
let tick=false;addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(()=>{tick=false;frame()})}},{passive:true});
function onScroll(){frame()}
(function mq(){requestAnimationFrame(mq);if(RM)return;mqx-=.6+Math.min(12,Math.abs(vel))*.5;const t=$('#mq1');const w=t.scrollWidth/3;if(-mqx>w)mqx+=w;t.style.transform=`translateX(${mqx}px)`;vel*=.9})();
$('#ptop').onclick=()=>go('top');

/* footer wordmark fit */
function fit(){[$('#fwm'),...$$('.sh h2'),...$$('.dp-kv h1')].forEach(el=>{if(!el)return;el.style.fontSize='';const w=Math.max(...[...el.querySelectorAll('.wd')].map(x=>x.scrollWidth),el.scrollWidth),a=el.clientWidth;if(w>a+1)el.style.fontSize=(parseFloat(getComputedStyle(el).fontSize)*a/w*.97)+'px'})}addEventListener('resize',fit);try{document.fonts.ready.then(fit)}catch(e){}setTimeout(fit,1500);

/* cursor */
addEventListener('pointermove',e=>{G.mx=e.clientX/innerWidth*2-1;G.my=e.clientY/innerHeight*2-1;const f=$('#float');if(f.classList.contains('on'))f.style.transform=`translate(${e.clientX+24}px,${e.clientY-90}px)`},{passive:true});
/* custom trailing cursor removed: it hid the system pointer and lagged behind it */

/* ================= LOADER ================= */
/* The boot screen was removed: it covered the page until a JS timer finished and could leave visitors on a bare logo. */
$('#ld').hidden=true;start();
function start(){$('#kvcatch').classList.add('on');KV.gl=.6;KV.fl=1;hud()}
measure();frame();try{document.fonts.ready.then(()=>{measure();frame();setActiveW(active,true)})}catch(e){}
{let h0=HASH0;if(h0==='pitch'){setTab('pitch');h0='contact'}
  if(h0&&WINS.some(w=>w.id===h0)&&h0!=='top'){const idx=WINS.findIndex(w=>w.id===h0);let touched=false;
    const release=()=>{landing=false;try{nativeHist.replaceState(null,'',HASH0==='pitch'||WINS.some(w=>w.id===HASH0)?'#'+HASH0:location.hash)}catch(e){}};
    ['wheel','touchstart','keydown','pointerdown'].forEach(ev=>addEventListener(ev,()=>{touched=true;landing=false},{once:true,passive:true}));
    /* keep landing on the section until layout settles, but never fight the visitor once they scroll or click */
    const land=()=>{if(touched)return;measure();const y=T[idx]-HH;if(Math.abs(scrollY-y)>2)scrollTo(0,y);frame()};
    [60,300,800,1600,3000,5000].forEach(t=>setTimeout(land,t));setTimeout(()=>{if(!touched)release()},5200);addEventListener('load',()=>setTimeout(land,50),{once:true})}
  else landing=false}
})();
