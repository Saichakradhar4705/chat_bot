(function () {
  'use strict';

  // ── CONFIG ────────────────────────────────────────────────────────────────
  const CHAT_URL = (function () {
    const s = document.currentScript;
    if (s && s.src) {
      const u = new URL(s.src);
      return u.origin;
    }
    return 'http://localhost:5000';
  })();

  // ── STYLES ────────────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    /* ── INPUT BAR ── */
    #iare-input-bar {
      position: fixed;
      bottom: 0;
      right: 0;
      width: 25vw;
      min-width: 280px;
      z-index: 999998;
      background: linear-gradient(180deg, rgba(3,13,31,0.97) 0%, rgba(6,21,41,0.99) 100%);
      border-top: 1px solid rgba(255,255,255,0.12);
      border-left: 1px solid rgba(255,255,255,0.08);
      border-top-left-radius: 18px;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 -4px 30px rgba(0,0,0,0.45);
      font-family: 'Inter', system-ui, sans-serif;
      transition: transform 0.3s cubic-bezier(.34,1.2,.64,1), opacity 0.25s ease;
    }
    #iare-input-bar.hidden {
      transform: translateY(100%);
      opacity: 0;
      pointer-events: none;
    }
    #iare-bar-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
    }

    /* ✈️ logo */
    #iare-bar-logo {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #003087, #B8001C);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      flex-shrink: 0;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,48,135,0.4);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #iare-bar-logo:hover { transform: scale(1.08); box-shadow: 0 4px 16px rgba(0,48,135,0.6); }

    /* Fake input / clickable text box */
    #iare-bar-input {
      flex: 1;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      padding: 9px 14px;
      font-size: 0.85rem;
      color: #eef2ff;
      font-family: 'Inter', system-ui, sans-serif;
      outline: none;
      cursor: text;
      min-width: 0;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    }
    #iare-bar-input::placeholder { color: #6b82ab; }
    #iare-bar-input:focus {
      border-color: rgba(77,116,232,0.65);
      box-shadow: 0 0 0 3px rgba(0,48,135,0.22);
      background: rgba(255,255,255,0.09);
    }

    /* Send button */
    #iare-bar-send {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #003087, #1B5DBF);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 12px rgba(0,48,135,0.4);
      transition: all 0.2s;
    }
    #iare-bar-send:hover { transform: scale(1.1); box-shadow: 0 4px 16px rgba(0,48,135,0.6); }
    #iare-bar-send svg { width: 16px; height: 16px; fill: white; }

    /* ── SUGGESTIONS ── */
    #iare-suggestions {
      position: fixed;
      z-index: 999997;
      background: linear-gradient(180deg, rgba(4,16,34,0.98) 0%, rgba(6,21,41,0.99) 100%);
      border-top: 1px solid rgba(255,255,255,0.1);
      border-left: 1px solid rgba(255,255,255,0.08);
      border-right: 1px solid rgba(255,255,255,0.08);
      border-top-left-radius: 14px;
      border-top-right-radius: 4px;
      padding: 10px 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
      transform: translateY(8px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.22s cubic-bezier(.34,1.2,.64,1), opacity 0.18s ease;
    }
    #iare-suggestions.visible {
      transform: translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    #iare-suggestions .sug-label {
      font-size: 0.66rem;
      color: #6b82ab;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      font-family: 'Inter', system-ui, sans-serif;
    }
    .iare-sug-chips { display: flex; flex-wrap: wrap; gap: 5px; }
    .iare-sug-chip {
      background: rgba(26,58,138,0.18);
      border: 1px solid rgba(77,116,232,0.28);
      border-radius: 100px;
      padding: 5px 11px;
      font-size: 0.74rem;
      color: #7ba3e8;
      cursor: pointer;
      font-family: 'Inter', system-ui, sans-serif;
      transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.12s;
      white-space: nowrap;
    }
    .iare-sug-chip:hover {
      background: rgba(26,58,138,0.35);
      border-color: rgba(77,116,232,0.6);
      color: #a8c4f5;
      transform: translateY(-1px);
    }

    /* ── OVERLAY ── */
    #iare-chat-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 999998;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }
    #iare-chat-overlay.visible { opacity: 1; pointer-events: all; }

    /* ── CHAT MODAL ── */
    #iare-chat-modal {
      position: fixed;
      bottom: 0;
      right: 0;
      width: 25vw;
      min-width: 280px;
      height: 55vh;
      max-height: 520px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      background: linear-gradient(160deg, #030d1f 0%, #061529 50%, #0b2145 100%);
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      box-shadow: 0 -8px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07);
      transform: translateY(100%);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.38s cubic-bezier(.34,1.1,.64,1), opacity 0.28s ease;
    }
    #iare-chat-modal.open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    /* Modal header */
    #iare-modal-header {
      background: linear-gradient(135deg, #030d1f 0%, #003087 100%);
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
      border-bottom: 1px solid rgba(253,184,19,0.2);
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
    }
    #iare-modal-header .m-logo {
      width: 34px; height: 34px; border-radius: 9px;
      background: linear-gradient(135deg, #003087, #B8001C);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; flex-shrink: 0;
    }
    #iare-modal-header .m-title { flex: 1; color: #f0f4ff; }
    #iare-modal-header .m-title strong { display: block; font-size: 0.88rem; font-weight: 700; font-family: 'Inter', system-ui, sans-serif; }
    #iare-modal-header .m-title span {
      font-size: 0.7rem; color: #22c55e; font-family: system-ui, sans-serif;
      display: flex; align-items: center; gap: 4px;
    }
    #iare-modal-header .m-title span::before {
      content: ''; width: 6px; height: 6px; border-radius: 50%; background: #22c55e;
      display: inline-block; animation: iare-blink 2s ease-in-out infinite;
    }
    @keyframes iare-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

    #iare-close-btn {
      width: 30px; height: 30px; border-radius: 8px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      color: #8fa3c8; font-size: 14px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s, color 0.2s; flex-shrink: 0;
    }
    #iare-close-btn:hover { background: rgba(184,0,28,0.3); color: #e8001f; border-color: rgba(184,0,28,0.4); }

    /* iframe */
    #iare-chat-frame { flex: 1; width: 100%; border: none; background: #05071a; }

    /* Responsive */
    @media (max-width: 900px) {
      #iare-input-bar, #iare-chat-modal { width: 40vw; }
    }
    @media (max-width: 600px) {
      #iare-input-bar, #iare-chat-modal {
        width: 100vw; min-width: unset;
        border-top-left-radius: 0; border-left: none;
      }
    }
  `;

  // Inject styles
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── QUICK SUGGESTIONS ──
  const SUGGESTIONS = [
    '✈️ Aeronautical Engineering',
    '📝 Admission process',
    '💼 Placement record',
    '🏫 Campus facilities',
    '🔬 Research opportunities',
    '📞 Contact IARE',
    '🎓 M.Tech & MBA',
    '🚌 Bus facility',
  ];

  // ── DOM ───────────────────────────────────────────────────────────────────

  // Overlay
  const overlay = document.createElement('div');
  overlay.id = 'iare-chat-overlay';
  document.body.appendChild(overlay);

  // Suggestions popup (separate fixed element)
  const sugBox = document.createElement('div');
  sugBox.id = 'iare-suggestions';
  sugBox.innerHTML = `
    <div class="sug-label">💡 Quick questions</div>
    <div class="iare-sug-chips">
      ${SUGGESTIONS.map(s => `<button class="iare-sug-chip">${s}</button>`).join('')}
    </div>
  `;
  document.body.appendChild(sugBox);

  // Input bar
  const bar = document.createElement('div');
  bar.id = 'iare-input-bar';
  bar.innerHTML = `
    <div id="iare-bar-row">
      <div id="iare-bar-logo" title="Open IARE Chat">✈️</div>
      <input
        id="iare-bar-input"
        type="text"
        placeholder="Ask IARE anything..."
        aria-label="Ask IARE Campus Assistant"
        autocomplete="off"
      />
      <button id="iare-bar-send" aria-label="Send" title="Send">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
  `;
  document.body.appendChild(bar);

  // Chat modal
  const modal = document.createElement('div');
  modal.id = 'iare-chat-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-label', 'IARE AI Chat');
  modal.innerHTML = `
    <div id="iare-modal-header">
      <div class="m-logo">✈️</div>
      <div class="m-title">
        <strong>IARE Campus Assistant</strong>
        <span>Online · Powered by AI</span>
      </div>
      <button id="iare-close-btn" title="Close chat" aria-label="Close chat">▼</button>
    </div>
    <iframe
      id="iare-chat-frame"
      src="${CHAT_URL}/"
      title="IARE AI Chatbot"
      allow="clipboard-write"
    ></iframe>
  `;
  document.body.appendChild(modal);

  // ── REFS ──────────────────────────────────────────────────────────────────
  const barInput = document.getElementById('iare-bar-input');
  const barSend = document.getElementById('iare-bar-send');
  const barLogo = document.getElementById('iare-bar-logo');
  const closeBtn = document.getElementById('iare-close-btn');
  const chatFrame = document.getElementById('iare-chat-frame');

  // ── STATE ──────────────────────────────────────────────────────────────────
  let isOpen = false;
  let iframeReady = false;
  let queuedMessage = null;

  chatFrame.addEventListener('load', () => {
    iframeReady = true;
    if (queuedMessage) {
      setTimeout(() => sendToIframe(queuedMessage), 100);
      queuedMessage = null;
    }
  });

  // ── SUGGESTIONS ───────────────────────────────────────────────────────────
  function positionSuggestions() {
    const rect = bar.getBoundingClientRect();
    sugBox.style.bottom = (window.innerHeight - rect.top) + 'px';
    sugBox.style.right = (window.innerWidth - rect.right) + 'px';
    sugBox.style.width = rect.width + 'px';
  }
  function showSuggestions() { positionSuggestions(); sugBox.classList.add('visible'); }
  function hideSuggestions() { sugBox.classList.remove('visible'); }

  barInput.addEventListener('focus', showSuggestions);
  barInput.addEventListener('blur', () => setTimeout(hideSuggestions, 180));

  // Chip click → fill input and send
  sugBox.querySelectorAll('.iare-sug-chip').forEach(chip => {
    chip.addEventListener('mousedown', e => {
      e.preventDefault();
      const label = chip.textContent.replace(/^\S+\s*/, '').trim();
      barInput.value = label;
      hideSuggestions();
      handleSend();
    });
  });

  // ── OPEN / CLOSE ──────────────────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    modal.classList.add('open');
    overlay.classList.add('visible');
    bar.classList.add('hidden');
    hideSuggestions();
  }

  function closeChat() {
    isOpen = false;
    modal.classList.remove('open');
    overlay.classList.remove('visible');
    bar.classList.remove('hidden');
    setTimeout(() => barInput.focus(), 200);
  }

  // ── SEND MESSAGE FROM BAR INTO IFRAME ─────────────────────────────────────
  function sendToIframe(message) {
    if (!message) return;
    try {
      chatFrame.contentWindow.postMessage(
        { type: 'iare-send-message', message },
        '*'
      );
    } catch (e) {
      console.warn('[IARE Widget] postMessage failed:', e);
    }
  }

  function handleSend() {
    const msg = barInput.value.trim();
    if (!msg) { openChat(); return; }
    barInput.value = '';
    openChat();
    if (iframeReady) {
      setTimeout(() => sendToIframe(msg), 180);
    } else {
      queuedMessage = msg;
    }
  }

  // ── EVENTS ────────────────────────────────────────────────────────────────
  // Clicking the input box → open chat (if empty) or send (if typed)
  barInput.addEventListener('click', () => { if (!barInput.value.trim()) openChat(); });
  barLogo.addEventListener('click', openChat);
  barSend.addEventListener('click', () => { hideSuggestions(); handleSend(); });

  barInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); hideSuggestions(); handleSend(); }
    if (e.key === 'Escape') { hideSuggestions(); barInput.blur(); }
  });

  closeBtn.addEventListener('click', closeChat);
  overlay.addEventListener('click', closeChat);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeChat(); });

})();
