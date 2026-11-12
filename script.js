'use strict';

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const SOURCES = {
  SURS:'https://www.stat.si/StatWeb/News/Index/14593',
  SURSHISTORY:'https://pxweb.stat.si/SiStatData/pxweb/en/Data/-/2700010S.px',
  ZEOS24:'https://www.zeos.si/fupld/10882/zeos-lp-slo-2024-splet.pdf',
  ZEOS07:'https://www.zeos.si/fupld/29/Letno_porocilo_ZEOS_za_2007.pdf',
  NOVA:'https://www.nova-gorica.si/sl/novice/koticek-za-ponovno-uporabo-delujocih-elektronskih-aparatov/',
  KOMUNALA:'https://www.komunala-ng.si/sl/ravnanje-z-odpadki/zbiranje-odpadkov/',
  ZEOSRULES:'https://www.zeos.si/novice/pozor-pri-oddaji-e-odpadkov-v-ulicne-zbiralnike-napacno-odvrzene-stvari-ni-vec-mogoce-dobiti-nazaj/',
  SG:'https://www.komusg.si/Portals/0/Publikacije/Zbornik%20ob%2065-letnici%20delovanja%20Komunale%20Slovenj%20Gradec.pdf',
  LAW:'https://www.uradni-list.si/glasilo-uradni-list-rs/vsebina/2001-01-1189/odredba-o-ravnanju-z-loceno-zbranimi-frakcijami-pri-opravljanju-javne-sluzbe-ravnanja-s-komunalnimi-odpadki'
};

// Mobile navigation
const menuBtn = $('#menuBtn');
menuBtn.addEventListener('click', () => {
  const isOpen = $('#siteNav').classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  menuBtn.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
$$('#siteNav a').forEach(a => a.addEventListener('click', () => {
  $('#siteNav').classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false');
}));

// Historical milestone timeline: claims and years backed by primary documentation
const milestones = [
  {year:'1996',tag:'EARLY LOCAL EFFORTS',title:'Ecological islands start appearing.',body:'As one documented local example, the municipality of Slovenj Gradec introduced its first ecological islands for separately collecting waste in 1996. This is a local milestone, not the first-ever recycling point in Slovenia.',source:'[8] Komunala Slovenj Gradec — historical publication',url:SOURCES.SG},
  {year:'2001',tag:'NATIONAL RULES',title:'Separate collection becomes a formal obligation.',body:'A national order published in March 2001 defined minimum requirements for municipal separate-waste collection. Local services had clearer obligations and categories to manage.',source:'[9] Official Gazette of Slovenia — No. 21/2001',url:SOURCES.LAW},
  {year:'2005',tag:'A SYSTEM TAKES SHAPE',title:'ZEOS is established.',body:'ZEOS was established in 2005 to organise the management of discarded electrical and electronic equipment. By 2005, the separately collected share of municipal waste nationwide was 11.7%.',source:'[4] ZEOS 2007; [2] SURS historical statistics',url:SOURCES.ZEOS07},
  {year:'2007',tag:'ELECTRONIC-WASTE COLLECTION',title:'Over 3,262 tonnes collected in a year.',body:'ZEOS reported collecting 3,262,061 kg of waste electrical and electronic equipment during 2007, the early phase of its national collection scheme. This number covers ZEOS, not every collector in Slovenia.',source:'[4] ZEOS Annual Report 2007',url:SOURCES.ZEOS07},
  {year:'2010',tag:'NATIONAL DATA',title:'Nearly one third collected separately.',body:'Separate collection reached 32.1% of municipal waste in 2010, according to the SURS historical series. It is a collection indicator — not a recycling rate.',source:'[2] SURS historical statistics',url:SOURCES.SURSHISTORY},
  {year:'2015',tag:'PROGRESS',title:'More than two thirds collected separately.',body:'By 2015, Slovenia separately collected 68.6% of municipal waste. This figure represents a much larger share than the 11.7% recorded ten years earlier.',source:'[2] SURS historical statistics',url:SOURCES.SURSHISTORY},
  {year:'2022',tag:'OUR LOCAL AREA',title:'A reuse corner opens in Nova Gorica.',body:'On 20 April 2022, ZEOS and Komunala Nova Gorica opened a reuse corner at CERO Nova Gorica for electrical appliances that still work. The idea: extend useful life before recycling becomes necessary.',source:'[5] Municipality of Nova Gorica — 20 April 2022',url:SOURCES.NOVA},
  {year:'2024',tag:'E-WASTE IN NUMBERS',title:'ZEOS collects more than 11,000 tonnes.',body:'In 2024, the ZEOS scheme collected 11,137,532 kg of e-waste. Its official collection rate was 31.0% under a specific EU methodology; this is not the percent of e-waste recycled.',source:'[3] ZEOS Annual Report 2024',url:SOURCES.ZEOS24},
  {year:'2025',tag:'LATEST COMPLETE ANNUAL SURS DATA',title:'73.9% collected separately — and work remains.',body:'SURS reports that 73.9% of municipal waste was collected separately in 2025, while 511 kg of municipal waste was generated per resident. A high collection share does not remove the need to reduce waste in the first place.',source:'[1] SURS — Waste, 2025',url:SOURCES.SURS}
];
let milestoneIndex = milestones.length - 1;
function renderMilestone() {
  const list = $('#timelineYears'); list.textContent = '';
  milestones.forEach((event, index) => {
    const b = document.createElement('button'); b.type='button';
    b.className = 'year-btn' + (index===milestoneIndex?' active':'');
    b.setAttribute('aria-pressed',String(index===milestoneIndex));
    b.innerHTML = `<span>${event.year}</span><small>${index===milestoneIndex?'SELECTED':'EXPLORE'}</small>`;
    b.addEventListener('click', () => {milestoneIndex=index;renderMilestone();});
    list.append(b);
  });
  const event = milestones[milestoneIndex];
  const detail = $('#timelineDetail');
  $('.detail-era',detail).textContent = event.tag;
  $('.detail-year',detail).textContent = event.year;
  $('h3',detail).textContent = event.title;
  $('p',detail).textContent = event.body;
  const link = $('a',detail); link.href=event.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=event.source+' ↗';
  const selected = $$('.year-btn',list)[milestoneIndex];
  if (selected) list.scrollLeft = Math.max(0, selected.offsetLeft - list.offsetLeft - list.clientWidth / 2 + selected.clientWidth / 2);
}
renderMilestone();

// Two non-interchangeable, independently sourced datasets.
const datasets = {
  separate: {
    heading:'Separately collected municipal waste',tag:'SURS · WHOLE OF SLOVENIA',unit:'%',values:[
      [2005,11.7],[2007,15.4],[2010,32.1],[2012,46.3],[2015,68.6],[2020,71.9],[2024,74.3],[2025,73.9]
    ],source:SOURCES.SURS,footTitle:'Separate collection is not recycling.',footCopy:'SURS reports the share collected separately. Some separately collected material may not be recycled. Methodological changes across years require care.',
    describe:(v,y)=>`In ${y}, ${v.toFixed(1)}% of Slovenia's municipal waste was separately collected. This is a collection share, not a recycling rate.`
  },
  ewaste: {
    heading:'E-waste collected by ZEOS',tag:'ZEOS COLLECTION SCHEME · SLOVENIA',unit:'t',values:[
      [2007,3262],[2009,5797],[2011,6479],[2013,6023],[2015,7880],[2018,9254],[2021,10428],[2024,11138]
    ],source:SOURCES.ZEOS24,footTitle:'ZEOS is a scheme, not all of Slovenia.',footCopy:'These are ZEOS scheme collections, rounded to whole tonnes from official annual reports; they do not measure all e-waste generated in Slovenia.',
    describe:(v,y)=>`ZEOS reported approximately ${v.toLocaleString('en-US')} tonnes collected in ${y}. More collected does not necessarily mean more discarded devices were generated.`
  }
};
let selectedMetric='separate';let selectedPoint=7;
function renderDataset(){
  const d=datasets[selectedMetric], [year,val]=d.values[selectedPoint];
  $$('.tab').forEach(b=>{const active=b.dataset.metric===selectedMetric;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active));});
  $('#dataTag').textContent=d.tag;$('#dataHeading').textContent=d.heading;
  $('#dataValue').textContent=''; const big=document.createTextNode(d.unit==='%'?val.toFixed(1):val.toLocaleString('en-US'));
  const unit=document.createElement('span');unit.textContent=d.unit==='%'?'%':' t';$('#dataValue').append(big,unit);
  $('#dataYear').textContent=year;$('#dataInterpretation').textContent=d.describe(val,year);
  $('#dataFootTitle').textContent=d.footTitle;$('#dataFootCopy').textContent=d.footCopy;$('#dataSource').href=d.source;
  $('#dataPrev').disabled=selectedPoint===0;$('#dataNext').disabled=selectedPoint===d.values.length-1;
  const plot=$('#dataChart'); plot.textContent='';
  const max = selectedMetric==='separate'?100:12000;
  d.values.forEach(([y,v],i)=>{
    const btn=document.createElement('button');btn.type='button';btn.className='chart-column'+(i===selectedPoint?' active':'');
    btn.setAttribute('aria-label',`${y}: ${selectedMetric==='separate'?v.toFixed(1)+' percent':v+' tonnes'}`);
    btn.setAttribute('aria-pressed',String(i===selectedPoint));
    const num=document.createElement('span');num.className='bar-num';num.textContent=selectedMetric==='separate'?`${v.toFixed(1)}%`:`${(v/1000).toFixed(1)}k`;
    const bar=document.createElement('span');bar.className='bar';bar.style.height=`${Math.max(4,v/max*190)}px`;
    const lab=document.createElement('span');lab.className='bar-year';lab.textContent=String(y);
    btn.append(num,bar,lab);btn.addEventListener('click',()=>{selectedPoint=i;renderDataset();});plot.append(btn);
  });
}
$$('.tab').forEach(b=>b.addEventListener('click',()=>{selectedMetric=b.dataset.metric;selectedPoint=7;renderDataset();}));
$('#dataPrev').addEventListener('click',()=>{selectedPoint=Math.max(0,selectedPoint-1);renderDataset();});
$('#dataNext').addEventListener('click',()=>{selectedPoint=Math.min(7,selectedPoint+1);renderDataset();});
renderDataset();

// Local story highlights reuse gallery images rather than introducing extra photo obligations.
// Three factual Nova Gorica information cards, with no required photo slots.
const featured = [
  {number:'01 / THE STREET',tag:'STREET-LEVEL EVIDENCE',title:'What does this bin accept?',body:'Street collection points can have different compartments. Check the container label: batteries and small electrical devices do not always belong in the same opening.'},
  {number:'02 / COLLECTION CENTRE',tag:'LOCAL INFRASTRUCTURE',title:'Where larger devices belong.',body:'Collection centres handle appliances and other items that do not belong in street containers. Check the local operator’s instructions and opening hours before visiting.'},
  {number:'03 / REUSE',tag:'BEFORE RECYCLING',title:'Could someone else use it?',body:'Working equipment can have a second life. The reuse corner in Nova Gorica is a local example of preventing waste before recycling.'}
];
function renderLocalCards(){
  const root=$('#localCards');root.textContent='';
  featured.forEach(item=>{
    const article=document.createElement('article');
    article.className='local-card local-card-text';
    const body=document.createElement('div');body.className='local-card-body';
    const number=document.createElement('span');number.className='local-card-number';number.textContent=item.number;
    const cat=document.createElement('span');cat.className='local-card-category';cat.textContent=item.tag;
    const h=document.createElement('h3');h.textContent=item.title;
    const desc=document.createElement('p');desc.textContent=item.body;
    body.append(number,cat,h,desc);article.append(body);root.append(article);
  });
}
renderLocalCards();

// Six planned student photos: filtering, keyboard accessible lightbox.
let category='all', author='all', visiblePhotos=[], lightboxIndex=0, beforeModal=null;
function renderGallery(){
  visiblePhotos=galleryPhotos.filter(p=>(category==='all'||p.category===category)&&(author==='all'||p.author===author));
  $('#galleryCount').textContent=`Showing ${visiblePhotos.length} of ${galleryPhotos.length} planned photographs`;
  const root=$('#galleryGrid');root.textContent='';
  visiblePhotos.forEach((p,index)=>{
    const card=document.createElement('article');card.className='photo';
    const btn=document.createElement('button');btn.className='photo-button';btn.type='button';
    btn.setAttribute('aria-label',`View photo ${p.id}: ${p.title}`);
    const frame=document.createElement('div');frame.className='photo-img';
    const img=document.createElement('img');img.src=p.src;img.alt=p.demo?`Demo placeholder for ${p.title}`:p.description;img.loading='lazy';
    frame.append(img);
    if (p.demo){const demo=document.createElement('span');demo.className='photo-demo';demo.textContent='DEMO · REPLACE';frame.append(demo);}
    const expand=document.createElement('span');expand.className='photo-expand';expand.textContent='↗';expand.setAttribute('aria-hidden','true');frame.append(expand);
    const info=document.createElement('div');info.className='photo-info';const meta=document.createElement('span');meta.textContent=`${String(p.id).padStart(2,'0')} / ${p.author === 'a' ? 'LUKA' : 'MARK'} / ${p.category}`;
    const title=document.createElement('h3');title.textContent=p.title;const desc=document.createElement('p');desc.textContent=p.description;info.append(meta,title,desc);
    btn.append(frame,info);btn.addEventListener('click',()=>openLightbox(index,btn));card.append(btn);root.append(card);
  });
}
function showLightbox(){const p=visiblePhotos[lightboxIndex];if (!p) return;
  $('#lightboxImg').src=p.src;$('#lightboxImg').alt=p.demo?`Sample illustration: ${p.title}`:p.description;
  $('#lightboxTag').textContent=`IMAGE ${String(p.id).padStart(2,'0')} / ${p.author === 'a' ? 'Student Luka' : 'Student Mark'} ${p.demo?'/ DEMO PLACEHOLDER':''}`;
  $('#lightboxTitle').textContent=p.title;$('#lightboxDescription').textContent=p.description;
}
function openLightbox(index,trigger){beforeModal=trigger;lightboxIndex=index;showLightbox();$('#lightbox').hidden=false;document.body.classList.add('lightbox-open');$('#lightboxClose').focus();}
function closeLightbox(){$('#lightbox').hidden=true;document.body.classList.remove('lightbox-open');if(beforeModal) beforeModal.focus();}
function advanceLightbox(step){lightboxIndex=(lightboxIndex+step+visiblePhotos.length)%visiblePhotos.length;showLightbox();}
$$('.filter').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;$$('.filter').forEach(t=>{const on=t===b;t.classList.toggle('is-active',on);t.setAttribute('aria-pressed',String(on));});renderGallery();}));
$('#galleryAuthor').addEventListener('change',e=>{author=e.target.value;renderGallery();});
$('#lightboxClose').addEventListener('click',closeLightbox);
$('#lightboxPrev').addEventListener('click',()=>advanceLightbox(-1));
$('#lightboxNext').addEventListener('click',()=>advanceLightbox(1));
$('#lightbox').addEventListener('click',e=>{if(e.target===$('#lightbox')) closeLightbox();});
document.addEventListener('keydown',e=>{if($('#lightbox').hidden)return;
  if(e.key==='Escape')closeLightbox();else if(e.key==='ArrowRight')advanceLightbox(1);else if(e.key==='ArrowLeft')advanceLightbox(-1);
  else if(e.key==='Tab') { const buttons=[$('#lightboxClose'),$('#lightboxPrev'),$('#lightboxNext')];const idx=buttons.indexOf(document.activeElement);if(e.shiftKey&&idx===0){buttons[2].focus();e.preventDefault();}else if(!e.shiftKey&&idx===2){buttons[0].focus();e.preventDefault();}}
});
renderGallery();

// Three learning modes, with source-grounded explanations rather than trivial memory play.
const learning = {
  detective:{label:'MISSION 01 / DATA DETECTIVE',heading:'Can you read the data?',intro:'Evaluate evidence from Slovenia. Exact dates and definitions matter.',hint:'A collection rate and a recycling rate are not the same thing.',questions:[
    {q:'In 2005, what share of Slovenia’s municipal waste was collected separately?',options:['11.7%','32.1%','68.6%'],correct:0,why:'SURS gives 11.7% for 2005. The other two values refer to 2010 and 2015. [2]'},
    {q:'In 2025, how much municipal waste was generated per resident in Slovenia?',options:['73.9 kg','511 kg','11,138 kg'],correct:1,why:'SURS reports 511 kg of municipal waste per resident in 2025. The 73.9 figure is a percent, and 11,138 tonnes refers to ZEOS collection in 2024. [1, 3]'},
    {q:'Slovenia separately collected 73.9% of municipal waste in 2025. What does this prove?',options:['Exactly 73.9% was recycled','All remaining waste went to landfill','73.9% was collected separately; recycling is another measure'],correct:2,why:'Collection means a waste stream was separated at collection. This statistic alone does not tell us how much was ultimately recycled. [1]'},
    {q:'The separate-collection share increased from 11.7% in 2005 to 73.9% in 2025. By how many percentage points?',options:['62.2 percentage points','6.2 percentage points','73.9 percentage points'],correct:0,why:'73.9 − 11.7 = 62.2 percentage points. Percentage points are different from relative percent growth. [1, 2]'},
    {q:'ZEOS collected about 3,262 tonnes in 2007 and 11,138 tonnes in 2024. Which conclusion is justified?',options:['Slovenia generated exactly 3.4 times more e-waste','ZEOS collected about 3.4 times as much; this does not show national generation','All collected devices were repaired'],correct:1,why:'11,138 ÷ 3,262 ≈ 3.4. Collection activity can grow because of the collection network, awareness, legislation and other factors. [3, 4]'},
    {q:'ZEOS reported a 31% e-waste collection rate in 2024. What was the percentage compared with?',options:['All municipal waste in Slovenia','E-waste sent to repair shops','The average weight of electrical equipment placed on the market in the previous three years'],correct:2,why:'The EU-style target methodology compares collection to average EEE placed on the market over the previous 3 years. ZEOS discusses limits of this method. [3]'}
  ]},
  route:{label:'MISSION 02 / THE COLLECTION ROUTE',heading:'Where should it go?',intro:'Choose an appropriate route for a waste item. Different containers serve different purposes.',hint:'Rules are based on ZEOS and Komunala guidance. Always read the sign on the actual container.',questions:[
    {q:'You have used AA batteries. Where should you put them?',options:['The blue battery compartment / designated battery collection','The ordinary mixed-waste bin','The glass container'],correct:0,why:'Portable batteries go to designated battery-collection points, including blue compartments where provided. Never put batteries in mixed waste. [6, 7]'},
    {q:'Your old computer keyboard no longer works. A designated small e-waste street bin is available. What is appropriate?',options:['Put it in paper collection','Use the labelled small e-waste collection bin','Put it into a glass container'],correct:1,why:'Small computer accessories such as keyboards can go in appropriately labelled street bins for small electrical/electronic waste. Check the opening and the label. [7]'},
    {q:'Your large television screen is broken. Where should it go?',options:['Into a small street e-waste container','Into household mixed waste','To an appropriate collection centre or retailer take-back point'],correct:2,why:'Televisions and monitors are not accepted in the small street e-waste containers; use a collection centre or designated take-back. [7]'},
    {q:'A functioning microwave is no longer needed. What should you consider first?',options:['A verified reuse route, if the appliance is safe and in working condition','Throw it out with mixed municipal waste','Leave it next to any street bin'],correct:0,why:'If safe and usable, keeping a device in circulation avoids premature waste. Nova Gorica opened a dedicated reuse corner in 2022. [5]'},
    {q:'You have an old fluorescent lamp. What is the safer route?',options:['Put it in street-bin glass collection','Use a suitable lamp take-back point or collection centre','Put it into a street container for small e-waste'],correct:1,why:'Lamps can break and do not belong in standard small e-waste street containers. Use appropriate collection. [7]'},
    {q:'You want to discard a refrigerator. Which route is appropriate?',options:['Leave it on the pavement next to the bins','Use the small battery compartment','Take it to a suitable collection centre or arrange authorised take-back'],correct:2,why:'Large appliances need appropriate collection and professional handling; street bins for small e-waste are not intended for them. [6, 7]'}
  ]},
  decision:{label:'MISSION 03 / SECOND-LIFE DECISIONS',heading:'Think before throwing it away.',intro:'Realistic situations require good judgement, not memorised recycling slogans.',hint:'Aim to avoid waste when safe; otherwise choose the correct collection and treatment route.',questions:[
    {q:'A working laptop is too slow for your needs. A younger student could still use it. What is the strongest option?',options:['Dispose of it immediately','Securely erase your data and consider passing it on','Put it in a small battery compartment'],correct:1,why:'A working computer may gain a second owner. Before donation, back up and securely erase personal data. Reuse comes before end-of-life treatment. [5]'},
    {q:'Your laptop fan is loud, but the computer still runs. What should you consider?',options:['Safe diagnosis and repair by a capable person','A new laptop without checking the fault','Mixed-waste disposal'],correct:0,why:'A repair may extend product life. Do not open mains-powered or hazardous parts without appropriate competence. [3]'},
    {q:'An electrical charging cable has exposed wires. What is the appropriate choice?',options:['Keep using it until it stops','Give it to somebody else without warning','Stop using it and send it through an appropriate e-waste route'],correct:2,why:'Unsafe electrical accessories should not be reused. ZEOS accepts cables and chargers in suitable small e-waste collection routes. [7]'},
    {q:'An old monitor still works and is safe. What should happen before it becomes waste?',options:['Consider reuse or transfer to someone who needs it','Put it into a street bin for small appliances','Crush the screen to save space'],correct:0,why:'Reuse is worth exploring for functional electronics. If ultimately discarded, monitors need an appropriate collection route, not a small street bin. [5, 7]'},
    {q:'A household device has a visibly swollen battery. What is the correct response?',options:['Puncture it to release pressure','Stop using/charging it, avoid handling damage, and seek specialist disposal advice','Put it next to a heater'],correct:1,why:'Damaged lithium batteries may pose fire hazards. Do not charge, puncture or casually place them in standard bins; contact the local waste operator for safe handling guidance.'},
    {q:'ZEOS collection volumes increased over time. Which action helps improve the system without encouraging unnecessary purchases?',options:['Replace all devices every year','Discard working devices to make collection figures look better','Maintain, repair or pass on working devices; collect end-of-life equipment separately'],correct:2,why:'The aim is better resource use, not maximising waste. Responsible consumption includes prevention, repair, reuse and proper collection. [3, 5]'}
  ]}
};
const labStates=Object.fromEntries(Object.keys(learning).map(k=>[k,{index:0,score:0,answered:false,choice:null}]));
let activeLab='detective';
function renderLab(){
  const config=learning[activeLab],s=labStates[activeLab];
  $$('.lab-tab').forEach(b=>{const on=b.dataset.lab===activeLab;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',String(on));});
  $('#labLabel').textContent=config.label;$('#labHeading').textContent=config.heading;$('#labIntro').textContent=config.intro;$('#labFact').textContent=config.hint;
  $('#labScore').textContent=`${s.score} / ${config.questions.length}`;
  $('#labProgressText').textContent=s.index>=config.questions.length?'COMPLETED':`QUESTION ${s.index+1} OF ${config.questions.length}`;
  $('#labProgressBar').style.width=`${Math.min(s.index+(s.answered?1:0),config.questions.length)/config.questions.length*100}%`;
  const result=$('#labFinished'),opts=$('#answerOptions'),next=$('#nextQuestion');opts.textContent='';$('#answerFeedback').textContent='';
  if(s.index>=config.questions.length){
    $('#questionLabel').textContent='MISSION COMPLETE';$('#questionText').textContent='Your results';result.hidden=false;next.hidden=true;
    result.textContent='';const title=document.createElement('h4');title.textContent=`${s.score} out of ${config.questions.length} correct`;
    const desc=document.createElement('p');desc.textContent=s.score===config.questions.length?'Excellent interpretation — you read the evidence carefully.':'You have finished the activity. Read the explanations and try again to improve your understanding.';
    const again=document.createElement('button');again.type='button';again.textContent='Try this activity again ↺';again.addEventListener('click',()=>{labStates[activeLab]={index:0,score:0,answered:false,choice:null};renderLab();});result.append(title,desc,again);return;
  }
  result.hidden=true;const q=config.questions[s.index];$('#questionLabel').textContent=`QUESTION ${String(s.index+1).padStart(2,'0')} / ${config.questions.length}`;$('#questionText').textContent=q.q;
  q.options.forEach((answer,i)=>{
    const b=document.createElement('button');b.type='button';b.className='answer';
    const label=document.createElement('span');label.textContent=String.fromCharCode(65+i);
    const text=document.createElement('div');text.textContent=answer;b.append(label,text);
    if(s.answered){b.disabled=true;if(i===q.correct)b.classList.add('correct');if(i===s.choice&&i!==q.correct)b.classList.add('wrong');}
    else b.addEventListener('click',()=>answerQuestion(i));opts.append(b);
  });
  if(s.answered){const box=$('#answerFeedback');const status=document.createElement('strong');status.textContent=s.choice===q.correct?'Correct. ':'Not quite. ';
    box.append(status,document.createTextNode(q.why));next.hidden=false;next.innerHTML=s.index===config.questions.length-1?'See your results <span>→</span>':'Next question <span>→</span>';
  }else next.hidden=true;
}
function answerQuestion(i){const s=labStates[activeLab];if(s.answered)return;const q=learning[activeLab].questions[s.index];s.answered=true;s.choice=i;if(i===q.correct)s.score++;renderLab();}
$$('.lab-tab').forEach(b=>b.addEventListener('click',()=>{activeLab=b.dataset.lab;renderLab();}));
$('#nextQuestion').addEventListener('click',()=>{const s=labStates[activeLab];if(!s.answered)return;s.index++;s.answered=false;s.choice=null;renderLab();});
renderLab();

// Videos appear automatically after users add their own MP4 files. No broken player before then.
$$('.video-slot').forEach(async slot=>{
  const path=slot.dataset.video;
  try{
    const response=await fetch(path,{method:'HEAD'});
    if(response.ok && (response.headers.get('content-type')||'').includes('video')){
      const video=document.createElement('video');video.controls=true;video.preload='metadata';video.playsInline=true;
      const source=document.createElement('source');source.src=path;source.type='video/mp4';video.append(source);slot.textContent='';slot.append(video);
    }
  }catch(_err){/* No local MP4 yet; show deliberate placeholder. */}
});
