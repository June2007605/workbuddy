// ==================== Supabase 配置 ====================
const SUPABASE_URL = 'https://oeibttbtkvdpatpowxmu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UC--7FeY5A4V0BA-r95UVw_xQDMjOQ7';

// ==================== 页面导航 ====================
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    const page = item.dataset.page;
    loadPage(page);
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
let petData = JSON.parse(localStorage.getItem('petData')) || {
  name: '小绿芽',
  level: 1,
  exp: 0,
  stage: 0
};

const petStages = ['🥚', '🌱', '🌿', '🪴', '🌳', '🌟'];
const petContainer = document.getElementById('pet-container');

function renderPet() {
  const stage = Math.min(Math.floor(petData.exp / 100), petStages.length - 1);
  petData.stage = stage;
  petContainer.innerHTML = `
    <div class="pet-box" onclick="feedPet()">
      <div class="pet-emoji">${petStages[stage]}</div>
      <div class="pet-name">${petData.name}</div>
      <div style="font-size:12px;color:#666;">Lv.${petData.level} | ${petData.exp % 100}/100</div>
      <div class="progress-bar" style="width:80px;margin:4px auto;">
        <div class="progress-fill" style="width:${petData.exp % 100}%;"></div>
      </div>
    </div>
  `;
}

function feedPet() {
  petData.exp += 20;
  if (petData.exp >= (petData.level * 100)) {
    petData.level++;
    petData.exp = 0;
    alert('🎉 ' + petData.name + ' 升级了！现在是 Lv.' + petData.level);
  }
  localStorage.setItem('petData', JSON.stringify(petData));
  renderPet();
}

renderPet();

// ==================== 英语学习页面 ====================
function renderEnglishPage(container) {
  container.innerHTML = `
    <div class="card">
      <h2>📖 四六级+考研英语真题题库</h2>
      <div id="exam-filters" style="margin-bottom:16px;">
        <span class="tag active" onclick="filterExam('all')">全部</span>
        <span class="tag" onclick="filterExam('CET4')">四级</span>
        <span class="tag" onclick="filterExam('CET6')">六级</span>
        <span class="tag" onclick="filterExam('PG')">考研英语</span>
      </div>
      <div id="question-area"></div>
      <div id="stats" style="margin-top:16px;">
        <span>📊 刷题总量：<b id="total-count">0</b></span>
        <span style="margin-left:16px;">✅ 正确率：<b id="accuracy">0%</b></span>
        <div class="progress-bar" style="margin-top:8px;">
          <div class="progress-fill" id="exam-progress" style="width:0%;"></div>
        </div>
      </div>
    </div>
    <div class="card">
      <h2>📝 错题本</h2>
      <div id="wrong-questions"></div>
    </div>
    <div class="card">
      <h2>📒 生词本</h2>
      <div id="vocabulary-list"></div>
    </div>
    <div class="card">
      <h2>✍️ 写作素材库</h2>
      <div id="writing-materials"></div>
    </div>
  `;
  loadEnglishQuestions();
  loadVocabulary();
  loadWritingMaterials();
}

// 内置英语题库
const builtInQuestions = [
  { exam_type: 'CET4', question_type: '阅读', question: 'What is the main idea of the passage about environmental protection?', options: ['A. Economic growth', 'B. Environmental awareness', 'C. Technology advancement', 'D. Social media influence'], answer: 'B. Environmental awareness', analysis: '文章主要讨论环保意识的重要性。' },
  { exam_type: 'CET4', question_type: '阅读', question: 'According to the text, which of the following is NOT a benefit of regular exercise?', options: ['A. Better sleep', 'B. Increased stress', 'C. Improved mood', 'D. Stronger bones'], answer: 'B. Increased stress', analysis: '规律运动不会增加压力，反而会减轻压力。' },
  { exam_type: 'CET4', question_type: '选词填空', question: 'The company is trying to ___ its market share in Asia.', options: ['expand', 'contract', 'ignore', 'abandon'], answer: 'expand', analysis: 'expand意为扩展，公司试图扩展亚洲市场份额。' },
  { exam_type: 'CET4', question_type: '翻译', question: '请将"中国传统文化源远流长"翻译成英文。', options: [], answer: 'Traditional Chinese culture has a long and profound history.', analysis: '' },
  { exam_type: 'CET4', question_type: '写作', question: '请以"Online Learning"为题写一篇120词的短文。', options: [], answer: '参考范文：Online learning has become increasingly popular...', analysis: '' },
  { exam_type: 'CET6', question_type: '阅读', question: 'The author argues that globalization has led to ___.', options: ['A. Cultural homogenization', 'B. Economic decline', 'C. Political stability', 'D. Environmental protection'], answer: 'A. Cultural homogenization', analysis: '作者认为全球化导致了文化同质化。' },
  { exam_type: 'CET6', question_type: '阅读', question: 'Which statement best describes the researchers\' findings?', options: ['A. Results were inconclusive', 'B. Strong correlation was found', 'C. No relationship exists', 'D. Previous studies were wrong'], answer: 'B. Strong correlation was found', analysis: '研究发现存在强相关性。' },
  { exam_type: 'PG', question_type: '阅读', question: 'The primary purpose of the text is to ___.', options: ['A. Criticize current policies', 'B. Propose a new theory', 'C. Describe historical events', 'D. Analyze statistical data'], answer: 'B. Propose a new theory', analysis: '文章主要目的是提出一个新理论。' },
  { exam_type: 'PG', question_type: '阅读', question: 'According to paragraph 3, the author suggests that ___.', options: ['A. More research is needed', 'B. The hypothesis is proven', 'C. Data is unreliable', 'D. Results are surprising'], answer: 'A. More research is needed', analysis: '作者认为还需要更多研究。' },
  { exam_type: 'PG', question_type: '翻译', question: '将"中医药现代化需要科技创新与国际合作"翻译成英文。', options: [], answer: 'The modernization of traditional Chinese medicine requires technological innovation and international cooperation.', analysis: '' }
];

function loadEnglishQuestions() {
  const questions = JSON.parse(localStorage.getItem('englishQuestions')) || builtInQuestions;
  if (!localStorage.getItem('englishQuestions')) {
    localStorage.setItem('englishQuestions', JSON.stringify(builtInQuestions));
  }
  window.currentQuestions = questions;
  filterExam('all');
}

function filterExam(type) {
  document.querySelectorAll('#exam-filters .tag').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  const filtered = type === 'all' ? window.currentQuestions : window.currentQuestions.filter(q => q.exam_type === type);
  renderQuestions(filtered);
  updateStats(filtered);
}

function renderQuestions(questions) {
  const area = document.getElementById('question-area');
  area.innerHTML = questions.map((q, i) => `
    <div class="card" style="padding:16px;">
      <span class="tag">${q.exam_type}</span>
      <span class="tag">${q.question_type}</span>
      <p style="margin:12px 0;"><b>${i + 1}. ${q.question}</b></p>
      ${q.options.length > 0 ? q.options.map(o => `
        <div class="option-item" onclick="checkAnswer(this, '${o}', '${q.answer}', ${i})">${o}</div>
      `).join('') : `<p style="color:#666;">📝 ${q.answer.substring(0, 100)}...</p>`}
      <div id="analysis-${i}" style="display:none;margin-top:8px;padding:8px;background:#f5f5f5;border-radius:8px;">
        💡 <b>解析：</b>${q.analysis || '暂无解析'}
      </div>
    </div>
  `).join('');
}

function checkAnswer(el, selected, correct, idx) {
  const siblings = el.parentElement.querySelectorAll('.option-item');
  siblings.forEach(s => s.style.pointerEvents = 'none');
  if (selected === correct) {
    el.classList.add('correct');
    addWrongQuestion(idx, false);
  } else {
    el.classList.add('wrong');
    siblings.forEach(s => { if (s.textContent === correct) s.classList.add('correct'); });
    addWrongQuestion(idx, true);
  }
  document.getElementById('analysis-' + idx).style.display = 'block';
  updateAllStats();
}

function addWrongQuestion(idx, isWrong) {
  if (!isWrong) return;
  const q = window.currentQuestions[idx];
  let wrongList = JSON.parse(localStorage.getItem('wrongQuestions')) || [];
  if (!wrongList.find(w => w.question === q.question)) {
    wrongList.push(q);
    localStorage.setItem('wrongQuestions', JSON.stringify(wrongList));
  }
  renderWrongQuestions();
}

function renderWrongQuestions() {
  const wrongList = JSON.parse(localStorage.getItem('wrongQuestions')) || [];
  document.getElementById('wrong-questions').innerHTML = wrongList.length === 0 
    ? '<p style="color:#999;">暂无错题，继续保持！🎉</p>'
    : wrongList.map((q, i) => `<p style="margin:4px 0;">❌ ${i+1}. ${q.question} → 答案：${q.answer}</p>`).join('');
}

function updateAllStats() {
  const all = window.currentQuestions;
  updateStats(all);
}

function updateStats(questions) {
  document.getElementById('total-count').textContent = questions.length;
  const wrongList = JSON.parse(localStorage.getItem('wrongQuestions')) || [];
  const wrongCount = wrongList.filter(w => questions.find(q => q.question === w.question)).length;
  const acc = questions.length > 0 ? Math.round((questions.length - wrongCount) / questions.length * 100) : 0;
  document.getElementById('accuracy').textContent = acc + '%';
  document.getElementById('exam-progress').style.width = acc + '%';
}

// 生词本
const builtInVocab = [
  { word: 'abandon', phonetic: '/əˈbændən/', meaning: '放弃；抛弃', example: 'He abandoned his plan to travel.' },
  { word: 'benefit', phonetic: '/ˈbenɪfɪt/', meaning: '利益；好处', example: 'Exercise benefits your health.' },
  { word: 'challenge', phonetic: '/ˈtʃælɪndʒ/', meaning: '挑战', example: 'She enjoys a good challenge.' },
  { word: 'determine', phonetic: '/dɪˈtɜːmɪn/', meaning: '决定；确定', example: 'We need to determine the cause.' },
  { word: 'evidence', phonetic: '/ˈevɪdəns/', meaning: '证据', example: 'There is no evidence to support this.' },
  { word: 'fundamental', phonetic: '/ˌfʌndəˈmentl/', meaning: '基本的；根本的', example: 'This is a fundamental question.' },
  { word: 'guarantee', phonetic: '/ˌɡærənˈtiː/', meaning: '保证；担保', example: 'I cannot guarantee success.' },
  { word: 'hypothesis', phonetic: '/haɪˈpɒθəsɪs/', meaning: '假说；假设', example: 'The hypothesis was tested.' },
  { word: 'inevitable', phonetic: '/ɪnˈevɪtəbl/', meaning: '不可避免的', example: 'Change is inevitable.' },
  { word: 'justify', phonetic: '/ˈdʒʌstɪfaɪ/', meaning: '证明…正当', example: 'How do you justify your decision?' }
];

function loadVocabulary() {
  const vocab = JSON.parse(localStorage.getItem('vocabulary')) || builtInVocab;
  if (!localStorage.getItem('vocabulary')) {
    localStorage.setItem('vocabulary', JSON.stringify(builtInVocab));
  }
  document.getElementById('vocabulary-list').innerHTML = vocab.map(v => `
    <div class="list-item">
      <div>
        <b>${v.word}</b> <span style="color:#999;">${v.phonetic}</span>
        <p style="margin:4px 0;">${v.meaning}</p>
        <p style="color:#666;font-size:13px;">📖 ${v.example}</p>
      </div>
    </div>
  `).join('');
}

// 写作素材
const builtInWriting = [
  { type: '四级模板', content: 'Nowadays, with the development of society, ___ has become a hot topic. There are several reasons accounting for this phenomenon. First of all, ___. Moreover, ___. Finally, ___. In conclusion, ___.' },
  { type: '六级模板', content: 'It is universally acknowledged that ___. When it comes to ___, opinions vary from person to person. Some people believe ___, while others argue ___. From my perspective, ___.' },
  { type: '考研小作文', content: 'Dear ___, I am writing to express my sincere ___ regarding ___. I would appreciate it if you could ___. Looking forward to your reply. Yours sincerely, ___' },
  { type: '万能句型', content: 'It goes without saying that... 毫无疑问...' },
  { type: '万能句型', content: 'There is no denying that... 不可否认...' },
  { type: '万能句型', content: 'From what has been discussed above, we may safely draw the conclusion that... 通过以上讨论，我们可以得出结论...' }
];

function loadWritingMaterials() {
  if (!localStorage.getItem('writingMaterials')) {
    localStorage.setItem('writingMaterials', JSON.stringify(builtInWriting));
  }
  const materials = JSON.parse(localStorage.getItem('writingMaterials'));
  document.getElementById('writing-materials').innerHTML = materials.map(m => `
    <div style="margin-bottom:12px;padding:12px;background:#f9fdf9;border-radius:8px;">
      <span class="tag">${m.type}</span>
      <p style="margin-top:8px;">${m.content}</p>
    </div>
  `).join('');
}

// ==================== 每日计划 ====================
function renderPlanPage(container) {
  const defaultTasks = [
    '背单词30个',
    '影子跟读练习15分钟',
    '专业课学习1小时',
    '药师资格证复习30分钟',
    '运动30分钟',
    '喂电子宠物'
  ];
  let tasks = JSON.parse(localStorage.getItem('dailyTasks')) || defaultTasks;
  if (!localStorage.getItem('dailyTasks')) {
    localStorage.setItem('dailyTasks', JSON.stringify(defaultTasks));
  }
  const completed = JSON.parse(localStorage.getItem('completedTasks')) || [];
  
  container.innerHTML = `
    <div class="card">
      <h2>📋 今日待办清单</h2>
      <div id="task-list">
        ${tasks.map((t, i) => `
          <div class="list-item">
            <div style="display:flex;align-items:center;">
              <input type="checkbox" class="task-checkbox" ${completed.includes(i) ? 'checked' : ''} onchange="toggleTask(${i})">
              <span class="${completed.includes(i) ? 'task-completed' : ''}">${t}</span>
            </div>
            <button class="btn btn-danger" style="padding:4px 10px;font-size:12px;" onclick="deleteTask(${i})">删除</button>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;">
        <input type="text" id="new-task-input" placeholder="添加新任务...">
        <button class="btn" onclick="addTask()">新增</button>
      </div>
      <div style="margin-top:16px;">
        <span>📊 今日完成进度：</span>
        <div class="progress-bar">
          <div class="progress-fill" id="task-progress" style="width:${tasks.length > 0 ? Math.round(completed.length / tasks.length * 100) : 0}%;"></div>
        </div>
        <span>${completed.length}/${tasks.length}</span>
      </div>
    </div>
    <div class="card">
      <h2>🔥 连续打卡天数：<b id="streak-days">0</b> 天</h2>
      <button class="btn" onclick="dailyCheckin()">📅 今日打卡</button>
    </div>
    <div class="card">
      <h2>🎯 周/月度目标</h2>
      <div id="goals-list"></div>
      <div style="margin-top:12px;display:flex;gap:8px;">
        <input type="text" id="new-goal-input" placeholder="添加新目标...">
        <button class="btn" onclick="addGoal()">添加目标</button>
      </div>
    </div>
  `;
  loadGoals();
  updateStreak();
}

function toggleTask(index) {
  let completed = JSON.parse(localStorage.getItem('completedTasks')) || [];
  if (completed.includes(index)) {
    completed = completed.filter(i => i !== index);
  } else {
    completed.push(index);
  }
  localStorage.setItem('completedTasks', JSON.stringify(completed));
  renderPlanPage(document.getElementById('content'));
  feedPet();
}

function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem('dailyTasks')) || [];
  tasks.splice(index, 1);
  localStorage.setItem('dailyTasks', JSON.stringify(tasks));
  let completed = JSON.parse(localStorage.getItem('completedTasks')) || [];
  completed = completed.filter(i => i !== index).map(i => i > index ? i - 1 : i);
  localStorage.setItem('completedTasks', JSON.stringify(completed));
  renderPlanPage(document.getElementById('content'));
}

function addTask() {
  const input = document.getElementById('new-task-input');
  if (!input.value.trim()) return;
  let tasks = JSON.parse(localStorage.getItem('dailyTasks')) || [];
  tasks.push(input.value.trim());
  localStorage.setItem('dailyTasks', JSON.stringify(tasks));
  input.value = '';
  renderPlanPage(document.getElementById('content'));
}

function dailyCheckin() {
  const today = new Date().toDateString();
  let checkins = JSON.parse(localStorage.getItem('checkins')) || [];
  if (checkins.includes(today)) {
    alert('今天已经打过卡啦～');
    return;
  }
  checkins.push(today);
  localStorage.setItem('checkins', JSON.stringify(checkins));
  feedPet();
  feedPet();
  updateStreak();
  alert('✅ 打卡成功！电子宠物获得了双倍成长值！');
}

function updateStreak() {
  let checkins = JSON.parse(localStorage.getItem('checkins')) || [];
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (checkins.includes(d.toDateString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  document.getElementById('streak-days').textContent = streak;
}

function loadGoals() {
  const goals = JSON.parse(localStorage.getItem('goals')) || [];
  document.getElementById('goals-list').innerHTML = goals.length === 0
    ? '<p style="color:#999;">暂无目标，添加一个吧～</p>'
    : goals.map((g, i) => `
      <div class="list-item">
        <span>🎯 ${g}</span>
        <button class="btn btn-danger" style="padding:4px 10px;font-size:12px;" onclick="deleteGoal(${i})">删除</button>
      </div>
    `).join('');
}

function addGoal() {
  const input = document.getElementById('new-goal-input');
  if (!input.value.trim()) return;
  let goals = JSON.parse(localStorage.getItem('goals')) || [];
  goals.push(input.value.trim());
  localStorage.setItem('goals', JSON.stringify(goals));
  input.value = '';
  loadGoals();
  renderPlanPage(document.getElementById('content'));
}

function deleteGoal(index) {
  let goals = JSON.parse(localStorage.getItem('goals')) || [];
  goals.splice(index, 1);
  localStorage.setItem('goals', JSON.stringify(goals));
  renderPlanPage(document.getElementById('content'));
}

// ==================== 其他页面占位 ====================
function renderMajorPage(container) {
  container.innerHTML = `
    <div class="card"><h2>📚 专业课学习专区</h2><p>🏗️ 功能开发中，敬请期待...</p></div>
    <div class="card"><h2>🎯 南京中医药大学 · 中药资源与开发</h2><p>倒计时：<b id="countdown">加载中...</b></p></div>
  `;
  updateCountdown();
}

function renderPharmacistPage(container) {
  container.innerHTML = `
    <div class="card"><h2>💊 药师资格证备考专区</h2><p>🏗️ 功能开发中，敬请期待...</p></div>
    <div class="card"><h2>⏳ 药师考试倒计时</h2><p><b id="pharmacist-countdown">加载中...</b></p></div>
  `;
  updatePharmacistCountdown();
}

function renderFinancePage(container) {
  container.innerHTML = `<div class="card"><h2>💰 记账模块</h2><p>🏗️ 功能开发中，敬请期待...</p></div>`;
}

function renderNewsPage(container) {
  container.innerHTML = `<div class="card"><h2>📰 实时热点资讯</h2><p>🏗️ 功能开发中，敬请期待...</p></div>`;
}

function renderVideosPage(container) {
  container.innerHTML = `<div class="card"><h2>🎬 爆火视频素材收藏</h2><p>🏗️ 功能开发中，敬请期待...</p></div>`;
}

function updateCountdown() {
  const target = new Date('2027-12-25');
  const now = new Date();
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  document.getElementById('countdown').textContent = diff + ' 天';
}

function updatePharmacistCountdown() {
  const target = new Date('2027-10-15');
  const now = new Date();
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  document.getElementById('pharmacist-countdown').textContent = diff + ' 天';
}

// 初始化加载
loadPage('english');
renderWrongQuestions();






























