(function () {
  const controlsSection = document.querySelector('.controls');
  if (!controlsSection) return;

  window.toggleFormatterCard = function () {
    const card = document.getElementById('formatter_card');
    if (!card) return;
    card.classList.toggle('open');
    card.style.display = card.classList.contains('open') ? 'flex' : 'none';
  };

  function wrapText(openTag, closeTag = '') {
    const input = document.querySelector('textarea');
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;
    const fullText = input.value;

    let before, selected, after;

    // Check if it's an attachment tag
    const isAttachmentTag = openTag.includes('img') || openTag.includes('audio') || openTag.includes('source');

    if (start !== end && !isAttachmentTag) {
      before = fullText.slice(0, start);
      selected = fullText.slice(start, end);
      after = fullText.slice(end);
    } else {
      before = fullText.slice(0, start);
      selected = '';
      after = fullText.slice(end);
    }

    const wrapped = isAttachmentTag ? openTag + closeTag : `${openTag}${selected}${closeTag}`;
    input.value = before + wrapped + after;

    input.focus();
    const cursorPos = isAttachmentTag
      ? before.length + openTag.indexOf('src=""') + 5
      : selected
        ? before.length + wrapped.length
        : before.length + openTag.length;
    input.selectionStart = input.selectionEnd = cursorPos;
  }

  const formatterBtn = document.createElement('button');
  formatterBtn.className = 'todo-toggle-btn';
  formatterBtn.innerHTML = `<i class="bx bx-code-curly"></i>`;
  formatterBtn.title = "Toggle HTML Formatter";
  formatterBtn.setAttribute('aria-label', 'Toggle HTML Formatter');
  formatterBtn.onclick = () => toggleFormatterCard();
  controlsSection.insertBefore(formatterBtn, controlsSection.querySelector('button[onclick="sendMessage()"]'));

  document.body.insertAdjacentHTML('beforeend', `
    <div id="formatter_card" class="formatter-card" style="display:none;">
      <div class="formatter-header">
        <p class="formatter-title">Formatter</p>
        <button onclick="toggleFormatterCard()" class="formatter-close-btn" aria-label="Close formatter">
          <i class="bx bx-x"></i>
        </button>
      </div>
      <div id="formatter_buttons" class="formatter-buttons"></div>
    </div>

    <style>
      .formatter-card {
        max-width: 420px;
        max-height: 500px;
        position: fixed;
        bottom: 90px;
        right: 24px;
        background: var(--darker-secondary-color, #1a1a1a);
        border: 1px solid var(--light-gray-color, #444);
        border-radius: 16px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        color: var(--font-color, #ffffff);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        overflow-y: auto;
        z-index: 10000;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 0;
        transform: translateY(10px);
      }

      .formatter-card.open {
        opacity: 1;
        transform: translateY(0);
      }

      .formatter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .formatter-title {
        font-weight: 700;
        font-size: 1.4rem;
        margin: 0;
        color: var(--font-color, #ffffff);
        letter-spacing: 0.5px;
      }

      .formatter-close-btn {
        background: transparent;
        border: none;
        color: var(--light-gray-color, #bbb);
        font-size: 24px;
        cursor: pointer;
        transition: color 0.2s ease, transform 0.2s ease;
      }

      .formatter-close-btn:hover {
        color: var(--primary-color, #ff5555);
        transform: rotate(90deg);
      }

      .formatter-buttons {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .formatter-section {
        border: 1px solid var(--gray-color, #333);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .formatter-section-header {
        background: var(--darker-secondary-color);
        padding: 10px 16px;
        cursor: pointer;
        user-select: none;
        font-weight: 600;
        font-size: 1.1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--font-color, #ffffff);
        transition: background 0.2s ease;
      }

      .formatter-section-header:hover {
        background: var(--secondary-color, #333);
      }

      .formatter-section-content {
        display: none;
        flex-wrap: wrap;
        padding: 14px;
        gap: 12px;
        background: var(--secondary-color, #222);
      }

      .formatter-section.open .formatter-section-content {
        display: flex;
      }

      .formatter-button {
        background: linear-gradient(145deg, var(--secondary-color, #333), var(--darker-secondary-color, #1a1a1a));
        color: var(--font-color, #ffffff);
        border: none;
        padding: 10px 16px;
        border-radius: 10px;
        font-size: 0.95rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
        flex: 1;
        min-width: 90px;
        text-align: center;
      }

      .formatter-button:hover {
        background: linear-gradient(145deg, var(--primary-color, #1e90ff), var(--secondary-color, #333));
        transform: translateY(-2px);
        box-shadow: 0 5px 12px rgba(0, 0, 0, 0.3);
      }

      .formatter-button:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(var(--primary-color, #1e90ff), 0.3);
      }

      .formatter-button:active {
        transform: scale(0.95);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      @media (max-width: 600px) {
        .formatter-card {
          max-width: 92vw;
          bottom: 80px;
          right: 12px;
          padding: 16px;
        }

        .formatter-title {
          font-size: 1.2rem;
        }

        .formatter-button {
          padding: 8px 12px;
          font-size: 0.9rem;
          min-width: 80px;
        }

        .formatter-section-header {
          padding: 8px 12px;
          font-size: 1rem;
        }

        .formatter-section-content {
          padding: 12px;
          gap: 10px;
        }
      }

      :root {
        --button-text-color: var(--font-color, #ffffff);
        --button-bg: var(--secondary-color, #333);
        --button-hover-bg: var(--primary-color, #1e90ff);
      }

      @media (prefers-contrast: high) {
        .formatter-card {
          border: 2px solid var(--font-color, #ffffff);
        }

        .formatter-section {
          border: 2px solid var(--font-color, #ffffff);
        }

        .formatter-section-header {
          background: var(--gray-color, #2a2a2a);
          color: var(--font-color, #ffffff);
        }

        .formatter-section-content {
          background: var(--secondary-color, #222);
        }

        .formatter-button {
          background: var(--button-bg, #333);
          color: var(--button-text-color, #ffffff);
          border: 1px solid var(--font-color, #ffffff);
        }

        .formatter-button:hover {
          background: var(--button-hover-bg, #1e90ff);
        }
      }
    </style>
  `);

  const buttonSets = [
    {
      title: "Embeds",
      buttons: [
        { label: 'embed', tag: ['<div class="embed">', '</div>'] },
        { label: 'note', tag: ['<div class="embed note"><i class="bx bx-note"></i>', '</div>'] },
        { label: 'success', tag: ['<div class="embed success"><i class="bx bx-check-circle"></i>', '</div>'] },
        { label: 'info', tag: ['<div class="embed info"><i class="bx bx-info-circle"></i>', '</div>'] },
        { label: 'warn', tag: ['<div class="embed warn"><i class="bx bx-error"></i>', '</div>'] },
        { label: 'error', tag: ['<div class="embed error"><i class="bx bx-x-circle"></i>', '</div>'] },
        { label: 'clean', tag: ['<div class="embed clean">', '</div>'] }
      ]
    },
    {
      title: "Formatting",
      buttons: [
        { label: 'bold', tag: ['<strong>', '</strong>'] },
        { label: 'italic', tag: ['<em>', '</em>'] },
        { label: 'strike', tag: ['<del>', '</del>'] },
        { label: 'underline', tag: ['<u>', '</u>'] },
        { label: 'code', tag: ['<code>', '</code>'] },
        { label: 'multi-code', tag: ['<code class="multiline">', '</code>'] },
        { label: 'quote', tag: ['<blockquote>', '</blockquote>'] },
        { label: 'spoiler', tag: ['<p class="spoiler">', '</p>'] },
        { label: 'h1', tag: ['<h1>', '</h1>'] },
        { label: 'list', tag: ['<ul><li>', '</li></ul>'] }
      ]
    },
    {
      title: "Attachments",
      buttons: [
        { label: 'img', tag: ['<img class="attachment" src="">', ''] },
        { label: 'img (spoiler)', tag: ['<img class="attachment spoiler" src="">', ''] },
        { label: 'video', tag: ['<video class="attachment" controls width="320" height="240"><source src="">', '</video>'] },
        { label: 'audio', tag: ['<audio controls src="">', '</audio>'] }
      ]
    }
  ];

  const container = document.getElementById('formatter_buttons');
  if (!container) return;

  for (const section of buttonSets) {
    const wrapper = document.createElement('div');
    wrapper.className = 'formatter-section';

    const header = document.createElement('div');
    header.className = 'formatter-section-header';
    header.innerHTML = `<span>${section.title}</span><span>+</span>`;
    header.onclick = () => {
      wrapper.classList.toggle('open');
      header.querySelector('span:last-child').textContent =
        wrapper.classList.contains('open') ? '−' : '+';
    };

    const content = document.createElement('div');
    content.className = 'formatter-section-content';

    section.buttons.forEach(btn => {
      const b = document.createElement('button');
      b.className = 'formatter-button';
      b.textContent = btn.label;
      b.setAttribute('aria-label', `Wrap text with ${btn.label} tag`);
      b.onclick = () => wrapText(...btn.tag);
      content.appendChild(b);
    });

    wrapper.appendChild(header);
    wrapper.appendChild(content);
    container.appendChild(wrapper);
  }
})();