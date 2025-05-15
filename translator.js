(function () {
  const html = `
    <style>
      #translator_card {
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 340px;
        background: var(--darker-secondary-color, #1e1e1e);
        padding: 12px;
        border-radius: 16px;
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.6);
        z-index: 9999;
        display: none;
        flex-direction: column;
        font-family: sans-serif;
      }
      #translator_card.open {
        display: flex;
      }
      #translator_card .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      #translator_card .header p {
        font-weight: bold;
        margin: 0 auto;
        transform: translateX(-12px);
      }
      #translator_card textarea {
        width: 100%;
        height: 60px;
        border: none;
        border-radius: 10px;
        resize: none;
        padding: 10px;
        margin: 10px 0;
        font-size: 14px;
        color: white;
        background: var(--secondary-color, #2a2a2a);
      }
      #translator_card select {
        width: 48%;
        padding: 6px;
        background: var(--secondary-color, #2a2a2a);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 13px;
      }
      #translator_card .lang-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      #translator_card .translate-btn {
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 10px;
        background: var(--primary-color, #3b82f6);
        color: white;
        font-weight: bold;
        cursor: pointer;
        font-size: 14px;
        margin-bottom: 10px;
        transition: background 0.2s;
      }
      #translator_card .translate-btn:hover {
        background: #2563eb;
      }
      #translator_output_wrapper {
        background: var(--secondary-color, #2a2a2a);
        color: white;
        padding: 10px;
        border-radius: 10px;
        min-height: 40px;
        white-space: pre-wrap;
        font-size: 14px;
        position: relative;
    }

      #copy_translate_btn {
        position: absolute;
        right: 8px;
        top: 8px;
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
      }

    </style>

    <div id="translator_card">
      <div class="header">
        <button id="translator_close" style="background: none; border: none; color: white; font-size: 20px;">
          <i class="bx bx-x-circle"></i>
        </button>
        <p>Translator</p>
      </div>
      <textarea id="translator_input" placeholder="Enter text..."></textarea>
      <div class="lang-row">
        <select id="source_lang">
          ${generateLangOptions()}
        </select>
        <select id="target_lang">
          ${generateLangOptions('es')}
        </select>
      </div>
      <button class="translate-btn" id="translate_btn">Translate</button>
      <div id="translator_output_wrapper">
        <button id="copy_translate_btn" title="Copy to clipboard"><i class="bx bx-copy"></i></button>
        <div id="translator_output"></div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  const card = document.getElementById('translator_card');
  const input = document.getElementById('translator_input');
  const output = document.getElementById('translator_output');
  const copyBtn = document.getElementById('copy_translate_btn');
  const translateBtn = document.getElementById('translate_btn');

  document.getElementById('translator_close').onclick = () => {
    card.classList.remove('open');
  };

  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(output.textContent);
      copyBtn.innerHTML = `<i class="bx bx-check"></i>`;
      setTimeout(() => {
        copyBtn.innerHTML = `<i class="bx bx-copy"></i>`;
      }, 1000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  translateBtn.onclick = async () => {
    const text = input.value.trim();
    const source = document.getElementById('source_lang').value;
    const target = document.getElementById('target_lang').value;

    if (!text) return (output.textContent = '');

    output.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i>`;

    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`);
      const data = await res.json();
      output.textContent = data.responseData.translatedText || 'Translation failed.';
    } catch (err) {
      console.error(err);
      output.textContent = 'Error during translation.';
    }
  };

    const translateIconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="m17,11c-.4,0-.75.23-.91.59l-4,9,1.83.81,1.07-2.41h4.03l1.07,2.41,1.83-.81-4-9c-.16-.36-.52-.59-.91-.59Zm-1.13,6l1.13-2.54,1.13,2.54h-2.26Z"></path>
    <path d="m12.25,14.97l.49-1.94c-.13-.03-1.6-.43-3.17-1.42,1.4-1.41,2.49-3.26,2.74-5.61h1.68v-2h-5v-2h-2v2H2v2h8.3c-.25,1.91-1.19,3.34-2.31,4.4-.69-.65-1.31-1.44-1.74-2.4h-2.13c.5,1.44,1.33,2.63,2.3,3.61-1.57.99-3.04,1.39-3.17,1.42l.49,1.94c1.18-.3,2.76-.96,4.26-2.02,1.49,1.06,3.08,1.72,4.25,2.02Z"></path>
    </svg>
    `;

  // Add translator button to controls
  const controlsSection = document.querySelector('.controls');
  if (controlsSection) {
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = translateIconSVG;;
    toggleBtn.onclick = () => {
      card.classList.toggle('open');
      if (card.classList.contains('open')) input.focus();
    };
    controlsSection.insertBefore(toggleBtn, controlsSection.querySelector('button[onclick="sendMessage()"]'));
  }

  function generateLangOptions(defaultLang) {
    const langs = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ru: "Russian",
      zh: "Chinese",
      ja: "Japanese",
      ko: "Korean",
      hi: "Hindi",
      ar: "Arabic",
      tr: "Turkish",
      nl: "Dutch",
      sv: "Swedish",
      pl: "Polish",
      uk: "Ukrainian",
      ro: "Romanian",
      th: "Thai",
      vi: "Vietnamese",
      id: "Indonesian",
      fa: "Persian",
      he: "Hebrew",
      el: "Greek"
    };

    return Object.entries(langs)
      .map(([code, name]) =>
        `<option value="${code}" ${defaultLang === code ? "selected" : ""}>${name}</option>`
      )
      .join("");
  }
})();
