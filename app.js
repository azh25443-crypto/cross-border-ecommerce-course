const STORAGE_KEY = 'cq-global-opportunity-v1';
const form = document.querySelector('#explorerForm');
const screens = [...document.querySelectorAll('.screen')];
const progressWrap = document.querySelector('#progressWrap');
const stepLabel = document.querySelector('#stepLabel');
const stepName = document.querySelector('#stepName');
const progressBar = document.querySelector('#progressBar');
const saveStatus = document.querySelector('#saveStatus');
const stepNames = ['首页', '发现产业', '潜在客户', '目标市场', '寻找证据', '提出问题', '机会卡'];
const examples = [
  '“重庆摩托车零部件应该卖给海外企业还是消费者？”',
  '“重庆火锅底料在欧洲真的有市场吗？”',
  '“这个产品更适合 Alibaba.com 还是 Amazon？”',
  '“海外消费者会理解这个产品的文化价值吗？”'
];
let currentScreen = 0;
let exampleIndex = Math.floor(Math.random() * examples.length);

function getData() {
  return Object.fromEntries(new FormData(form).entries());
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: getData(), screen: currentScreen }));
  saveStatus.textContent = '已自动保存';
}

function restoreData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved?.data) return;
    Object.entries(saved.data).forEach(([name, value]) => {
      const fields = form.elements[name];
      if (!fields) return;
      if (fields instanceof RadioNodeList) {
        [...fields].forEach(field => { field.checked = field.value === value; });
      } else fields.value = value;
    });
    updateCounts();
    if (saved.screen > 0 && saved.screen < 6) showScreen(saved.screen);
  } catch { localStorage.removeItem(STORAGE_KEY); }
}

function showScreen(index) {
  currentScreen = Math.max(0, Math.min(6, index));
  screens.forEach(screen => screen.classList.toggle('active', Number(screen.dataset.screen) === currentScreen));
  progressWrap.classList.toggle('hidden', currentScreen === 0 || currentScreen === 6);
  if (currentScreen >= 1 && currentScreen <= 5) {
    stepLabel.textContent = `STEP ${currentScreen} / 5`;
    stepName.textContent = stepNames[currentScreen];
    progressBar.style.width = `${currentScreen * 20}%`;
  }
  document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
  saveData();
}

function validateStep(index) {
  const screen = document.querySelector(`[data-screen="${index}"]`);
  const error = screen.querySelector('.error');
  const missing = [...screen.querySelectorAll('[required]')].find(field => !field.value.trim());
  const radioGroups = index === 1 ? ['industry'] : index === 2 ? ['buyer'] : [];
  const missingRadio = radioGroups.find(name => !form.elements[name].value);
  if (missingRadio || missing) {
    error.textContent = '请先完成本页的必填内容，再进入下一步。';
    (missing || screen.querySelector(`[name="${missingRadio}"]`))?.focus();
    return false;
  }
  const url = screen.querySelector('input[type="url"]');
  if (url?.value && !url.checkValidity()) {
    error.textContent = '请填写完整的网页链接，例如 https://example.com。';
    url.focus(); return false;
  }
  error.textContent = '';
  return true;
}

function renderResult() {
  const data = getData();
  document.querySelectorAll('[data-result]').forEach(node => {
    node.textContent = data[node.dataset.result] || '—';
  });
  const link = document.querySelector('[data-result-link="url"]');
  link.textContent = data.url || '';
  link.href = data.url || '#';
  link.hidden = !data.url;
}

function reset() {
  if (!confirm('确定要重新开始吗？所有已填写的内容将被清除。')) return;
  localStorage.removeItem(STORAGE_KEY);
  form.reset(); updateCounts(); showScreen(0);
}

document.addEventListener('click', event => {
  const next = event.target.closest('[data-next]');
  const prev = event.target.closest('[data-prev]');
  const go = event.target.closest('[data-go]');
  if (next && (currentScreen === 0 || validateStep(currentScreen))) showScreen(currentScreen + 1);
  if (prev) showScreen(currentScreen === 6 ? 5 : currentScreen - 1);
  if (go) { event.preventDefault(); showScreen(Number(go.dataset.go)); }
});

document.querySelector('[data-generate]').addEventListener('click', () => {
  if (!validateStep(5)) return;
  renderResult(); showScreen(6);
});
form.addEventListener('input', () => { saveStatus.textContent = '保存中…'; updateCounts(); clearTimeout(window.saveTimer); window.saveTimer = setTimeout(saveData, 250); });
form.addEventListener('change', saveData);
document.querySelector('#resetButton').addEventListener('click', reset);
document.querySelector('#resultReset').addEventListener('click', reset);
document.querySelector('#printButton').addEventListener('click', () => window.print());
document.querySelector('#shuffleExample').addEventListener('click', () => { exampleIndex = (exampleIndex + 1) % examples.length; document.querySelector('#exampleQuestion').textContent = examples[exampleIndex]; });
function updateCounts() { document.querySelectorAll('textarea[maxlength]').forEach(area => area.parentElement.querySelector('.count span').textContent = area.value.length); }
document.querySelector('#exampleQuestion').textContent = examples[exampleIndex];
restoreData();
