/* ============================== ШПАРГАЛКА: префлоп 9-max MTT ============================== */
/* Диапазоны: упрощённая солверная логика для 9-max MTT с анте + поправка на лузовые столы, где много лимпуют и коллируют. */
const CH_POS={
  open:[['E','UTG–MP'],['M','LJ–HJ'],['CO','CO'],['BTN','BTN'],['SB','SB']],
  limp:[['E','UTG–MP'],['M','LJ–HJ'],['CO','CO'],['BTN','BTN'],['SB','SB'],['BB','BB']],
  raise:[['IP','После рейзера'],['SB','SB'],['BB','BB']],
  sqz:[['IP','После коллеров'],['SB','SB'],['BB','BB']],
};
const CH_DATA={
  open:{
    deep:{E:{r:'55+,A8s+,A5s,KTs+,QTs+,JTs,T9s,AJo+,KQo'},M:{r:'33+,A2s+,K9s+,Q9s+,J9s+,T9s,98s,87s,ATo+,KJo+,QJo'},CO:{r:'22+,A2s+,K7s+,Q9s+,J9s+,T8s+,98s,87s,76s,A9o+,KTo+,QTo+,JTo'},BTN:{r:'22+,A2s+,K2s+,Q6s+,J7s+,T7s+,97s+,86s+,75s+,65s,54s,A2o+,K8o+,Q9o+,J9o+,T9o'},SB:{r:'22+,A2s+,K5s+,Q8s+,J8s+,T8s+,98s,87s,76s,65s,A5o+,K9o+,QTo+,JTo'}},
    mid:{E:{r:'66+,A9s+,A5s,KTs+,QJs,AJo+,KQo'},M:{r:'44+,A7s+,A5s,K9s+,QTs+,JTs,T9s,ATo+,KJo+'},CO:{r:'22+,A2s+,K8s+,Q9s+,J9s+,T9s,98s,87s,A9o+,KTo+,QJo'},BTN:{r:'22+,A2s+,K5s+,Q8s+,J8s+,T8s+,97s+,87s,76s,65s,A2o+,K9o+,QTo+,JTo'},SB:{r:'22+,A2s+,K5s+,Q8s+,J8s+,T8s+,98s,87s,76s,A5o+,K9o+,QTo+,JTo'}},
    short:{E:{r:'66+,A9s+,ATo+,KQs'},M:{r:'44+,A7s+,A9o+,KTs+,KQo,QJs'},CO:{r:'22+,A2s+,A7o+,K9s+,KJo+,QTs+,JTs'},BTN:{r:'22+,A2s+,A2o+,K5s+,K9o+,Q8s+,QTo+,J8s+,JTo,T8s+,98s,87s,76s'},SB:{r:'22+,A2s+,A2o+,K2s+,K5o+,Q5s+,Q9o+,J7s+,J9o+,T7s+,T9o,97s+,86s+,76s,65s'}},
  },
  limp:{
    deep:{
      E:{1:{r:'88+,ATs+,KJs+,QJs,AJo+,KQo',c:'22-77,A2s-A9s,KTs,QTs,JTs,T9s,98s,87s,76s'},2:{r:'99+,AJs+,KQs,AQo+',c:'22-88,A2s-ATs,KTs,KJs,QTs,QJs,JTs,T9s,98s,87s,76s,65s'}},
      M:{1:{r:'77+,A9s+,KTs+,QTs+,JTs,ATo+,KJo+',c:'22-66,A2s-A8s,K9s,Q9s,J9s,T9s,98s,87s,76s,65s'},2:{r:'88+,ATs+,KJs+,AJo+,KQo',c:'22-77,A2s-A9s,K9s,KTs,Q9s,QTs,QJs,J9s,JTs,T8s,T9s,97s,98s,87s,76s,65s,54s'}},
      CO:{1:{r:'55+,A7s+,A5s,K9s+,Q9s+,J9s+,T9s,ATo+,KTo+,QJo',c:'22-44,A2s-A4s,A6s,K6s-K8s,Q8s,J8s,T8s,98s,87s,76s,65s,54s'},2:{r:'77+,A9s+,KTs+,QJs,AJo+,KQo',c:'22-66,A2s-A8s,K7s-K9s,Q9s,QTs,J9s,JTs,T8s,T9s,97s,98s,86s,87s,76s,65s,54s'}},
      BTN:{1:{r:'44+,A2s+,K8s+,Q9s+,J9s+,T9s,A9o+,KTo+,QTo+,JTo',c:'22,33,K5s-K7s,Q7s,Q8s,J7s,J8s,T7s,T8s,97s,98s,86s,87s,76s,65s,54s'},2:{r:'66+,A8s+,A5s,KTs+,QTs+,JTs,ATo+,KJo+',c:'22-55,A2s-A4s,A6s,A7s,K5s-K9s,Q8s,Q9s,J8s,J9s,T8s,T9s,97s,98s,86s,87s,75s,76s,65s,54s'}},
      SB:{1:{r:'88+,ATs+,KJs+,QJs,AJo+,KQo',c:'22-77,A2s-A9s,K2s-KTs,Q8s-QTs,J8s-JTs,T8s,T9s,97s,98s,86s,87s,76s,65s,54s,A9o,ATo,KTo,KJo,QTo,QJo,JTo'},2:{r:'99+,AJs+,KQs,AQo+',c:'22-88,A2s-ATs,K2s-KJs,Q8s-QJs,J8s-JTs,T8s,T9s,97s,98s,86s,87s,76s,65s,54s,A9o-AJo,KTo-KQo,QTo,QJo,JTo'}},
      BB:{1:{r:'99+,ATs+,KJs+,AJo+,KQo',rest:true},2:{r:'TT+,AJs+,KQs,AQo+',rest:true}},
    },
    short:{
      E:{1:{r:'77+,ATs+,AJo+,KQs'},2:{r:'88+,AJs+,AQo+,KQs'}},M:{1:{r:'66+,A9s+,ATo+,KJs+,KQo'},2:{r:'77+,ATs+,AJo+,KQs'}},
      CO:{1:{r:'22+,A7s+,A9o+,KTs+,KQo,QJs'},2:{r:'55+,A9s+,ATo+,KJs+,KQo'}},BTN:{1:{r:'22+,A5s+,A8o+,K9s+,KJo+,QTs+,JTs'},2:{r:'55+,A8s+,ATo+,KTs+,KQo,QJs'}},
      SB:{1:{r:'22+,A7s+,A9o+,KTs+,KQo,QJs'},2:{r:'55+,A9s+,ATo+,KJs+,KQo'}},BB:{1:{r:'55+,A8s+,ATo+,KJs+,KQo',rest:true},2:{r:'66+,A9s+,AJo+,KQs',rest:true}},
    },
  },
  raise:{
    deep:{
      E:{IP:{r:'QQ+,AKs,AKo,A5s',c:'22-JJ,ATs-AQs,KJs,KQs,QJs,JTs,T9s,98s,AQo'},SB:{r:'QQ+,AKs,AKo',c:'99-JJ,AQs'},BB:{r:'QQ+,AKs,AKo',c:'22-JJ,A2s-AQs,K9s+,Q9s+,J9s+,T8s+,97s+,86s+,75s+,65s,54s,AJo,AQo,KJo,KQo,QJo'}},
      L:{IP:{r:'TT+,AQs+,AKo,AQo,A5s,A4s,KQs',c:'22-99,A9s-AJs,KTs,KJs,QTs,QJs,J9s,JTs,T9s,98s,87s,76s,AJo,KQo'},SB:{r:'77+,A9s+,KTs+,QTs+,JTs,AJo+,KQo,A5s,A4s',c:''},BB:{r:'JJ+,AQs+,AKo,AQo,A5s,A4s',c:'22-TT,A2s-AJs,K2s-KQs,Q5s-QJs,J6s-JTs,T6s+,96s+,85s+,74s+,64s+,53s+,43s,A2o-AJo,K8o-KQo,Q9o+,J9o+,T8o+,98o,87o'}},
    },
    short:{
      E:{IP:{r:'TT+,AQs+,AKo,AQo'},SB:{r:'TT+,AQs+,AKo,AQo'},BB:{r:'99+,AJs+,AQo+,KQs'}},
      L:{IP:{r:'55+,A9s+,ATo+,KJs+,KQo'},SB:{r:'55+,A8s+,ATo+,KTs+,KQo'},BB:{r:'44+,A7s+,A9o+,KTs+,KJo+,QJs'}},
    },
  },
  sqz:{
    deep:{
      E:{IP:{r:'QQ+,AKs,AKo',c:'22-JJ,AJs,AQs,KJs,KQs,QJs,JTs,T9s,98s,87s,76s,A5s,A4s'},SB:{r:'QQ+,AKs,AKo',c:'22-JJ,A2s-AQs,KJs,KQs,QJs,JTs,T9s,98s,87s,76s'},BB:{r:'QQ+,AKs,AKo',c:'22-JJ,A2s-AQs,K8s+,Q9s+,J9s+,T8s+,97s+,86s+,75s+,64s+,54s,AJo,AQo,KJo,KQo,QJo'}},
      L:{IP:{r:'TT+,AJs+,KQs,AKo,AQo',c:'22-99,A2s-ATs,KTs,KJs,QTs,QJs,JTs,T9s,98s,87s,76s,65s'},SB:{r:'TT+,AJs+,KQs,AQo+',c:'22-99,A2s-ATs,KTs,KJs,QTs,QJs,JTs,T9s,98s,87s,76s,65s'},BB:{r:'TT+,AJs+,KQs,AQo+',c:'22-99,A2s-ATs,K2s-KJs,Q6s-QJs,J7s-JTs,T7s+,96s+,85s+,74s+,64s+,53s+,43s,A8o-AJo,KTo-KQo,QTo,QJo,JTo,T9o'}},
    },
    short:{
      E:{IP:{r:'99+,AJs+,AQo+,KQs'},SB:{r:'99+,AJs+,AQo+,KQs'},BB:{r:'88+,ATs+,AJo+,KQs'}},
      L:{IP:{r:'55+,A8s+,ATo+,KTs+,KQo,QJs'},SB:{r:'55+,A8s+,ATo+,KTs+,KQo,QJs'},BB:{r:'44+,A7s+,A9o+,KTs+,KJo+,QJs'}},
    },
  },
};
/* средний стек (20–40бб): спекулятивные руки теряют ценность — меньше дешёвых коллов */
const CH_MID_DROP='54s,64s,65s,75s,74s,86s,85s,97s,96s,T7s,T6s,J7s,J6s,Q7s,Q6s,Q5s,K2s-K7s,53s,43s';
const CH_MID_DROP_IP_PAIRS='22-55';
const CH_ALL=(()=>{const s=new Set();for(let i=0;i<13;i++)for(let j=0;j<13;j++)s.add(handAt(i,j));return s})();
const CS={sit:'limp',pos:'BTN',op:'L',n:'1',st:'deep',sel:null,mode:'chart',quiz:null};
function chartFor(sit,pos,op,n,st){
  let d,base;
  if(sit==='open'){d=CH_DATA.open[st][pos];base={r:d.r,c:''}}
  else if(sit==='limp'){const S2=st==='short'?'short':'deep';d=CH_DATA.limp[S2][pos][n];base={r:d.r,c:d.c||'',rest:!!d.rest}}
  else{const S2=st==='short'?'short':'deep';d=CH_DATA[sit][S2][op][pos];base={r:d.r,c:d.c||''}}
  if(sit==='sqz'&&n==='2'&&st!=='short'){ // против двух и больше коллеров: сквиз только с топом, остальное из сквиза уходит в колл
    const strong=parseRange('QQ+,AKs,AKo');const old=parseRange(base.r);const dem=[...old].filter(h=>!strong.has(h)&&!(h.length===3&&h[2]==='o'&&!/^A[KQ]/.test(h)));
    base={r:'QQ+,AKs,AKo',c:[base.c,...dem].filter(Boolean).join(',')};
  }
  const R=parseRange(base.r);let C=base.rest?new Set([...CH_ALL].filter(h=>!R.has(h))):parseRange(base.c);
  if(st==='mid'&&!base.rest&&pos!=='BB'){const drop=parseRange(CH_MID_DROP);if(sit!=='limp')parseRange(CH_MID_DROP_IP_PAIRS).forEach(h=>drop.add(h));C=new Set([...C].filter(h=>!drop.has(h)))}
  C=new Set([...C].filter(h=>!R.has(h)));
  return{R,C,rest:base.rest};
}
function chLabels(sit,st,pos){
  const short=st==='short';
  if(sit==='open')return{r:short?'Олл-ин':'Рейз',c:'',f:'Фолд'};
  if(sit==='limp')return{r:short?'Олл-ин':'Изо-рейз',c:pos==='BB'?'Чек':short?'':pos==='SB'?'Доплатить (лимп)':'Лимп следом',f:pos==='BB'?'':'Фолд'};
  if(sit==='raise')return{r:short?'Олл-ин':'3-бет',c:short?'':'Колл',f:'Фолд'};
  return{r:short?'Олл-ин':'Сквиз',c:short?'':'Колл',f:'Фолд'};
}
function chSize(sit,st,pos,n){
  const live='В живых и «спортивных» турнирах, где любят коллировать, бери верхнюю границу или ещё больше.';
  if(st==='short')return sit==='open'?'Олл-ин или фолд. Мин-рейз со слабыми руками на таком стеке только теряет фишки.':'Только олл-ин или фолд. Мёртвые деньги в банке делают олл-ин очень выгодным.';
  if(sit==='open')return pos==='SB'?'Рейз 2.5–3бб: без позиции нужен размер побольше.':'Рейз 2–2.3бб. '+(st==='mid'?'При 20–40бб — около 2бб.':'');
  if(sit==='limp')return (pos==='SB'||pos==='BB'?'Без позиции: 4бб + 1бб за каждого лимпера. ':'В позиции: 3бб + 1бб за каждого лимпера. ')+live;
  if(sit==='raise')return (pos==='IP'?'3-бет в позиции — примерно в 3 раза больше открытия.':'3-бет из блайндов — примерно в 4 раза больше открытия.')+(st==='mid'?' При 20–30бб вместо маленького 3-бета ставь олл-ин.':'');
  return (pos==='IP'?'Сквиз: 4 открытия + 1 открытие за каждого коллера.':'Сквиз из блайндов: 5 открытий + 1 открытие за каждого коллера.')+(st==='mid'?' При 30бб и меньше — сразу олл-ин.':'')+' '+live;
}
function chWhy(sit,st,pos,n){
  if(st==='short')return['С коротким стеком после флопа играть почти некогда. Олл-ин забирает всё, что лежит в банке, а это много: блайнды, анте, лимпы или рейз с коллами.','Коллы на таком стеке почти всегда хуже: ты отдаёшь часть стека и всё равно часто будешь вынужден сдаться.'];
  if(sit==='open')return['Чем раньше позиция, тем больше игроков за тобой и тем сильнее нужна рука.','Если за столом много любителей, которые коллируют, открывай чуть уже с ранних мест, но крупнее. Твои руки должны быть сильнее их коллов.'];
  if(sit==='limp')return[
    'Изо-рейз — это рейз против лимпера, чтобы играть с ним один на один, в позиции и с инициативой. Рейзи руками, которые бьют его типичный лимп: пары, сильные тузы, бродвеи.',
    pos==='BB'?'На BB ты уже в банке: всё, что не рейзишь, просто чекай и смотри флоп бесплатно.':'Лимп следом — для рук, которые хотят увидеть флоп дёшево в мультипоте: мелкие пары (ждут сет), одномастные тузы и связки (ждут флеш или стрит). С ними не нужен большой банк до флопа.',
    'Разномастные KJ, QJ, AT и слабее — в фолд или в рейз, но не в лимп. В мультипоте они часто делают вторую по силе руку и проигрывают крупно.',
    n==='2'?'Чем больше лимперов, тем уже изо-рейз (кто-то из них заплатит, и банк будет мультипотом) и тем шире лимп со спекулятивными руками.':'Против одного лимпера изо-рейз можно делать шире: он часто сбрасывает или играет против тебя без позиции.'];
  if(sit==='raise')return[
    '3-бет на вэлью — руки, которые бьют его диапазон открытия. Против раннего рейза это почти только QQ+ и AK.',
    'Колл — пары (ради сета) и одномастные руки, которые хорошо играют после флопа, особенно в позиции.',
    pos==='BB'?'BB закрывает действие и получает лучшую цену за столом, поэтому коллирует шире всех.':pos==='SB'?'Из SB коллировать неудобно: будешь без позиции, а BB может сквизнуть. Поэтому здесь в основном 3-бет или фолд.':'Против регуляров немного 3-бетов блефом с A5s/A4s полезно. Против любителей, которые не сбрасывают, 3-бети почти только на вэлью.'];
  return[
    'Сквиз — 3-бет после рейза и колла. Мёртвых денег в банке много, и сильная рука хочет забрать их сразу или сыграть большой банк в выгодной позиции.',
    'Против столов, где все коллируют, сквизь только на вэлью: блеф-сквиз не сработает, если коллеры не умеют сбрасывать. Зато AQ, AJs, KQs и TT против позднего рейзера — это уже вэлью.',
    'Колл — руки, которые выигрывают в мультипоте: пары ради сета и одномастные руки ради флеша и стрита. Разномастные бродвеи (KJo, QJo, ATo) здесь в фолд: в мультипоте их часто доминируют.',
    n==='2'?'Чем больше коллеров, тем уже сквиз (кто-то обязательно заплатит) и тем ценнее спекулятивные руки для колла.':'Если коллер — слабый любитель, сквиз часто оставляет тебя один на один против рейзера или против него в позиции.'];
}
function chQuizNew(){
  const sit=pick(['limp','limp','sqz','sqz','raise','open']);const st=pick(['deep','deep','mid','short']);
  const pos=pick(CH_POS[sit])[0];const op=pick(['E','L']);const n=pick(['1','2']);
  const ch=chartFor(sit,pos,op,n,st);const L=chLabels(sit,st,pos);
  // выбираем руку: половина — из рейза/колла, половина — случайная
  let pool=[...ch.R,...ch.C];const all=[...CH_ALL];let h=Math.random()<.6&&pool.length?pick(pool):pick(all);
  const correct=ch.R.has(h)?'r':ch.C.has(h)?'c':'f';
  const acts=[['r',L.r],...(L.c?[['c',L.c]]:[]),...(L.f?[['f',L.f]]:[])];
  if(!acts.some(a=>a[0]===correct))return chQuizNew();
  return{sit,st,pos,op,n,h,correct,acts,sel:null};
}
function chDesc(sit,pos,op,n,st){
  const pn=(CH_POS[sit].find(p=>p[0]===pos)||[])[1]||pos;const stn={deep:'40бб и больше',mid:'20–40бб',short:'меньше 20бб'}[st];
  if(sit==='open')return `Все сбросили до тебя. Ты на ${pn}, стек ${stn}.`;
  if(sit==='limp')return `${n==='1'?'Один игрок залимповал':'Два и больше игроков залимповали'}, остальные сбросили. Ты на ${pn}, стек ${stn}.`;
  if(sit==='raise')return `${op==='E'?'Ранний игрок (UTG–MP)':'Поздний игрок (LJ–BTN)'} открылся рейзом. Ты ${pos==='IP'?'позже него (не на блайндах)':'на '+pos}, стек ${stn}.`;
  return `${op==='E'?'Ранний игрок (UTG–MP)':'Поздний игрок (LJ–BTN)'} открылся, ${n==='1'?'один игрок заколлировал':'два и больше заколлировали'}. Ты ${pos==='IP'?'после них (не на блайндах)':'на '+pos}, стек ${stn}.`;
}
function handName(h){if(h.length===2)return h[0]+h[1];return h[0]+h[1]+(h[2]==='s'?' одномастные':' разномастные')}
function renderChart(){
  const sitBtns=[['limp','Лимперы до тебя'],['sqz','Рейз + коллеры'],['raise','Рейз до тебя'],['open','Все сбросили']];
  if(!CH_POS[CS.sit].some(p=>p[0]===CS.pos))CS.pos=CH_POS[CS.sit][0][0];
  const head=`<div class="hero"><span class="eyebrow">Шпаргалка · 9-max турнир</span><h1>Что делать с рукой, когда до тебя уже кто-то зашёл</h1>
    <p>Выбери ситуацию, свою позицию и стек — сетка покажет, какие руки рейзить, какие коллировать, а какие сбрасывать. Нажми на клетку, чтобы увидеть ответ для конкретной руки.</p>
    <div class="seg"><button aria-pressed="${CS.mode==='chart'}" data-act="cs-mode" data-m="chart">Таблица</button><button aria-pressed="${CS.mode==='quiz'}" data-act="cs-mode" data-m="quiz">Тренировка по таблице</button></div></div>`;
  if(CS.mode==='quiz')return head+renderChartQuiz();
  const ch=chartFor(CS.sit,CS.pos,CS.op,CS.n,CS.st);const L=chLabels(CS.sit,CS.st,CS.pos);
  let g='',rc=0,cc=0;
  for(let i=0;i<13;i++)for(let j=0;j<13;j++){const h=handAt(i,j);const a=ch.R.has(h)?'r':ch.C.has(h)?'c':'f';if(a==='r')rc+=combos(h);if(a==='c')cc+=combos(h);
    g+=`<div class="${i===j?'pair ':''}ch-${a}${CS.sel===h?' ch-sel':''}" data-h="${h}" data-act="cs-cell">${h.length===2?h:h.slice(0,2)+(h[2]==='s'?'s':'')}</div>`}
  const selA=CS.sel?(ch.R.has(CS.sel)?L.r:ch.C.has(CS.sel)?L.c:(L.f||'Чек')):null;
  const seg=(k,opts)=>`<div class="seg">${opts.map(([v,l])=>`<button aria-pressed="${CS[k]===v}" data-act="cs-set" data-k="${k}" data-v="${v}">${esc(l)}</button>`).join('')}</div>`;
  return head+`<div class="panel stack">
      <div class="field"><span class="lbl">Ситуация</span>${seg('sit',sitBtns)}</div>
      ${CS.sit==='raise'||CS.sit==='sqz'?`<div class="field"><span class="lbl">Кто открылся</span>${seg('op',[['E','Ранний: UTG–MP'],['L','Поздний: LJ–BTN']])}</div>`:''}
      ${CS.sit==='limp'||CS.sit==='sqz'?`<div class="field"><span class="lbl">${CS.sit==='limp'?'Сколько лимперов':'Сколько коллеров'}</span>${seg('n',[['1','Один'],['2','Два и больше']])}</div>`:''}
      <div class="field"><span class="lbl">Твоя позиция</span>${seg('pos',CH_POS[CS.sit])}</div>
      <div class="field"><span class="lbl">Твой стек</span>${seg('st',[['deep','40бб и больше'],['mid','20–40бб'],['short','меньше 20бб']])}</div>
    </div>
    <div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))">
      <div class="panel stack">
        <p style="font-size:15px"><b>${esc(chDesc(CS.sit,CS.pos,CS.op,CS.n,CS.st))}</b></p>
        <div class="rg-wrap"><div class="rg ch">${g}</div></div>
        <div class="legend"><span><i style="background:var(--ch-r)"></i>${esc(L.r)} · ${(rc/1326*100).toFixed(0)}%</span>${L.c?`<span><i style="background:var(--ch-c)"></i>${esc(L.c)} · ${ch.rest?'все остальные':(cc/1326*100).toFixed(0)+'%'}</span>`:''}${L.f?`<span><i style="background:var(--ch-f);box-shadow:inset 0 0 0 1px var(--line-2)"></i>${esc(L.f)}</span>`:''}</div>
        ${CS.sel?`<div class="why"><b>${esc(handName(CS.sel))}:</b> ${esc(selA)}.</div>`:`<p class="faint" style="font-size:13px">Нажми на любую руку в сетке.</p>`}
      </div>
      <div class="stack">
        <div class="rule"><span class="eyebrow">Размер</span><p>${esc(chSize(CS.sit,CS.st,CS.pos,CS.n))}</p></div>
        <div class="panel stack-s"><h3>Почему так</h3><ul class="ll">${chWhy(CS.sit,CS.st,CS.pos,CS.n).map(x=>`<li>${txg(x)}</li>`).join('')}</ul></div>
      </div>
    </div>
    <div class="panel stack"><span class="eyebrow">Поправка для столов, где все смотрят флоп</span>
      <div class="grid2">
        <div class="stack-s"><h3>Рейзь крупнее</h3><p class="muted" style="font-size:14px">Если на 2.2бб заходят пятеро, маленький рейз ничего не решает. Против таких столов изо-рейз 4–5бб + 1бб за лимпера, сквиз в 5 открытий и больше. Тогда ты играешь против одного-двух игроков, а не против всего стола.</p></div>
        <div class="stack-s"><h3>Меньше блефов до флопа</h3><p class="muted" style="font-size:14px">Блеф-3-бет и блеф-сквиз работают, когда соперник сбрасывает. Любители, которые «хотят посмотреть флоп», не сбрасывают. Поэтому 3-бети и сквизь в основном сильными руками, зато шире: TT, AJs, KQs, AQ уже вэлью.</p></div>
        <div class="stack-s"><h3>Пары и одномастные руки дорожают</h3><p class="muted" style="font-size:14px">В мультипоте выигрывает тот, кто собрал сет, флеш или стрит, а не тот, у кого топ-пара со средним кикером. Поэтому мелкие пары и одномастные тузы и связки — отличный дешёвый колл или лимп.</p></div>
        <div class="stack-s"><h3>Разномастные картинки — в пас</h3><p class="muted" style="font-size:14px">KJo, QJo, KTo, ATo в мультипотах приносят больше всего проигрышей: попал в пару — а у кого-то пара с лучшим кикером или две пары. Их рейзи против одного слабого лимпера в позиции, в остальных случаях сбрасывай.</p></div>
        <div class="stack-s"><h3>После флопа в мультипоте</h3><p class="muted" style="font-size:14px">Ставь с сильной рукой и сильным дро, а с воздухом чекай и сдавайся. Блеф должен пройти через всех соперников сразу, а это почти никогда не получается.</p></div>
        <div class="stack-s"><h3>Откуда эти таблицы</h3><p class="muted" style="font-size:14px">Это упрощённые таблицы на солверной логике для 9-max турнира с анте, подстроенные под столы, где много лимпуют и коллируют. Точный солверный ответ зависит от стеков и размеров ставок, но против любителей эти таблицы приносят больше, чем строгое ГТО.</p></div>
      </div></div>`;
}
function renderChartQuiz(){
  if(!CS.quiz)CS.quiz={n:0,c:0,cur:chQuizNew()};
  const Q=CS.quiz,cur=Q.cur,ans=cur.sel!=null;const L=chLabels(cur.sit,cur.st,cur.pos);
  const ch=ans?chartFor(cur.sit,cur.pos,cur.op,cur.n,cur.st):null;
  const [r1,r2]=[cur.h[0],cur.h[1]];const suits=cur.h.length===2?['s','h']:cur.h[2]==='s'?['h','h']:['s','d'];
  return `<div class="panel stack"><div class="row" style="justify-content:space-between"><span class="eyebrow">Что делаешь?</span><span class="mono muted">${Q.c}/${Q.n}</span></div>
    <p class="q-text">${esc(chDesc(cur.sit,cur.pos,cur.op,cur.n,cur.st))}</p>
    <div class="row"><span class="cards">${card(r1+suits[0])}${card(r2+suits[1])}</span><span class="muted">${esc(handName(cur.h))}</span></div>
    <div class="opts" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,160px),1fr))">${cur.acts.map(([k,l],i)=>{let c='';if(ans){if(k===cur.correct)c='right';else if(k===cur.sel)c='wrong'}return `<button class="opt ${c}" data-act="cq-ans" data-k="${k}" ${ans?'disabled':''}><span class="k">${'ABC'[i]}</span><span>${esc(l)}</span></button>`}).join('')}</div>
    ${ans?`<div class="why ${cur.sel===cur.correct?'good':'bad'}"><b>${cur.sel===cur.correct?'Верно.':'По таблице: '+esc(cur.acts.find(a=>a[0]===cur.correct)[1])+'.'}</b> ${esc(chSize(cur.sit,cur.st,cur.pos,cur.n))}</div>
      <div class="row"><button class="btn primary" data-act="cq-next">Следующая рука</button><button class="btn" data-act="cq-show">Открыть таблицу этой ситуации</button></div>`:''}
  </div>`;
}
ACTS['cs-mode']=(el)=>{CS.mode=el.dataset.m;render()};
ACTS['cs-set']=(el)=>{CS[el.dataset.k]=el.dataset.v;CS.sel=null;render()};
ACTS['cs-cell']=(el)=>{CS.sel=el.dataset.h;const y=window.scrollY;render();window.scrollTo({top:y})};
ACTS['cq-ans']=(el)=>{const cur=CS.quiz.cur;if(cur.sel!=null)return;cur.sel=el.dataset.k;CS.quiz.n++;const ok=cur.sel===cur.correct;if(ok)CS.quiz.c++;
  const st=S.stats.preflop||(S.stats.preflop={c:0,t:0});st.t++;if(ok)st.c++;save();render()};
ACTS['cq-next']=()=>{CS.quiz.cur=chQuizNew();render()};
ACTS['cq-show']=()=>{const c=CS.quiz.cur;Object.assign(CS,{sit:c.sit,pos:c.pos,op:c.op,n:c.n,st:c.st,sel:c.h,mode:'chart'});render();window.scrollTo({top:0})};
