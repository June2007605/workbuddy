// ==================== 小深深工作台 ====================
const SUPABASE_URL = 'https://oeibttbtkvdpatpowxmu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UC--7FeY5A4V0BA-r95UVw_xQDMjOQ7';

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    loadPage(item.dataset.page);
  });
});

function loadPage(p) {
  const c = document.getElementById('content');
  if(p==='english') renderEnglish(c);
  else if(p==='plan') renderPlan(c);
  else if(p==='major') renderMajor(c);
  else if(p==='pharmacist') renderPharmacist(c);
  else if(p==='finance') renderFinance(c);
  else if(p==='gravity') renderGravity(c);
}

// ==================== 电子宠物 ====================
let pet = JSON.parse(localStorage.getItem('petData')) || { name:'小绿芽', level:1, exp:0, stars:10 };
const petStages = ['🥚','🌱','🌿','🪴','🌳','🌟'];
function renderPet(){
  const s = Math.min(Math.floor(pet.exp/100),5);
  const sn = ['宠物蛋','小苗','嫩叶','盆栽','大树','闪耀之星'][s];
  document.getElementById('pet-container').innerHTML = `
    <div class="pet-box">
      <div class="pet-emoji" onclick="feedPet()">${petStages[s]}</div>
      <div class="pet-name">${pet.name}</div>
      <div style="font-size:11px;color:#666;">${sn} Lv.${pet.level}</div>
      <div class="progress-bar" style="width:80px;margin:4px auto;"><div class="progress-fill" style="width:${pet.exp%100}%;"></div></div>
      <div style="font-size:11px;color:#f9a825;">⭐ ${pet.stars}</div>
      ${pet.exp<100?'<p style="color:#f44336;font-size:11px;">🍽️ 饿了</p >':''}
      <button class="btn" style="padding:4px 12px;font-size:11px;" onclick="feedPet()">🍖 投喂(5⭐)</button>
      <button class="btn" style="padding:4px 12px;font-size:11px;" onclick="renamePet()">✏️</button>
    </div>`;
}
function addStars(n){ pet.stars+=n; localStorage.setItem('petData',JSON.stringify(pet)); renderPet(); }
function feedPet(){ if(pet.stars<5){alert('⭐不足！');return;} pet.stars-=5; pet.exp+=30; if(pet.exp>=100){pet.level++;pet.exp=0;alert('🎉 升级！Lv.'+pet.level);} localStorage.setItem('petData',JSON.stringify(pet)); renderPet(); }
function renamePet(){ const n=prompt('新名字：',pet.name); if(n&&n.trim()){pet.name=n.trim();localStorage.setItem('petData',JSON.stringify(pet));renderPet();} }
renderPet();

// ==================== 英语学习 ====================
function renderEnglish(c){
  c.innerHTML=`
    <div class="card"><h2>📖 阅读真题</h2><div id="reading-area"></div></div>
    <div class="card"><h2>🎧 听力真题</h2><div id="listening-area"></div></div>
    <div class="card"><h2>📝 错题本</h2><div id="wrong-questions"></div></div>
    <div class="card"><h2>📒 单词卡片</h2><div id="vocab-card"></div></div>
    <div class="card"><h2>🎤 影子跟读</h2><div id="shadowing-area"></div></div>
    <div class="card"><h2>✍️ 写作素材</h2><div id="writing-materials"></div></div>`;
  loadReading(); loadListening(); loadVocabCard(); loadShadowing(); loadWriting(); renderWrongQuestions();
}
const readingQs=[
  { exam:'CET4', passage:'Environmental protection has become a global concern. Our planet faces serious challenges like air pollution, water contamination, and climate change.', question:'What is the main idea?', options:['A. Economic growth','B. Environmental awareness','C. Technology','D. Social media'], answer:'B', analysis:'文章主旨是环保意识。' },
  { exam:'CET4', passage:'Regular exercise brings numerous benefits. People who exercise regularly have better sleep, improved mood, and stronger bones.', question:'Which is NOT a benefit?', options:['A. Better sleep','B. Increased stress','C. Improved mood','D. Stronger bones'], answer:'B', analysis:'运动不会增加压力。' },
  { exam:'CET6', passage:'Globalization has transformed the world. It brought economic opportunities but also led to cultural homogenization.', question:'Globalization led to ___.', options:['A. Cultural homogenization concerns','B. Economic decline','C. Political stability','D. Environmental protection'], answer:'A', analysis:'全球化引发文化同质化担忧。' },
  { exam:'PG', passage:'The article proposes a new framework for social behavior including motivation, emotion, and social influence.', question:'The purpose is to ___.', options:['A. Criticize policies','B. Propose a new theory','C. Describe events','D. Analyze data'], answer:'B', analysis:'文章目的是提出新理论。' }
];
let readingFilter={exam:'all'};
function loadReading(){ if(!localStorage.getItem('readingQs'))localStorage.setItem('readingQs',JSON.stringify(readingQs)); window.currentQs=JSON.parse(localStorage.getItem('readingQs')); renderReadingSelector(); }
function renderReadingSelector(){ document.getElementById('reading-area').innerHTML=`<p>选择类型：</p ><span class="tag active" onclick="selectReadingExam('all',this)">全部</span><span class="tag" onclick="selectReadingExam('CET4',this)">四级</span><span class="tag" onclick="selectReadingExam('CET6',this)">六级</span><span class="tag" onclick="selectReadingExam('PG',this)">考研</span><div id="reading-list" style="margin-top:12px;"></div>`; renderReadingList(); }
function selectReadingExam(exam,el){ document.querySelectorAll('#reading-area .tag').forEach(t=>t.classList.remove('active')); el.classList.add('active'); readingFilter.exam=exam; renderReadingList(); }
function renderReadingList(){ let qs=window.currentQs; if(readingFilter.exam!=='all')qs=qs.filter(q=>q.exam===readingFilter.exam); document.getElementById('reading-list').innerHTML=qs.length===0?'<p>暂无题目</p >':qs.map((q,i)=>`<div class="list-item" style="cursor:pointer;" onclick="startReading(${i},'${readingFilter.exam}')"><span>📖 阅读题${i+1}</span><span class="tag">${q.exam}</span><span>➡</span></div>`).join(''); }
function startReading(idx,exam){ let qs=window.currentQs; if(exam!=='all')qs=qs.filter(q=>q.exam===exam); const q=qs[idx]; document.getElementById('reading-area').innerHTML=`<button class="btn" style="margin-bottom:12px;" onclick="renderReadingSelector()">⬅ 返回</button><div style="padding:12px;background:#f9fdf9;border-radius:8px;"><span class="tag">${q.exam}</span><span class="tag">阅读</span><div style="padding:10px;margin:8px 0;background:#fff;border-left:3px solid #81c784;"><b>📄 文章：</b><p>${q.passage}</p ></div><p><b>${q.question}</b></p >${q.options.map(o=>`<div class="option-item" onclick="checkReadSingle(this,'${o}','${q.answer}')">${o}</div>`).join('')}<div id="read-analysis-single" style="display:none;margin-top:8px;padding:8px;background:#e8f5e9;border-radius:8px;">💡 ${q.analysis}</div></div><button class="btn" style="margin-top:12px;" onclick="nextReading(${idx},'${exam}')">下一题 ➡</button>`; }
function checkReadSingle(el,sel,ans){ const s=el.parentElement.querySelectorAll('.option-item'); s.forEach(x=>x.style.pointerEvents='none'); if(sel===ans){el.classList.add('correct');addStars(1);} else{el.classList.add('wrong');s.forEach(x=>{if(x.textContent===ans)x.classList.add('correct');});} document.getElementById('read-analysis-single').style.display='block'; }
function nextReading(idx,exam){ let qs=window.currentQs; if(exam!=='all')qs=qs.filter(q=>q.exam===exam); startReading((idx+1)%qs.length,exam); }
function renderWrongQuestions(){ const wl=JSON.parse(localStorage.getItem('wrongQuestions'))||[]; document.getElementById('wrong-questions').innerHTML=wl.length===0?'<p style="color:#999;">暂无错题🎉</p >':wl.map((q,i)=>`<p>❌ ${i+1}. ${q.question} → ${q.answer}</p >`).join(''); }

const listeningQs=[
  { exam:'CET4', script:'Hello, I would like to book a ticket to Beijing for next Monday. There is a flight at 9 am.', question:'What time is the flight?', options:['A. 7 am','B. 9 am','C. 11 am','D. 2 pm'], answer:'B', analysis:'对话中说早上9点的航班。' },
  { exam:'CET4', script:'Excuse me, where is the library? Go straight and turn left at the second intersection.', question:'Where is the library?', options:['A. Turn right','B. Turn left at second intersection','C. Go back','D. Next to gate'], answer:'B', analysis:'在第二个路口左转。' },
  { exam:'CET6', script:'Today we discuss climate change impact on agriculture. Rising temperatures caused crop failures.', question:'What is the lecture about?', options:['A. Technology','B. Climate change and agriculture','C. Population','D. Urban development'], answer:'B', analysis:'讲座关于气候变化对农业的影响。' }
];
let listeningFilter={exam:'all'};
function loadListening(){ if(!localStorage.getItem('listeningQs'))localStorage.setItem('listeningQs',JSON.stringify(listeningQs)); window.listeningQs=JSON.parse(localStorage.getItem('listeningQs')); renderListeningSelector(); }
function renderListeningSelector(){ document.getElementById('listening-area').innerHTML=`<p>选择类型：</p ><span class="tag active" onclick="selectListeningExam('all',this)">全部</span><span class="tag" onclick="selectListeningExam('CET4',this)">四级</span><span class="tag" onclick="selectListeningExam('CET6',this)">六级</span><div id="listening-list" style="margin-top:12px;"></div>`; renderListeningList(); }
function selectListeningExam(exam,el){ document.querySelectorAll('#listening-area .tag').forEach(t=>t.classList.remove('active')); el.classList.add('active'); listeningFilter.exam=exam; renderListeningList(); }
function renderListeningList(){ let qs=window.listeningQs; if(listeningFilter.exam!=='all')qs=qs.filter(q=>q.exam===listeningFilter.exam); document.getElementById('listening-list').innerHTML=qs.length===0?'<p>暂无题目</p >':qs.map((q,i)=>`<div class="list-item" style="cursor:pointer;" onclick="startListening(${i},'${listeningFilter.exam}')"><span>🎧 听力题${i+1}</span><span class="tag">${q.exam}</span><span>➡</span></div>`).join(''); }
function startListening(idx,exam){ let qs=window.listeningQs; if(exam!=='all')qs=qs.filter(q=>q.exam===exam); const q=qs[idx]; document.getElementById('listening-area').innerHTML=`<button class="btn" style="margin-bottom:12px;" onclick="renderListeningSelector()">⬅ 返回</button><div style="padding:12px;background:#f9fdf9;border-radius:8px;"><span class="tag">${q.exam}</span><span class="tag">听力</span><button class="btn" style="margin:8px 0;" onclick="playAudio('${q.script.replace(/'/g,"\\'")}',this)">🔊 播放听力</button><p><b>${q.question}</b></p >${q.options.map(o=>`<div class="option-item" onclick="checkListenSingle(this,'${o}','${q.answer}')">${o}</div>`).join('')}<div id="listen-analysis-single" style="display:none;margin-top:8px;padding:8px;background:#e8f5e9;border-radius:8px;">💡 ${q.analysis}<br>📝 原文：${q.script}</div></div><button class="btn" style="margin-top:12px;" onclick="nextListening(${idx},'${exam}')">下一题 ➡</button>`; }
function checkListenSingle(el,sel,ans){ const s=el.parentElement.querySelectorAll('.option-item'); s.forEach(x=>x.style.pointerEvents='none'); if(sel===ans){el.classList.add('correct');addStars(1);} else{el.classList.add('wrong');s.forEach(x=>{if(x.textContent===ans)x.classList.add('correct');});} document.getElementById('listen-analysis-single').style.display='block'; }
function nextListening(idx,exam){ let qs=window.listeningQs; if(exam!=='all')qs=qs.filter(q=>q.exam===exam); startListening((idx+1)%qs.length,exam); }
function playAudio(text,btn){ const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=0.9;btn.textContent='🔊 播放中...';btn.disabled=true;u.onend=()=>{btn.textContent='🔊 播放听力';btn.disabled=false;};speechSynthesis.speak(u);}

const vocabList=[
  { word:'abandon', phonetic:'/əˈbændən/', meaning:'放弃', example:'He abandoned his plan.', exam:'CET4' },
  { word:'benefit', phonetic:'/ˈbenɪfɪt/', meaning:'好处', example:'Exercise benefits health.', exam:'CET4' },
  { word:'challenge', phonetic:'/ˈtʃælɪndʒ/', meaning:'挑战', example:'She enjoys challenges.', exam:'CET4' },
  { word:'determine', phonetic:'/dɪˈtɜːmɪn/', meaning:'决定', example:'Determine the cause.', exam:'CET4' },
  { word:'evidence', phonetic:'/ˈevɪdəns/', meaning:'证据', example:'No evidence.', exam:'CET4' },
  { word:'fundamental', phonetic:'/ˌfʌndəˈmentl/', meaning:'基本的', example:'A fundamental question.', exam:'CET6' },
  { word:'guarantee', phonetic:'/ˌɡærənˈtiː/', meaning:'保证', example:'I cannot guarantee.', exam:'CET6' },
  { word:'hypothesis', phonetic:'/haɪˈpɒθəsɪs/', meaning:'假说', example:'Test the hypothesis.', exam:'PG' },
  { word:'inevitable', phonetic:'/ɪnˈevɪtəbl/', meaning:'不可避免的', example:'Change is inevitable.', exam:'PG' },
  { word:'justify', phonetic:'/ˈdʒʌstɪfaɪ/', meaning:'证明正当', example:'Justify your decision.', exam:'PG' }
];
let vocabIdx=0;
function loadVocabCard(){ if(!localStorage.getItem('vocabList'))localStorage.setItem('vocabList',JSON.stringify(vocabList)); showVocabCard(JSON.parse(localStorage.getItem('vocabList'))); }
function showVocabCard(v){ if(vocabIdx>=v.length)vocabIdx=0; const w=v[vocabIdx]; document.getElementById('vocab-card').innerHTML=`<div style="text-align:center;padding:30px;background:#f9fdf9;border-radius:12px;min-height:250px;"><div style="font-size:36px;font-weight:bold;color:#2e7d32;">${w.word}</div><div style="font-size:18px;color:#666;">${w.phonetic}</div><button class="btn" onclick="speakWord('${w.word}')">🔊 听发音</button><div style="margin-top:16px;font-size:20px;"><b>${w.meaning}</b></div><div style="margin-top:12px;color:#888;">📖 ${w.example}</div><span class="tag">${w.exam}</span><div style="margin-top:20px;display:flex;justify-content:center;gap:12px;"><button class="btn" onclick="prevVocab()">⬅</button><span>${vocabIdx+1}/${v.length}</span><button class="btn" onclick="nextVocab()">➡</button></div></div>`; }
function speakWord(w){ const u=new SpeechSynthesisUtterance(w);u.lang='en-US';u.rate=0.8;speechSynthesis.speak(u); }
function nextVocab(){ vocabIdx++; addStars(1); showVocabCard(JSON.parse(localStorage.getItem('vocabList'))); }
function prevVocab(){ vocabIdx--; if(vocabIdx<0)vocabIdx=JSON.parse(localStorage.getItem('vocabList')).length-1; showVocabCard(JSON.parse(localStorage.getItem('vocabList'))); }

const shadowSentences=[
  'The rapid development of technology has changed our daily lives.',
  'Environmental protection is a responsibility for everyone.',
  'Learning a new language opens doors to different cultures.',
  'Regular exercise helps maintain physical and mental health.',
  'Education is the most powerful weapon to change the world.'
];
let shadowIdx=0;
function loadShadowing(){ document.getElementById('shadowing-area').innerHTML=`<div style="text-align:center;padding:20px;"><p style="font-size:22px;color:#2e7d32;">${shadowSentences[shadowIdx]}</p ><button class="btn" onclick="playShadow()">🔊 朗读</button><button class="btn" onclick="nextShadow()">下一句 ➡</button><p style="margin-top:8px;color:#999;">${shadowIdx+1}/${shadowSentences.length}</p ><div style="margin-top:16px;padding:12px;background:#fff3cd;border-radius:8px;text-align:left;"><b>🎤 步骤：</b><br>1. 点朗读听一遍<br>2. 大声跟读<br>3. 点录音对比</div><button class="btn" id="record-btn" onclick="toggleRecord()">🎙️ 开始录音</button><audio id="record-playback" controls style="display:none;margin-top:8px;width:100%;"></audio></div>`; }
function playShadow(){ const u=new SpeechSynthesisUtterance(shadowSentences[shadowIdx]);u.lang='en-US';u.rate=0.85;speechSynthesis.speak(u); }
function nextShadow(){ shadowIdx++; if(shadowIdx>=shadowSentences.length)shadowIdx=0; addStars(2); loadShadowing(); }
let mediaRecorder,audioChunks=[];
async function toggleRecord(){ const btn=document.getElementById('record-btn'); if(mediaRecorder&&mediaRecorder.state==='recording'){mediaRecorder.stop();btn.textContent='🎙️ 开始录音';return;} try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});mediaRecorder=new MediaRecorder(stream);audioChunks=[];mediaRecorder.ondataavailable=e=>audioChunks.push(e.data);mediaRecorder.onstop=()=>{const blob=new Blob(audioChunks,{type:'audio/webm'});document.getElementById('record-playback').src=URL.createObjectURL(blob);document.getElementById('record-playback').style.display='block';};mediaRecorder.start();btn.textContent='⏹️ 停止录音';}catch(e){alert('请允许麦克风');} }

function loadWriting(){ const m=[{type:'四级模板',content:'Nowadays, ___ has become a hot topic. First, ___. Moreover, ___. Finally, ___. In conclusion, ___.'},{type:'六级模板',content:'It is acknowledged that ___. Some believe ___, others argue ___. From my perspective, ___.'},{type:'考研小作文',content:'Dear ___, I am writing to express my ___ regarding ___. Yours, ___'},{type:'万能句型',content:'It goes without saying that... 毫无疑问...'},{type:'万能句型',content:'There is no denying that... 不可否认...'}]; if(!localStorage.getItem('writingMaterials'))localStorage.setItem('writingMaterials',JSON.stringify(m)); document.getElementById('writing-materials').innerHTML=JSON.parse(localStorage.getItem('writingMaterials')).map(i=>`<div style="padding:12px;background:#f9fdf9;border-radius:8px;margin-bottom:8px;"><span class="tag">${i.type}</span><p>${i.content}</p ></div>`).join(''); }
// ==================== 每日计划 ====================
function renderPlan(c){
  const dt=['背单词30个','专业课学习1小时','药师资格证复习30分钟','运动30分钟'];
  let tasks=JSON.parse(localStorage.getItem('dailyTasks'))||dt;
  if(!localStorage.getItem('dailyTasks'))localStorage.setItem('dailyTasks',JSON.stringify(dt));
  const comp=JSON.parse(localStorage.getItem('completedTasks'))||[];
  const today=new Date().toDateString();
  const lastReset=localStorage.getItem('lastReset')||'';
  if(lastReset!==today){ localStorage.setItem('completedTasks','[]'); localStorage.setItem('lastReset',today); location.reload(); }
  c.innerHTML=`
    <div class="card"><h2>📋 今日待办</h2><div id="task-list">${tasks.map((t,i)=>`<div class="list-item"><div style="display:flex;align-items:center;"><input type="checkbox" class="task-checkbox" ${comp.includes(i)?'checked':''} onchange="toggleTask(${i})"><span class="${comp.includes(i)?'task-completed':''}">${t}</span></div><button class="btn btn-danger" style="padding:4px 10px;font-size:12px;" onclick="deleteTask(${i})">删</button></div>`).join('')}</div>
      <div style="margin-top:8px;display:flex;gap:8px;"><input type="text" id="new-task" placeholder="新任务"><button class="btn" onclick="addTask()">新增</button></div>
      <div style="margin-top:8px;">📊 <div class="progress-bar"><div class="progress-fill" id="task-progress" style="width:${tasks.length?Math.round(comp.length/tasks.length*100):0}%;"></div></div>${comp.length}/${tasks.length}</div></div>
    <div class="card"><h2>🔥 连续打卡：<b id="streak-days">0</b>天</h2><button class="btn" onclick="dailyCheckin()">📅 今日打卡</button></div>
    <div class="card"><h2>🎯 目标</h2><div id="goals-list"></div><div style="display:flex;gap:8px;"><input type="text" id="new-goal" placeholder="新目标"><button class="btn" onclick="addGoal()">添加</button></div></div>`;
  loadGoals();updateStreak();
}
function toggleTask(i){
  let c=JSON.parse(localStorage.getItem('completedTasks'))||[];
  if(c.includes(i)){c=c.filter(x=>x!==i);} else {c.push(i);addStars(2);feedPetPrompt();}
  localStorage.setItem('completedTasks',JSON.stringify(c));
  renderPlan(document.getElementById('content'));
}
function feedPetPrompt(){ if(pet.exp<100&&pet.stars>=5&&confirm('🌟 获得2颗星！要投喂宠物吗？（消耗5⭐）')){feedPet();} }
function deleteTask(i){ let t=JSON.parse(localStorage.getItem('dailyTasks'))||[];t.splice(i,1);localStorage.setItem('dailyTasks',JSON.stringify(t));let c=JSON.parse(localStorage.getItem('completedTasks'))||[];c=c.filter(x=>x!==i).map(x=>x>i?x-1:x);localStorage.setItem('completedTasks',JSON.stringify(c));renderPlan(document.getElementById('content')); }
function addTask(){ const v=document.getElementById('new-task').value;if(!v)return;let t=JSON.parse(localStorage.getItem('dailyTasks'))||[];t.push(v);localStorage.setItem('dailyTasks',JSON.stringify(t));renderPlan(document.getElementById('content')); }
function dailyCheckin(){ const td=new Date().toDateString();let c=JSON.parse(localStorage.getItem('checkins'))||[];if(c.includes(td)){alert('已打卡！');return;}c.push(td);localStorage.setItem('checkins',JSON.stringify(c));addStars(5);updateStreak();alert('✅ 打卡成功！+5⭐');if(pet.exp<100&&pet.stars>=5&&confirm('要投喂宠物吗？（消耗5⭐）')){feedPet();} }
function updateStreak(){ let c=JSON.parse(localStorage.getItem('checkins'))||[];let s=0;const td=new Date();for(let i=0;i<365;i++){const d=new Date(td);d.setDate(d.getDate()-i);if(c.includes(d.toDateString()))s++;else if(i>0)break;}document.getElementById('streak-days').textContent=s; }
function loadGoals(){ const g=JSON.parse(localStorage.getItem('goals'))||[];document.getElementById('goals-list').innerHTML=g.length?g.map((x,i)=>`<div class="list-item"><span>🎯 ${x}</span><button class="btn btn-danger" style="padding:4px 10px;font-size:12px;" onclick="deleteGoal(${i})">删</button></div>`).join(''):'<p style="color:#999;">暂无目标</p >'; }
function addGoal(){ const v=document.getElementById('new-goal').value;if(!v)return;let g=JSON.parse(localStorage.getItem('goals'))||[];g.push(v);localStorage.setItem('goals',JSON.stringify(g));renderPlan(document.getElementById('content')); }
function deleteGoal(i){ let g=JSON.parse(localStorage.getItem('goals'))||[];g.splice(i,1);localStorage.setItem('goals',JSON.stringify(g));renderPlan(document.getElementById('content')); }
// ==================== 专业课 ====================
function renderMajor(c){
  c.innerHTML=`
    <div class="card"><h2>🌿 中药学</h2>
      <p><b>1. 麻黄</b>：辛温，发汗解表，宣肺平喘，利水消肿</p ><p><b>2. 桂枝</b>：辛甘温，发汗解肌，温通经脉，助阳化气</p >
      <p><b>3. 柴胡</b>：苦辛微寒，和解退热，疏肝解郁，升举阳气</p ><p><b>4. 黄连</b>：苦寒，清热燥湿，泻火解毒</p >
      <p><b>5. 人参</b>：甘微苦温，大补元气，补脾益肺，生津安神</p ><p><b>6. 甘草</b>：甘平，补脾益气，清热解毒，调和诸药</p >
      <p><b>7. 大黄</b>：苦寒，泻下攻积，清热泻火，凉血解毒</p ><p><b>8. 黄芪</b>：甘微温，补气升阳，固表止汗，利水消肿</p >
      <p><b>9. 当归</b>：甘辛温，补血活血，调经止痛，润肠通便</p ><p><b>10. 川芎</b>：辛温，活血行气，祛风止痛</p >
      <p><b>11. 白芍</b>：苦酸甘微寒，养血敛阴，柔肝止痛</p ><p><b>12. 茯苓</b>：甘淡平，利水渗湿，健脾宁心</p >
      <p><b>13. 半夏</b>：辛温有毒，燥湿化痰，降逆止呕</p ><p><b>14. 陈皮</b>：辛苦温，理气健脾，燥湿化痰</p >
      <p><b>15. 丹参</b>：苦微寒，活血祛瘀，凉血消痈</p ><p><b>16. 黄芩</b>：苦寒，清热燥湿，泻火解毒，止血安胎</p >
      <p><b>17. 五味子</b>：酸甘温，收敛固涩，益气生津，补肾宁心</p ><p><b>18. 附子</b>：辛甘大热有毒，回阳救逆，补火助阳</p >
      <p><b>19. 熟地黄</b>：甘微温，补血滋阴，益精填髓</p ><p><b>20. 枸杞子</b>：甘平，滋补肝肾，益精明目</p ></div>
    <div class="card"><h2>🔬 中药鉴定学</h2>
      <p><b>1. 大黄</b>：断面颗粒性，有星点，气清香，味苦微涩</p ><p><b>2. 甘草</b>：断面纤维性，形成层环明显，味甜而特殊</p >
      <p><b>3. 黄芪</b>：断面纤维性强，有粉性，皮部黄白色，木部淡黄色</p ><p><b>4. 人参</b>：断面淡黄白色，粉性，皮部有黄棕色点状树脂道</p >
      <p><b>5. 黄连</b>：断面不整齐，皮部暗棕色，木部金黄色，味极苦</p ><p><b>6. 当归</b>：断面黄白色，皮部厚有裂隙及棕色油点，香气浓郁</p >
      <p><b>7. 川芎</b>：断面黄白色，形成层呈波状环纹，有特异香气</p ><p><b>8. 白芍</b>：断面类白色，形成层环明显，射线放射状</p >
      <p><b>9. 茯苓</b>：体重质坚实，断面颗粒性，嚼之粘牙</p ><p><b>10. 半夏</b>：断面洁白，富粉性，味辛辣麻舌而刺喉</p >
      <p><b>11. 丹参</b>：断面皮部棕红色，木部灰黄色，导管束放射状</p ><p><b>12. 黄芩</b>：断面黄色，中心红棕色，老根中心枯朽</p >
      <p><b>13. 五味子</b>：果皮柔皱，种子肾形有光泽</p ><p><b>14. 附子</b>：断面类白色，形成层环多角形，味辛辣麻舌</p >
      <p><b>15. 枸杞子</b>：表面鲜红色皱缩，果肉柔润，味甜</p ></div>
    <div class="card"><h2>⚗️ 中药化学</h2>
      <p><b>1. 生物碱类</b>：麻黄碱（麻黄）、小檗碱（黄连）、吗啡（罂粟）</p >
      <p><b>2. 黄酮类</b>：黄芩苷（黄芩）、芦丁（槐花）、槲皮素（银杏）</p >
      <p><b>3. 皂苷类</b>：人参皂苷（人参）、甘草酸（甘草）、柴胡皂苷（柴胡）</p >
      <p><b>4. 蒽醌类</b>：大黄素（大黄）、番泻苷（番泻叶）</p >
      <p><b>5. 挥发油类</b>：薄荷醇（薄荷）、桂皮醛（肉桂）、丁香酚（丁香）</p >
      <p><b>6. 多糖类</b>：黄芪多糖（黄芪）、茯苓多糖（茯苓）、枸杞多糖（枸杞子）</p >
      <p><b>7. 香豆素类</b>：补骨脂素（补骨脂）、欧前胡素（白芷）</p >
      <p><b>8. 强心苷类</b>：地高辛（毛花洋地黄）、毒毛旋花子苷K</p >
      <p><b>9. 鞣质类</b>：没食子鞣质（五倍子）、儿茶素（儿茶）</p >
      <p><b>10. 有机酸类</b>：绿原酸（金银花）、柠檬酸（山楂）</p ></div>
    <div class="card"><h2>🌿 中药资源学</h2>
      <p><b>核心概念：</b>研究中药资源的种类、分布、蕴藏量、开发利用与可持续管理</p >
      <p><b>调查方法：</b>样方法、样线法、每木调查法、遥感技术、GIS系统</p >
      <p><b>可持续利用：</b>保护与开发并重，建立种质资源库，人工栽培替代野生采挖</p >
      <p><b>濒危药材：</b>野生人参、三七、川贝母、冬虫夏草需加强保护</p >
      <p><b>道地药材：</b>四大怀药（地黄、牛膝、山药、菊花）、浙八味、川药、广药</p ></div>
    <div class="card"><h2>🌺 药用植物学</h2>
      <p><b>1. 唇形科</b>：茎四棱、花冠唇形——黄芩、薄荷、丹参、紫苏</p >
      <p><b>2. 菊科</b>：头状花序，聚药雄蕊——菊花、苍术、红花、蒲公英</p >
      <p><b>3. 豆科</b>：荚果，蝶形花冠——甘草、黄芪、苦参、葛根</p >
      <p><b>4. 伞形科</b>：复伞形花序，双悬果——当归、川芎、白芷、柴胡</p >
      <p><b>5. 蓼科</b>：节膨大，瘦果——大黄、何首乌、虎杖</p >
      <p><b>6. 毛茛科</b>：雄蕊和心皮多数——黄连、附子、白芍、牡丹皮</p >
      <p><b>7. 百合科</b>：花被6枚，雄蕊6枚——贝母、玉竹、黄精、麦冬</p >
      <p><b>8. 桔梗科</b>：花冠钟状——桔梗、党参、沙参</p >
      <p><b>9. 五加科</b>：伞形花序——人参、三七、刺五加</p >
      <p><b>10. 姜科</b>：唇瓣，能育雄蕊1枚——砂仁、豆蔻、姜黄、郁金</p >
      <p><b>11. 木兰科</b>：花被多轮——厚朴、五味子、八角茴香</p >
      <p><b>12. 茄科</b>：花冠辐状——枸杞、颠茄、洋金花</p >
      <p><b>13. 十字花科</b>：十字花冠，四强雄蕊——菘蓝（板蓝根）、莱菔子</p >
      <p><b>14. 茜草科</b>：叶对生有托叶——栀子、茜草、巴戟天、钩藤</p >
      <p><b>15. 玄参科</b>：花冠二唇形——地黄、玄参、胡黄连</p ></div>
    <div class="card"><h2>📝 易混点</h2>
      <p>❌ 大黄(蓼科) vs 何首乌(蓼科) → 大黄断面有星点，何首乌无</p >
      <p>❌ 黄连(毛茛科) vs 黄柏(芸香科) → 黄连断面金黄色，黄柏黄色带棕色</p >
      <p>❌ 人参 vs 西洋参 → 人参补气，西洋参补阴</p >
      <p>❌ 白芍 vs 赤芍 → 白芍养血敛阴，赤芍清热凉血散瘀</p >
      <p>❌ 川贝母 vs 浙贝母 → 川贝润肺，浙贝散结力强</p ></div>
    <div class="card"><h2>🎯 南中医·中药资源与开发</h2><p>📅 考研倒计时：<b id="countdown"></b></p ><p>📖 初试：政治、英语、中药学综合</p ><p>📚 参考书目：《中药学》《中药化学》《中药鉴定学》《药用植物学》《中药资源学》</p ></div>`;
  document.getElementById('countdown').textContent=Math.ceil((new Date('2027-12-25')-new Date())/(1000*60*60*24))+'天';
}
// ==================== 药师资格证 ====================
const pharmQs=[
  { subject:'药事管理与法规', question:'《药品管理法》规定药品必须符合：', options:['A.国家标准','B.地方标准','C.企业标准','D.行业标准'], answer:'A', analysis:'药品必须符合国家标准。' },
  { subject:'药事管理与法规', question:'处方保存期限为：', options:['A.1年','B.2年','C.3年','D.5年'], answer:'B', analysis:'处方保存2年。' },
  { subject:'药事管理与法规', question:'特殊管理药品不包括：', options:['A.麻醉药品','B.精神药品','C.抗生素','D.放射性药品'], answer:'C', analysis:'特殊管理药品：麻醉、精神、毒性、放射性。' },
  { subject:'药事管理与法规', question:'GMP的全称是：', options:['A.药品经营质量管理规范','B.药品生产质量管理规范','C.药品临床质量管理规范','D.药品注册管理办法'], answer:'B', analysis:'GMP=Good Manufacturing Practice。' },
  { subject:'药事管理与法规', question:'处方一般不得超过几日用量？', options:['A.3日','B.7日','C.14日','D.30日'], answer:'B', analysis:'处方一般不得超过7日用量。' },
  { subject:'药学综合知识与技能', question:'不属于药学服务内容的是：', options:['A.处方审核','B.用药指导','C.疾病诊断','D.不良反应监测'], answer:'C', analysis:'疾病诊断是医师职责。' },
  { subject:'药学综合知识与技能', question:'特殊人群不包括：', options:['A.老年人','B.儿童','C.孕妇','D.成年人'], answer:'D', analysis:'特殊人群指老人、儿童、孕妇、哺乳期等。' },
  { subject:'药学综合知识与技能', question:'服药时间错误的是：', options:['A.降压药晨起服','B.降脂药睡前服','C.抗生素饭后服','D.所有药都饭后服'], answer:'D', analysis:'不同药物服用时间不同，非所有都饭后。' },
  { subject:'药学综合知识与技能', question:'药品不良反应监测属于：', options:['A.临床前研究','B.临床I期','C.临床IV期','D.药品注册'], answer:'C', analysis:'IV期临床为上市后监测。' },
  { subject:'药学综合知识与技能', question:'用药咨询不包括：', options:['A.用法用量','B.不良反应','C.诊断疾病','D.药物相互作用'], answer:'C', analysis:'药师不能诊断疾病。' },
  { subject:'药学专业知识一', question:'阿司匹林的药理作用是：', options:['A.解热镇痛抗炎','B.抗菌','C.抗病毒','D.抗肿瘤'], answer:'A', analysis:'阿司匹林抑制环氧酶，解热镇痛抗炎。' },
  { subject:'药学专业知识一', question:'青霉素的抗菌机制是：', options:['A.抑制细胞壁合成','B.抑制蛋白质合成','C.抑制DNA复制','D.破坏细胞膜'], answer:'A', analysis:'青霉素抑制细菌细胞壁肽聚糖合成。' },
  { subject:'药学专业知识一', question:'属于β-内酰胺类抗生素的是：', options:['A.庆大霉素','B.头孢拉定','C.四环素','D.红霉素'], answer:'B', analysis:'头孢菌素类属于β-内酰胺类。' },
  { subject:'药学专业知识一', question:'吗啡的作用机制是：', options:['A.激动阿片受体','B.阻断阿片受体','C.抑制环氧酶','D.激动多巴胺受体'], answer:'A', analysis:'吗啡激动阿片μ受体产生镇痛。' },
  { subject:'药学专业知识一', question:'地高辛用于治疗：', options:['A.高血压','B.心力衰竭','C.糖尿病','D.哮喘'], answer:'B', analysis:'地高辛是强心苷，用于心力衰竭。' },
  { subject:'药学专业知识二', question:'胰岛素的主要作用是：', options:['A.升高血糖','B.降低血糖','C.升高血压','D.降低血压'], answer:'B', analysis:'胰岛素促进葡萄糖摄取，降低血糖。' },
  { subject:'药学专业知识二', question:'糖皮质激素不包括：', options:['A.抗炎','B.抗过敏','C.抗休克','D.抗病毒'], answer:'D', analysis:'糖皮质激素无抗病毒作用。' },
  { subject:'药学专业知识二', question:'奥美拉唑的作用是：', options:['A.抑制胃酸分泌','B.促进胃酸分泌','C.保护胃黏膜','D.抗菌'], answer:'A', analysis:'奥美拉唑是质子泵抑制剂。' },
  { subject:'药学专业知识二', question:'二甲双胍属于：', options:['A.磺脲类','B.双胍类','C.胰岛素','D.α-糖苷酶抑制剂'], answer:'B', analysis:'二甲双胍是双胍类口服降糖药。' },
  { subject:'药学专业知识二', question:'阿托品的作用是：', options:['A.抑制腺体分泌','B.促进腺体分泌','C.降低心率','D.降压'], answer:'A', analysis:'阿托品是M受体阻断剂，抑制腺体分泌。' }
];
function renderPharmacist(c){
  c.innerHTML=`
    <div class="card"><h2>💊 药师题库</h2><div id="pharm-area"></div></div>
    <div class="card"><h2>📖 重点背诵</h2>
      <p>📖 <b>GMP</b>：药品生产质量管理规范</p ><p>📖 <b>GSP</b>：药品经营质量管理规范</p >
      <p>📖 <b>特殊管理药品</b>：麻醉药品、精神药品、医疗用毒性药品、放射性药品</p >
      <p>📖 <b>处方管理办法</b>：处方一般不得超过7日用量，急诊处方不超过3日</p >
      <p>📖 <b>配伍禁忌</b>：青霉素与氨基糖苷类不可同瓶滴注</p >
      <p>📖 <b>四查十对</b>：查处方、查药品、查配伍禁忌、查用药合理性</p >
      <p>📖 <b>ADR</b>：药品不良反应，上市后监测属于临床IV期</p ></div>
    <div class="card"><h2>⏳ 药师考试倒计时</h2><p><b id="pharm-countdown"></b></p ></div>`;
  if(!localStorage.getItem('pharmQs'))localStorage.setItem('pharmQs',JSON.stringify(pharmQs));
  document.getElementById('pharm-area').innerHTML=JSON.parse(localStorage.getItem('pharmQs')).map((q,i)=>`
    <div style="padding:12px;margin:8px 0;background:#f9fdf9;border-radius:8px;">
      <span class="tag">${q.subject}</span>
      <p><b>${i+1}. ${q.question}</b></p >
      ${q.options.map(o=>`<div class="option-item" onclick="checkPharm(this,'${o}','${q.answer}')">${o}</div>`).join('')}
      <div id="pharm-analysis-${i}" style="display:none;margin-top:8px;padding:8px;background:#e8f5e9;border-radius:8px;">💡 ${q.analysis}</div>
    </div>`).join('');
  document.getElementById('pharm-countdown').textContent=Math.ceil((new Date('2027-10-15')-new Date())/(1000*60*60*24))+'天';
}
function checkPharm(el,sel,ans){
  const s=el.parentElement.querySelectorAll('.option-item');s.forEach(x=>x.style.pointerEvents='none');
  const idx=Array.from(el.parentElement.parentElement.children).indexOf(el.parentElement);
  if(sel===ans){el.classList.add('correct');addStars(1);} else{el.classList.add('wrong');s.forEach(x=>{if(x.textContent===ans)x.classList.add('correct');});}
  document.getElementById('pharm-analysis-'+idx).style.display='block';
}

// ==================== 记账 ====================
function renderFinance(c){
  c.innerHTML=`
    <div class="card"><h2>💰 记账</h2>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
        <input type="text" id="f-desc" placeholder="用途" style="width:150px;">
        <input type="number" id="f-amount" placeholder="金额" style="width:100px;">
        <select id="f-cat"><option>学习资料</option><option>网课</option><option>生活</option><option>娱乐</option><option>考研专区</option><option>药师备考</option></select>
        <button class="btn" onclick="addFinance()">记一笔</button>
      </div>
      <div id="finance-list"></div>
      <p style="margin-top:12px;">📊 本月支出：<b id="month-total">0</b>元</p >
    </div>`;
  loadFinance();
}
function addFinance(){
  const d=document.getElementById('f-desc').value;
  const a=document.getElementById('f-amount').value;
  const c=document.getElementById('f-cat').value;
  if(!d||!a)return;
  let r=JSON.parse(localStorage.getItem('finance'))||[];
  r.push({desc:d,amount:parseFloat(a),cat:c,date:new Date().toLocaleDateString()});
  localStorage.setItem('finance',JSON.stringify(r));
  renderFinance(document.getElementById('content'));
}
function loadFinance(){
  const r=JSON.parse(localStorage.getItem('finance'))||[];
  document.getElementById('finance-list').innerHTML=r.length===0?'<p style="color:#999;">暂无记录</p >':r.map(i=>`<div class="list-item"><span>${i.date} | ${i.cat} | ${i.desc}</span><span>${i.amount}元</span></div>`).join('');
  const m=new Date().getMonth();
  document.getElementById('month-total').textContent=r.filter(i=>new Date(i.date).getMonth()===m).reduce((s,i)=>s+i.amount,0);
}
// ==================== 药师资格证 ====================
const pharmQs=[
  { subject:'药事管理与法规', question:'《药品管理法》规定药品必须符合：', options:['A.国家标准','B.地方标准','C.企业标准','D.行业标准'], answer:'A', analysis:'药品必须符合国家标准。' },
  { subject:'药事管理与法规', question:'处方保存期限为：', options:['A.1年','B.2年','C.3年','D.5年'], answer:'B', analysis:'处方保存2年。' },
  { subject:'药事管理与法规', question:'特殊管理药品不包括：', options:['A.麻醉药品','B.精神药品','C.抗生素','D.放射性药品'], answer:'C', analysis:'特殊管理药品：麻醉、精神、毒性、放射性。' },
  { subject:'药事管理与法规', question:'GMP的全称是：', options:['A.药品经营质量管理规范','B.药品生产质量管理规范','C.药品临床质量管理规范','D.药品注册管理办法'], answer:'B', analysis:'GMP=Good Manufacturing Practice。' },
  { subject:'药事管理与法规', question:'处方一般不得超过几日用量？', options:['A.3日','B.7日','C.14日','D.30日'], answer:'B', analysis:'处方一般不得超过7日用量。' },
  { subject:'药学综合知识与技能', question:'不属于药学服务内容的是：', options:['A.处方审核','B.用药指导','C.疾病诊断','D.不良反应监测'], answer:'C', analysis:'疾病诊断是医师职责。' },
  { subject:'药学综合知识与技能', question:'特殊人群不包括：', options:['A.老年人','B.儿童','C.孕妇','D.成年人'], answer:'D', analysis:'特殊人群指老人、儿童、孕妇、哺乳期等。' },
  { subject:'药学综合知识与技能', question:'服药时间错误的是：', options:['A.降压药晨起服','B.降脂药睡前服','C.抗生素饭后服','D.所有药都饭后服'], answer:'D', analysis:'不同药物服用时间不同，非所有都饭后。' },
  { subject:'药学综合知识与技能', question:'药品不良反应监测属于：', options:['A.临床前研究','B.临床I期','C.临床IV期','D.药品注册'], answer:'C', analysis:'IV期临床为上市后监测。' },
  { subject:'药学综合知识与技能', question:'用药咨询不包括：', options:['A.用法用量','B.不良反应','C.诊断疾病','D.药物相互作用'], answer:'C', analysis:'药师不能诊断疾病。' },
  { subject:'药学专业知识一', question:'阿司匹林的药理作用是：', options:['A.解热镇痛抗炎','B.抗菌','C.抗病毒','D.抗肿瘤'], answer:'A', analysis:'阿司匹林抑制环氧酶，解热镇痛抗炎。' },
  { subject:'药学专业知识一', question:'青霉素的抗菌机制是：', options:['A.抑制细胞壁合成','B.抑制蛋白质合成','C.抑制DNA复制','D.破坏细胞膜'], answer:'A', analysis:'青霉素抑制细菌细胞壁肽聚糖合成。' },
  { subject:'药学专业知识一', question:'属于β-内酰胺类抗生素的是：', options:['A.庆大霉素','B.头孢拉定','C.四环素','D.红霉素'], answer:'B', analysis:'头孢菌素类属于β-内酰胺类。' },
  { subject:'药学专业知识一', question:'吗啡的作用机制是：', options:['A.激动阿片受体','B.阻断阿片受体','C.抑制环氧酶','D.激动多巴胺受体'], answer:'A', analysis:'吗啡激动阿片μ受体产生镇痛。' },
  { subject:'药学专业知识一', question:'地高辛用于治疗：', options:['A.高血压','B.心力衰竭','C.糖尿病','D.哮喘'], answer:'B', analysis:'地高辛是强心苷，用于心力衰竭。' },
  { subject:'药学专业知识二', question:'胰岛素的主要作用是：', options:['A.升高血糖','B.降低血糖','C.升高血压','D.降低血压'], answer:'B', analysis:'胰岛素促进葡萄糖摄取，降低血糖。' },
  { subject:'药学专业知识二', question:'糖皮质激素不包括：', options:['A.抗炎','B.抗过敏','C.抗休克','D.抗病毒'], answer:'D', analysis:'糖皮质激素无抗病毒作用。' },
  { subject:'药学专业知识二', question:'奥美拉唑的作用是：', options:['A.抑制胃酸分泌','B.促进胃酸分泌','C.保护胃黏膜','D.抗菌'], answer:'A', analysis:'奥美拉唑是质子泵抑制剂。' },
  { subject:'药学专业知识二', question:'二甲双胍属于：', options:['A.磺脲类','B.双胍类','C.胰岛素','D.α-糖苷酶抑制剂'], answer:'B', analysis:'二甲双胍是双胍类口服降糖药。' },
  { subject:'药学专业知识二', question:'阿托品的作用是：', options:['A.抑制腺体分泌','B.促进腺体分泌','C.降低心率','D.降压'], answer:'A', analysis:'阿托品是M受体阻断剂，抑制腺体分泌。' }
];
function renderPharmacist(c){
  c.innerHTML=`
    <div class="card"><h2>💊 药师题库</h2><div id="pharm-area"></div></div>
    <div class="card"><h2>📖 重点背诵</h2>
      <p>📖 <b>GMP</b>：药品生产质量管理规范</p ><p>📖 <b>GSP</b>：药品经营质量管理规范</p >
      <p>📖 <b>特殊管理药品</b>：麻醉药品、精神药品、医疗用毒性药品、放射性药品</p >
      <p>📖 <b>处方管理办法</b>：处方一般不得超过7日用量，急诊处方不超过3日</p >
      <p>📖 <b>配伍禁忌</b>：青霉素与氨基糖苷类不可同瓶滴注</p >
      <p>📖 <b>四查十对</b>：查处方、查药品、查配伍禁忌、查用药合理性</p >
      <p>📖 <b>ADR</b>：药品不良反应，上市后监测属于临床IV期</p ></div>
    <div class="card"><h2>⏳ 药师考试倒计时</h2><p><b id="pharm-countdown"></b></p ></div>`;
  if(!localStorage.getItem('pharmQs'))localStorage.setItem('pharmQs',JSON.stringify(pharmQs));
  document.getElementById('pharm-area').innerHTML=JSON.parse(localStorage.getItem('pharmQs')).map((q,i)=>`
    <div style="padding:12px;margin:8px 0;background:#f9fdf9;border-radius:8px;">
      <span class="tag">${q.subject}</span>
      <p><b>${i+1}. ${q.question}</b></p >
      ${q.options.map(o=>`<div class="option-item" onclick="checkPharm(this,'${o}','${q.answer}')">${o}</div>`).join('')}
      <div id="pharm-analysis-${i}" style="display:none;margin-top:8px;padding:8px;background:#e8f5e9;border-radius:8px;">💡 ${q.analysis}</div>
    </div>`).join('');
  document.getElementById('pharm-countdown').textContent=Math.ceil((new Date('2027-10-15')-new Date())/(1000*60*60*24))+'天';
}
function checkPharm(el,sel,ans){
  const s=el.parentElement.querySelectorAll('.option-item');s.forEach(x=>x.style.pointerEvents='none');
  const idx=Array.from(el.parentElement.parentElement.children).indexOf(el.parentElement);
  if(sel===ans){el.classList.add('correct');addStars(1);} else{el.classList.add('wrong');s.forEach(x=>{if(x.textContent===ans)x.classList.add('correct');});}
  document.getElementById('pharm-analysis-'+idx).style.display='block';
}

// ==================== 记账 ====================
function renderFinance(c){
  c.innerHTML=`
    <div class="card"><h2>💰 记账</h2>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
        <input type="text" id="f-desc" placeholder="用途" style="width:150px;">
        <input type="number" id="f-amount" placeholder="金额" style="width:100px;">
        <select id="f-cat"><option>学习资料</option><option>网课</option><option>生活</option><option>娱乐</option><option>考研专区</option><option>药师备考</option></select>
        <button class="btn" onclick="addFinance()">记一笔</button>
      </div>
      <div id="finance-list"></div>
      <p style="margin-top:12px;">📊 本月支出：<b id="month-total">0</b>元</p >
    </div>`;
  loadFinance();
}
function addFinance(){
  const d=document.getElementById('f-desc').value;
  const a=document.getElementById('f-amount').value;
  const c=document.getElementById('f-cat').value;
  if(!d||!a)return;
  let r=JSON.parse(localStorage.getItem('finance'))||[];
  r.push({desc:d,amount:parseFloat(a),cat:c,date:new Date().toLocaleDateString()});
  localStorage.setItem('finance',JSON.stringify(r));
  renderFinance(document.getElementById('content'));
}
function loadFinance(){
  const r=JSON.parse(localStorage.getItem('finance'))||[];
  document.getElementById('finance-list').innerHTML=r.length===0?'<p style="color:#999;">暂无记录</p >':r.map(i=>`<div class="list-item"><span>${i.date} | ${i.cat} | ${i.desc}</span><span>${i.amount}元</span></div>`).join('');
  const m=new Date().getMonth();
  document.getElementById('month-total').textContent=r.filter(i=>new Date(i.date).getMonth()===m).reduce((s,i)=>s+i.amount,0);
}
