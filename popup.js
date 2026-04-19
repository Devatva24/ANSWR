document.addEventListener('DOMContentLoaded', () => {
  const keyInput = document.getElementById('api-key');
  const modelSel = document.getElementById('model-sel');
  const saveBtn  = document.getElementById('save-btn');
  const groqBtn  = document.getElementById('groq-btn');
  const toast    = document.getElementById('toast');
  const accent   = document.getElementById('s-accent');
  const stitle   = document.getElementById('s-title');
  const sdesc    = document.getElementById('s-desc');

  chrome.storage.local.get(['groqApiKey','groqModel'], (d) => {
    if (d.groqApiKey) keyInput.value = d.groqApiKey;
    if (d.groqModel)  modelSel.value = d.groqModel;
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url    = tabs[0]?.url || '';
    const isForm = url.includes('docs.google.com/forms');
    accent.classList.toggle('on', isForm);
    stitle.textContent = isForm ? 'Form Detected' : 'No Form';
    sdesc.textContent  = isForm ? 'Press Alt+P to open panel' : 'Navigate to a Google Form';
  });

  saveBtn.addEventListener('click', () => {
    const key   = keyInput.value.trim();
    const model = modelSel.value;
    if (!key || !key.startsWith('gsk_')) {
      showToast('Error: Key must start with gsk_', 'err');
      return;
    }
    chrome.storage.local.set({ groqApiKey: key, groqModel: model }, () => {
      showToast('Config saved.', 'ok');
    });
  });

  groqBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://console.groq.com/keys' });
  });

  function showToast(msg, type) {
    toast.textContent   = msg;
    toast.className     = 'toast ' + type + ' show';
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
  }
});
