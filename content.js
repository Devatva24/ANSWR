// ANSWR v9 — PREMIUM CLASSY
// Stealth: Alt+P | Solve: Alt+S

(function () {
  'use strict';

  let panel         = null;
  let isOpen        = false;
  let lastResults   = null;
  let lastQuestions = null;

  /* ── STEALTH TRIGGER ── */
  function injectTrigger() {
    if (document.getElementById('fsb-trigger')) return;
    const t = document.createElement('div');
    t.id = 'fsb-trigger';
    t.title = 'ANSWR (Alt+P)';
    t.addEventListener('click', togglePanel);
    document.body.appendChild(t);
  }

  /* ── SHORTCUTS ── */
  document.addEventListener('keydown', (e) => {
    if (!e.altKey) return;
    if (e.key === 'p' || e.key === 'P') { e.preventDefault(); togglePanel(); }
    if (e.key === 's' || e.key === 'S') { e.preventDefault(); if (!isOpen) togglePanel(); setTimeout(runSolve, 120); }
  });

  /* ── PANEL TOGGLE ── */
  function togglePanel() {
    if (!panel) buildPanel();
    isOpen = !isOpen;
    if (isOpen) {
      panel.classList.add('fsb-open');
    } else {
      panel.classList.remove('fsb-open');
    }
  }

  /* ── DRAG ── */
  function makeDraggable(panelEl, handleEl) {
    let ox = 0, oy = 0;
    handleEl.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.closest('.fsb-x')) return;
      e.preventDefault();
      const r = panelEl.getBoundingClientRect();
      panelEl.style.right  = 'auto';
      panelEl.style.left   = r.left + 'px';
      panelEl.style.top    = r.top  + 'px';
      ox = e.clientX - r.left;
      oy = e.clientY - r.top;
      const move = (ev) => {
        panelEl.style.left = Math.max(0, Math.min(window.innerWidth  - panelEl.offsetWidth, ev.clientX - ox)) + 'px';
        panelEl.style.top  = Math.max(0, Math.min(window.innerHeight - panelEl.offsetHeight, ev.clientY - oy)) + 'px';
      };
      const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
  }

  /* ── BUILD PANEL ── */
  function buildPanel() {
    panel = document.createElement('div');
    panel.id = 'fsb-panel';
    panel.innerHTML = `
      <div class="fsb-header" id="fsb-drag-handle">
        <div class="fsb-title">ANSWR</div>
        <button class="fsb-x" id="fsb-close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div id="fsb-home" class="fsb-screen">
        <div class="fsb-hero">
          <div class="fsb-hero-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <div class="fsb-hero-text">Ready to solve</div>
        </div>
        <button class="fsb-btn fsb-btn-primary" id="fsb-solve">Solve Form</button>
        <button class="fsb-btn fsb-btn-secondary" id="fsb-cfg-btn" style="margin-top:12px">Settings</button>
        <div class="fsb-status" id="fsb-status"></div>
      </div>

      <div id="fsb-loading" class="fsb-screen fsb-hidden">
        <div class="fsb-spinner-container">
          <div class="fsb-spinner"></div>
          <div class="fsb-load-text" id="fsb-load-text">Analyzing form...</div>
        </div>
      </div>

      <div id="fsb-results" class="fsb-screen fsb-hidden">
        <div class="fsb-res-header">
          <span id="fsb-res-label" class="fsb-res-title">Results</span>
        </div>
        <div class="fsb-cards" id="fsb-cards"></div>
        <button class="fsb-btn fsb-btn-secondary fsb-backbtn" id="fsb-back">Back</button>
      </div>

      <div id="fsb-cfg" class="fsb-screen fsb-hidden">
        <div class="fsb-cfg-header">Settings</div>
        <label class="fsb-lbl">Groq API Key</label>
        <input type="password" id="fsb-key" class="fsb-inp" placeholder="gsk_..."/>
        <label class="fsb-lbl">Model</label>
        <div class="fsb-select-wrap">
          <select id="fsb-model" class="fsb-inp">
            <option value="llama-3.3-70b-versatile">Llama 3.3 70B</option>
            <option value="llama-3.1-8b-instant">Llama 3.1 8B</option>
            <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
          </select>
        </div>
        <button class="fsb-btn fsb-btn-primary" id="fsb-save" style="margin-top:12px">Save Config</button>
        <button class="fsb-btn fsb-btn-secondary fsb-backbtn" id="fsb-cfg-back" style="margin-top:12px">Back</button>
      </div>
    `;
    document.body.appendChild(panel);

    document.getElementById('fsb-close').addEventListener('click', togglePanel);
    document.getElementById('fsb-solve').addEventListener('click', runSolve);
    document.getElementById('fsb-cfg-btn').addEventListener('click', () => showScreen('cfg'));
    document.getElementById('fsb-back').addEventListener('click', () => showScreen('home'));
    document.getElementById('fsb-cfg-back').addEventListener('click', () => showScreen('home'));
    document.getElementById('fsb-save').addEventListener('click', saveConfig);

    makeDraggable(panel, document.getElementById('fsb-drag-handle'));

    chrome.storage.local.get(['groqApiKey', 'groqModel'], (d) => {
      if (d.groqApiKey) document.getElementById('fsb-key').value   = d.groqApiKey;
      if (d.groqModel)  document.getElementById('fsb-model').value = d.groqModel;
    });
  }

  function showScreen(name) {
    ['home','loading','results','cfg'].forEach(n => {
      document.getElementById('fsb-' + n).classList.toggle('fsb-hidden', n !== name);
    });
  }

  function setStatus(msg, type) {
    const el = document.getElementById('fsb-status');
    if (!el) return;
    el.textContent = msg;
    el.className = 'fsb-status' + (type ? ' fsb-' + type : '');
  }

  function saveConfig() {
    const key   = document.getElementById('fsb-key').value.trim();
    const model = document.getElementById('fsb-model').value;
    if (!key) { setStatus('API Key required', 'err'); showScreen('home'); return; }
    chrome.storage.local.set({ groqApiKey: key, groqModel: model }, () => {
      setStatus('Settings saved', 'ok');
      showScreen('home');
      setTimeout(() => setStatus('', ''), 3000);
    });
  }

  /* ── SCRAPE ── */
  function scrape() {
    const qs = [];
    document.querySelectorAll('.Qr7Oae[role="listitem"]').forEach((block) => {
      const headEl = block.querySelector('.HoXoMd .M7eMe');
      if (!headEl) return;
      const text = headEl.innerText.trim();
      if (!text || text.length < 2) return;

      const radios = block.querySelectorAll('[role="radio"]');
      const checks = block.querySelectorAll('[role="checkbox"]');
      let type, optEls;
      if (checks.length > 0)      { type = 'multi';  optEls = checks; }
      else if (radios.length > 0) { type = 'single'; optEls = radios; }
      else return;

      const options = [];
      const seen = new Set();
      Array.from(optEls).forEach(o => {
        const lbl = (
          o.getAttribute('data-value') ||
          o.closest('[data-value]')?.getAttribute('data-value') ||
          o.closest('.nWQGrd')?.querySelector('.aDTYNe')?.innerText ||
          o.getAttribute('aria-label') ||
          ''
        ).trim();
        if (lbl && !seen.has(lbl)) { seen.add(lbl); options.push(lbl); }
      });

      if (options.length) qs.push({ text, options, type });
    });
    return qs;
  }

  /* ── GROQ ── */
  async function callGroq(questions, key, model) {
    const body = questions.map((q, i) =>
      `Q${i+1} [${q.type==='multi'?'MULTI-SELECT — list ALL correct answers':'SINGLE — ONE correct answer only'}]:\n${q.text}\n${q.options.map((o,j)=>`  ${String.fromCharCode(65+j)}) ${o}`).join('\n')}`
    ).join('\n\n---\n\n');

    const prompt = `You are an expert quiz solver. Answer every question below.

${body}

STRICT RULES:
- answers array must contain the EXACT text of the option (copy it character-for-character)
- SINGLE question: exactly one answer in array
- MULTI question: all correct answers in array
- Return ONLY valid JSON array, no markdown, no explanation

Format: [{"qIndex":0,"type":"single","answers":["Exact Option Text"],"confidence":"high","reason":"brief reason"}]`;

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.1, max_tokens: 4096 })
    });
    if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.error?.message || `HTTP ${r.status}`); }
    const data = await r.json();
    const raw  = (data.choices[0]?.message?.content || '').trim().replace(/```json\s*/gi,'').replace(/```/g,'').trim();
    try { return JSON.parse(raw); }
    catch { const m = raw.match(/\[[\s\S]*\]/); if (!m) throw new Error('JSON parse failed'); return JSON.parse(m[0]); }
  }

  /* ── SOLVE FLOW ── */
  async function runSolve() {
    chrome.storage.local.get(['groqApiKey','groqModel'], async (cfg) => {
      if (!cfg.groqApiKey) {
        if (!isOpen) togglePanel();
        setStatus('API key required', 'err');
        return;
      }
      if (!isOpen) togglePanel();
      showScreen('loading');

      const loadText = document.getElementById('fsb-load-text');
      
      await sleep(200);
      loadText.textContent = 'Scanning DOM...';
      await sleep(250);

      const questions = scrape();
      if (!questions.length) {
        loadText.textContent = 'No questions found';
        setTimeout(() => showScreen('home'), 2000);
        return;
      }

      loadText.textContent = `Analyzing ${questions.length} question${questions.length !== 1 ? 's' : ''}...`;

      try {
        const model   = cfg.groqModel || 'llama-3.3-70b-versatile';
        const results = await callGroq(questions, cfg.groqApiKey, model);
        
        loadText.textContent = 'Done';
        await sleep(200);
        
        lastQuestions = questions;
        lastResults   = results;
        renderResults(questions, results);
        showScreen('results');
      } catch (err) {
        loadText.textContent = `Error: ${err.message}`;
        setTimeout(() => showScreen('home'), 3500);
      }
    });
  }

  /* ── RENDER RESULTS ── */
  function renderResults(questions, results) {
    document.getElementById('fsb-res-label').textContent = `${results.length} Answer${results.length !== 1 ? 's' : ''}`;
    const cards = document.getElementById('fsb-cards');
    cards.innerHTML = '';

    results.forEach((r, i) => {
      const q       = questions[r.qIndex] ?? questions[i];
      const answers = Array.isArray(r.answers) ? r.answers : [r.answers ?? '?'];
      
      const card = document.createElement('div');
      card.className = 'fsb-card';

      const top = document.createElement('div');
      top.className = 'fsb-card-top';
      top.innerHTML = `<span class="fsb-card-num">Question ${i + 1}</span>`;

      const qText = document.createElement('div');
      qText.className = 'fsb-card-q';
      qText.textContent = (q?.text || 'Unknown question').substring(0, 150) + ((q?.text?.length || 0) > 150 ? '…' : '');

      card.appendChild(top);
      card.appendChild(qText);

      answers.forEach(a => {
        const ansEl = document.createElement('div');
        ansEl.className = 'fsb-card-ans';
        ansEl.textContent = a || '(no answer)';
        card.appendChild(ansEl);
      });

      cards.appendChild(card);
    });
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ── INIT ── */
  function init() {
    if (document.querySelector('.Qr7Oae[role="listitem"]')) {
      injectTrigger();
    } else {
      const obs = new MutationObserver(() => {
        if (document.querySelector('.Qr7Oae[role="listitem"]')) { injectTrigger(); obs.disconnect(); }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
