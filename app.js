// ==================== Supabase 配置 ====================
const SUPABASE_URL = 'https://oeibttbtkvdpatpowxmu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UC--7FeY5A4V0BA-r95UVw_xQDMjOQ7';

// ==================== 页面导航 ====================
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    loadPage(item.dataset.page);
  });
});

function loadPage(page) {
  const content = document.getElementById('content');
  switch(page) {
    case 'english': renderEnglishPage(content); break;
    case 'plan': renderPlanPage(content); break;
    case 'major': renderMajorPage(content); break;
    case 'pharmacist': renderPharmacistPage(content); break;
    case 'finance': renderFinancePage(content); break;
    case 'news': renderNewsPage(content); break;
    case 'videos': renderVideosPage(content); break;
  }
}

// ==================== 电子宠物 ====================
let petData = JSON.parse(localStorage.getItem('petData')) || { name: '小绿芽', level: 1, exp: 0 };
const petStages = ['🥚', '🌱', '🌿', '🪴', '🌳', '🌟'];
const petContainer = document.getElementById('pet-container');

function renderPet() {
  const stage = Math.min(Math.floor(petData.exp / 100), 5);
  petContainer.innerHTML = `
    <div class="pet-box" onclick="feedPet()">
      <div class="pet-emoji">${petStages[stage]}</div>
      <div class="pet-name">${petData.name}</div>
      <div style="font-size:12px;color:#666;">Lv.${petData.level}</div>
      <div class="progress-bar" style="width:80px;margin:4px auto;">
        <div class="progress-fill" style="width:${petData.exp % 100}%;"></div>
      </div>
    </div>
  `;
}

function feedPet() {
  petData.exp += 20;
  if (petData.exp >= 100) { petData.level++; petData.exp = 0; alert('🎉 升级了！Lv.' + petData.level); }
  localStorage.setItem('petData', JSON.stringify(petData));
  renderPet();
}
renderPet();

// ==================== 英语学习专区 ====================
function renderEnglishPage(container) {
  container.innerHTML = `
    <div class="card"><h2>📖 真题题库</h2>
      <div id="exam-filters"><span class="tag active" onclick="filterExam('all')">全部</span><span class="tag" onclick="filterExam('CET4')">四级</span><span class="tag" onclick="filterExam('CET6')">六级</span><span class="tag" onclick="filterExam('PG')">考研</span></div>
      <div id="question-area"></div>
      <div style="margin-top:12px;">📊 刷题量：<b id="total-count">0</b> | ✅ 正确率：<b id="accuracy">0%</b>
        <div class="progress-bar"><div class="progress-fill" id="exam-progress" style="width:0%;"></div></div>
      </div>
    </div>
    <div class="card"><h2>📝 错题本</h2><div id="wrong-questions"></div></div>
    <div class="card"><h2>📒 生词本</h2><div id="vocabulary-list"></div></div>
    <div class="card"><h2>✍️ 写作素材</h2><div id="writing-materials"></div></div>
    <div class="card"><h2>🎤 口语跟读</h2><div id="speaking-area"></div></div>
  `;
  loadEnglishQuestions();
  loadVocabulary();
  loadWritingMaterials();
  loadSpeaking();
}

const builtInQuestions = [
  { exam_type:'CET4', question_type:'阅读', question:'What is the main idea of the passage?', options:['A. Economic growth','B. Environmental awareness','C. Technology','D. Social media'], answer:'B', analysis:'文章主旨是环保意识。' },
  { exam_type:'CET4', question_type:'阅读', question:'Which is NOT a benefit of exercise?', options:['A. Better sleep','B. Increased stress','C. Improved mood','D. Stronger bones'], answer:'B', analysis:'运动不会增加压力。' },
  { exam_type:'CET4', question_type:'选词填空', question:'The company is trying to ___ its market share.', options:['expand','contract','ignore','abandon'], answer:'expand', analysis:'expand意为扩展。' },
  { exam_type:'CET4', question_type:'翻译', question:'请翻译：中国传统文化源远流长。', options:[], answer:'Traditional Chinese culture has a long and profound history.', analysis:'' },
  { exam_type:'CET6', question_type:'阅读', question:'Globalization has led to ___.', options:['A. Cultural homogenization','B. Economic decline','C. Political stability','D. Environmental protection'], answer:'A', analysis:'全球化导致文化同质化。' },
  { exam_type:'CET6', question_type:'阅读', question:'The researchers found ___.', options:['A. Inconclusive results','B. Strong correlation','C. No relationship','D. Previous errors'], answer:'B', analysis:'研究发现强相关性。' },
  { exam_type:'PG', question_type:'阅读', question:'The primary purpose is to ___.', options:['A. Criticize policies','B. Propose a theory','C. Describe events','D. Analyze data'], answer:'B', analysis:'文章目的是提出新理论。' },
  { exam_type:'PG', question_type:'翻译', question:'中医药现代化需要科技创新与国际合作。', options:[], answer:'Modernization of TCM requires technological innovation and international cooperation.', analysis:'' }
];

function loadEnglishQuestions() {
  window.currentQuestions = JSON.parse(localStorage.getItem('englishQuestions')) || builtInQuestions;
  if(!localStorage.getItem('englishQuestions')) localStorage.setItem('englishQuestions', JSON.stringify(builtInQuestions));
  filterExam('all');
}

function filterExam(type) {
  document.querySelectorAll('#exam-filters .tag').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  const filtered = type==='all' ? window.currentQuestions : window.currentQuestions.filter(q => q.exam_type===type);
  renderQuestions(filtered);
  updateStats(filtered);
}

function renderQuestions(questions) {
  document.getElementById('question-area').innerHTML = questions.map((q,i) => `
    <div style="padding:12px;margin:8px 0;background:#f9fdf9;border-radius:8px;">
      <span class="tag">${q.exam_type}</span><span class="tag">${q.question_type}</span>
      <p style="margin:8px 0;"><b>${i+1}. ${q.question}</b></p>
      ${q.options.length>0 ? q.options.map(o => `<div class="option-item" onclick="checkAnswer(this,'${o}','${q.answer}',${i})">${o}</div>`).join('') : `<p style="color:#666;">📝 ${q.answer}</p>`}
      <div id="analysis-${i}" style="display:none;margin-top:8px;padding:8px;background:#e8f5e9;border-radius:8px;">💡 ${q.analysis||'暂无解析'}</div>
    </div>
  `).join('');
}

function checkAnswer(el, selected, correct, idx) {
  const siblings = el.parentElement.querySelectorAll('.option-item');
  siblings.forEach(s => s.style.pointerEvents='none');
  if(selected === correct) { el.classList.add('correct'); }
  else { el.classList.add('wrong'); siblings.forEach(s => { if(s.textContent===correct) s.classList.add('correct'); }); addWrongQuestion(idx); }
  document.getElementById('analysis-'+idx).style.display='block';
  updateAllStats();
}

function addWrongQuestion(idx) {
  const q = window.currentQuestions[idx];
  let wrongList = JSON.parse(localStorage.getItem('wrongQuestions'))||[];
  if(!wrongList.find(w=>w.question===q.question)) { wrongList.push(q); localStorage.setItem('wrongQuestions',JSON.stringify(wrongList)); }
  renderWrongQuestions();
}

function renderWrongQuestions() {
  const wrongList = JSON.parse(localStorage.getItem('wrongQuestions'))||[];
  document.getElementById('wrong-questions').innerHTML = wrongList.length===0 ? '<p style="color:#999;">暂无错题！🎉</p>' : wrongList.map((q,i)=>`<p>❌ ${i+1}. ${q.question} → ${q.answer}</p>`).join('');
}

function updateAllStats() { updateStats(window.currentQuestions); }

function updateStats(qs) {
  document.getElementById('total-count').textContent=qs.length;
  const wrongList=JSON.parse(localStorage.getItem('wrongQuestions'))||[];
  const wrongCount=wrongList.filter(w=>qs.find(q=>q.question===w.question)).length;
  const acc=qs.length>0?Math.round((qs.length-wrongCount)/qs.length*100):0;
  document.getElementById('accuracy').textContent=acc+'%';
  document.getElementById('exam-progress').style.width=acc+'%';
}

const builtInVocab = [
  { word:'abandon', phonetic:'/əˈbændən/', meaning:'放弃', example:'He abandoned his plan.' },
  { word:'benefit', phonetic:'/ˈbenɪfɪt/', meaning:'好处', example:'Exercise benefits health.' },
  { word:'challenge', phonetic:'/ˈtʃælɪndʒ/', meaning:'挑战', example:'She enjoys challenges.' },
  { word:'determine', phonetic:'/dɪˈtɜːmɪn/', meaning:'决定', example:'Determine the cause.' },
  { word:'evidence', phonetic:'/ˈevɪdəns/', meaning:'证据', example:'No evidence supports this.' },
  { word:'fundamental', phonetic:'/ˌfʌndəˈmentl/', meaning:'基本的', example:'A fundamental question.' },
  { word:'guarantee', phonetic:'/ˌɡærənˈtiː/', meaning:'保证', example:'I cannot guarantee success.' },
  { word:'hypothesis', phonetic:'/haɪˈpɒθəsɪs/', meaning:'假说', example:'Test the hypothesis.' },
  { word:'inevitable', phonetic:'/ɪnˈevɪtəbl/', meaning:'不可避免的', example:'Change is inevitable.' },
  { word:'justify', phonetic:'/ˈdʒʌstɪfaɪ/', meaning:'证明正当', example:'Justify your decision.' }
];

function loadVocabulary() {
  const vocab=JSON.parse(localStorage.getItem('vocabulary'))||builtInVocab;
  if(!localStorage.getItem('vocabulary')) localStorage.setItem('vocabulary',JSON.stringify(builtInVocab));
  document.getElementById('vocabulary-list').innerHTML=vocab.map(v=>`
    <div class="list-item"><div><b>${v.word}</b> ${v.phonetic}<p>${v.meaning}</p><p style="color:#666;font-size:13px;">📖 ${v.example}</p></div></div>
  `).join('');
}

const builtInWriting = [
  { type:'四级模板', content:'Nowadays, ___ has become a hot topic. There are several reasons. First, ___. Moreover, ___. Finally, ___. In conclusion, ___.' },
  { type:'六级模板', content:'It is universally acknowledged that ___. Some believe ___, while others argue ___. From my perspective, ___.' },
  { type:'考研小作文', content:'Dear ___, I am writing to express my ___ regarding ___. Looking forward to your reply. Yours sincerely, ___' },
  { type:'万能句型', content:'It goes without saying that... 毫无疑问...' },
  { type:'万能句型', content:'There is no denying that... 不可否认...' }
];

function loadWritingMaterials() {
  if(!localStorage.getItem('writingMaterials')) localStorage.setItem('writingMaterials',JSON.stringify(builtInWriting));
  document.getElementById('writing-materials').innerHTML=JSON.parse(localStorage.getItem('writingMaterials')).map(m=>`
    <div style="padding:12px;background:#f9fdf9;border-radius:8px;margin-bottom:8px;"><span class="tag">${m.type}</span><p>${m.content}</p></div>
  `).join('');
}

function loadSpeaking() {
  document.getElementById('speaking-area').innerHTML=`
    <p>🎤 影子跟读素材：</p>
    <p>📖 The rapid development of technology has changed our daily lives in countless ways.</p>
    <p>📖 Environmental protection is not just a slogan, but a responsibility for everyone.</p>
    <p>📖 Learning a new language opens doors to different cultures and perspectives.</p>
    <p style="color:#999;">⏳ 音频播放功能开发中，敬请期待...</p>
  `;
}

// ==================== 每日计划 ====================
function renderPlanPage(container) {
  const defaultTasks=['背单词30个','影子跟读练习15分钟','专业课学习1小时','药师资格证复习30分钟','运动30分钟','喂电子宠物'];
  let tasks=JSON.parse(localStorage.getItem('dailyTasks'))||defaultTasks;
  if(!localStorage.getItem('dailyTasks')) localStorage.setItem('dailyTasks',JSON.stringify(defaultTasks));
  const completed=JSON.parse(localStorage.getItem('completedTasks'))||[];
  container.innerHTML=`
    <div class="card"><h2>📋 今日待办</h2>
      <div id="task-list">${tasks.map((t,i)=>`
        <div class="list-item"><div style="display:flex;align-items:center;"><input type="checkbox" class="task-checkbox" ${completed.includes(i)?'checked':''} onchange="toggleTask(${i})"><span class="${completed.includes(i)?'task-completed':''}">${t}</span></div><button class="btn btn-danger" style="padding:4px 10px;font-size:12px;" onclick="deleteTask(${i})">删除</button></div>
      `).join('')}</div>
      <div style="margin-top:12px;display:flex;gap:8px;"><input type="text" id="new-task-input" placeholder="添加新任务..."><button class="btn" onclick="addTask()">新增</button></div>
      <div style="margin-top:12px;">📊 进度：<div class="progress-bar"><div class="progress-fill" id="task-progress" style="width:${tasks.length>0?Math.round(completed.length/tasks.length*100):0}%;"></div></div>${completed.length}/${tasks.length}</div>
    </div>
    <div class="card"><h2>🔥 连续打卡：<b id="streak-days">0</b> 天</h2><button class="btn" onclick="dailyCheckin()">📅 今日打卡</button></div>
    <div class="card"><h2>🎯 周/月度目标</h2><div id="goals-list"></div><div style="margin-top:12px;display:flex;gap:8px;"><input type="text" id="new-goal-input" placeholder="添加目标..."><button class="btn" onclick="addGoal()">添加</button></div></div>
  `;
  loadGoals(); updateStreak();
}

function toggleTask(index) {
  let completed=JSON.parse(localStorage.getItem('completedTasks'))||[];
  completed.includes(index)?completed=completed.filter(i=>i!==index):completed.push(index);
  localStorage.setItem('completedTasks',JSON.stringify(completed));
  renderPlanPage(document.getElementById('content')); feedPet();
}
function deleteTask(index) {
  let tasks=JSON.parse(localStorage.getItem('dailyTasks'))||[]; tasks.splice(index,1);
  localStorage.setItem('dailyTasks',JSON.stringify(tasks));
  let completed=JSON.parse(localStorage.getItem('completedTasks'))||[];
  completed=completed.filter(i=>i!==index).map(i=>i>index?i-1:i);
  localStorage.setItem('completedTasks',JSON.stringify(completed));
  renderPlanPage(document.getElementById('content'));
}
function addTask() {
  const input=document.getElementById('new-task-input'); if(!input.value.trim())return;
  let tasks=JSON.parse(localStorage.getItem('dailyTasks'))||[]; tasks.push(input.value.trim());
  localStorage.setItem('dailyTasks',JSON.stringify(tasks)); input.value='';
  renderPlanPage(document.getElementById('content'));
}
function dailyCheckin() {
  const today=new Date().toDateString();
  let checkins=JSON.parse(localStorage.getItem('checkins'))||[];
  if(checkins.includes(today)){alert('今天已经打过卡啦～');return;}
  checkins.push(today); localStorage.setItem('checkins',JSON.stringify(checkins));
  feedPet(); feedPet(); updateStreak(); alert('✅ 打卡成功！');
}
function updateStreak() {
  let checkins=JSON.parse(localStorage.getItem('checkins'))||[]; let streak=0; const today=new Date();
  for(let i=0;i<365;i++){const d=new Date(today);d.setDate(d.getDate()-i);if(checkins.includes(d.toDateString()))streak++;else if(i>0)break;}
  document.getElementById('streak-days').textContent=streak;
}
function loadGoals() {
  const goals=JSON.parse(localStorage.getItem('goals'))||[];
  document.getElementById('goals-list').innerHTML=goals.length===0?'<p style="color:#999;">暂无目标</p>':goals.map((g,i)=>`<div class="list-item"><span>🎯 ${g}</span><button class="btn btn-danger" style="padding:4px 10px;font-size:12px;" onclick="deleteGoal(${i})">删除</button></div>`).join('');
}
function addGoal() {
  const input=document.getElementById('new-goal-input'); if(!input.value.trim())return;
  let goals=JSON.parse(localStorage.getItem('goals'))||[]; goals.push(input.value.trim());
  localStorage.setItem('goals',JSON.stringify(goals)); input.value='';
  renderPlanPage(document.getElementById('content'));
}
function deleteGoal(index) {
  let goals=JSON.parse(localStorage.getItem('goals'))||[]; goals.splice(index,1);
  localStorage.setItem('goals',JSON.stringify(goals));
  renderPlanPage(document.getElementById('content'));
}

// ==================== 专业课学习专区 ====================
function renderMajorPage(container) {
  container.innerHTML=`
    <div class="card"><h2>📚 中药学</h2><div id="zhongyaoxue-content"></div></div>
    <div class="card"><h2>🔬 中药鉴定学</h2><div id="jianding-content"></div></div>
    <div class="card"><h2>⚗️ 中药化学</h2><div id="huaxue-content"></div></div>
    <div class="card"><h2>🌿 中药资源学</h2><div id="ziyuan-content"></div></div>
    <div class="card"><h2>🌺 药用植物学</h2><div id="zhiwu-content"></div></div>
    <div class="card"><h2>📝 易混点错题本</h2><div id="major-wrong"></div></div>
    <div class="card"><h2>🎯 南中医·中药资源与开发</h2><p>📅 考研倒计时：<b id="countdown"></b></p><p>📖 初试科目：政治、英语、中药学综合</p><p>📚 参考书目：《中药学》《中药化学》《中药鉴定学》</p></div>
  `;
  loadMajorKnowledge(); updateCountdown();
}

function loadMajorKnowledge() {
  document.getElementById('zhongyaoxue-content').innerHTML='<p>🌿 <b>麻黄</b>：辛温，发汗解表，宣肺平喘，利水消肿</p><p>🌿 <b>桂枝</b>：辛甘温，发汗解肌，温通经脉，助阳化气</p><p>🌿 <b>柴胡</b>：苦辛微寒，和解退热，疏肝解郁，升举阳气</p><p>🌿 <b>黄连</b>：苦寒，清热燥湿，泻火解毒</p><p>🌿 <b>人参</b>：甘微苦温，大补元气，补脾益肺，生津安神</p>';
  document.getElementById('jianding-content').innerHTML='<p>🔬 <b>大黄</b>：断面颗粒性，有星点，气清香，味苦微涩</p><p>🔬 <b>甘草</b>：断面纤维性，味甜而特殊</p><p>🔬 <b>黄芪</b>：断面纤维性强，有粉性，味微甜</p>';
  document.getElementById('huaxue-content').innerHTML='<p>⚗️ <b>生物碱类</b>：麻黄碱、小檗碱、吗啡</p><p>⚗️ <b>黄酮类</b>：黄芩苷、芦丁、槲皮素</p><p>⚗️ <b>皂苷类</b>：人参皂苷、甘草酸</p>';
  document.getElementById('ziyuan-content').innerHTML='<p>🌿 中药资源调查方法：样方法、样线法</p><p>🌿 可持续利用原则：保护与开发并重</p>';
  document.getElementById('zhiwu-content').innerHTML='<p>🌺 <b>唇形科</b>：黄芩、薄荷、丹参</p><p>🌺 <b>菊科</b>：菊花、苍术、红花</p><p>🌺 <b>豆科</b>：甘草、黄芪、苦参</p>';
  document.getElementById('major-wrong').innerHTML='<p>❌ 易混：大黄（蓼科）vs 何首乌（蓼科）——断面星点有无</p><p>❌ 易混：黄连（毛茛科）vs 黄柏（芸香科）——断面颜色差异</p>';
}

function updateCountdown() {
  const target=new Date('2027-12-25'); const now=new Date();
  document.getElementById('countdown').textContent=Math.ceil((target-now)/(1000*60*60*24))+' 天';
}

// ==================== 药师资格证备考专区 ====================
function renderPharmacistPage(container) {
  container.innerHTML=`
    <div class="card"><h2>💊 药师题库</h2>
      <div><span class="tag active" onclick="filterPharm('all')">全部</span><span class="tag" onclick="filterPharm('法规')">药事管理与法规</span><span class="tag" onclick="filterPharm('综合')">药学综合</span><span class="tag" onclick="filterPharm('专业一')">专业知识一</span><span class="tag" onclick="filterPharm('专业二')">专业知识二</span></div>
      <div id="pharm-question-area"></div>
    </div>
    <div class="card"><h2>📖 重点背诵</h2><div id="pharm-recite"></div></div>
    <div class="card"><h2>⏳ 考试倒计时</h2><p><b id="pharmacist-countdown"></b></p></div>
  `;
  loadPharmQuestions(); loadPharmRecite(); updatePharmacistCountdown();
}

const pharmQuestions = [
  { subject:'法规', question:'《药品管理法》规定，药品必须符合：', options:['A. 国家标准','B. 地方标准','C. 企业标准','D. 行业标准'], answer:'A', analysis:'药品必须符合国家标准。' },
  { subject:'法规', question:'处方保存期限为：', options:['A. 1年','B. 2年','C. 3年','D. 5年'], answer:'B', analysis:'处方保存2年。' },
  { subject:'综合', question:'下列哪项不属于药学服务的内容？', options:['A. 处方审核','B. 用药指导','C. 疾病诊断','D. 不良反应监测'], answer:'C', analysis:'疾病诊断是医师职责。' },
  { subject:'综合', question:'特殊人群不包括：', options:['A. 老年人','B. 儿童','C. 孕妇','D. 成年人'], answer:'D', analysis:'特殊人群指老年人、儿童、孕妇等。' },
  { subject:'专业一', question:'阿司匹林的药理作用是：', options:['A. 解热镇痛','B. 抗菌消炎','C. 抗病毒','D. 抗肿瘤'], answer:'A', analysis:'阿司匹林主要解热镇痛抗炎。' }
];

function loadPharmQuestions() {
  window.pharmQs=JSON.parse(localStorage.getItem('pharmQuestions'))||pharmQuestions;
  if(!localStorage.getItem('pharmQuestions')) localStorage.setItem('pharmQuestions',JSON.stringify(pharmQuestions));
  filterPharm('all');
}

function filterPharm(type) {
  document.querySelectorAll('#pharm-question-area').forEach(a=>a.innerHTML='');
  const filtered=type==='all'?window.pharmQs:window.pharmQs.filter(q=>q.subject===type);
  document.getElementById('pharm-question-area').innerHTML=filtered.map((q,i)=>`
    <div style="padding:12px;margin:8px 0;background:#f9fdf9;border-radius:8px;">
      <span class="tag">${q.subject}</span><p><b>${q.question}</b></p>
      ${q.options.map(o=>`<div class="option-item" onclick="checkPharmAnswer(this,'${o}','${q.answer}')">${o}</div>`).join('')}
    </div>
  `).join('');
}

function checkPharmAnswer(el,selected,correct) {
  const siblings=el.parentElement.querySelectorAll('.option-item');
  siblings.forEach(s=>s.style.pointerEvents='none');
  selected===correct?el.classList.add('correct'):(el.classList.add('wrong'),siblings.forEach(s=>{if(s.textContent===correct)s.classList.add('correct');}));
}

function loadPharmRecite() {
  document.getElementById('pharm-recite').innerHTML=`
    <p>📖 <b>GMP</b>：药品生产质量管理规范</p><p>📖 <b>GSP</b>：药品经营质量管理规范</p>
    <p>📖 <b>特殊管理药品</b>：麻醉药品、精神药品、医疗用毒性药品、放射性药品</p>
    <p>📖 <b>处方管理办法</b>：处方一般不得超过7日用量</p>
    <p>📖 <b>配伍禁忌</b>：青霉素与氨基糖苷类不可同瓶滴注</p>
 `;
}

function updatePharmacistCountdown(){
  const target=new Date('2027-10-15'); const now Date();
  document.getElementById('pharmacist-countdown').textContent=Math.ceil((1000*60*60*24))+'天';
}

// ==================== 其他页面 ====================
function renderFinancePage(c){c.innerHTML='<div class="card"><h2>💰 记账模块</h2><p>🏗️ 下一阶段开发中...</p></div>';}
function renderNewsPage(c){c.innerHTML='<div class="card"><h2>📰 热点资讯</h2><p>🏗️ 下一阶段开发中...</p></div>';}
function renderVideosPage(c){c.innerHTML='<div class="card"><h2>🎬 视频素材</h2><p>🏗️ 下一阶段开发中...</p></div>';}

// 初始化
loadPage('english');
renderWrongQuestions();
