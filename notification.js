var controlsSection = document.querySelector('.controls');

const NOTIF_STORAGE_KEY = 'notificationplugin_settings';
const NOTIF_SOUND_URL = 'https://media.memesoundeffects.com/2021/06/Discord-Notification-Sound-Effect.mp3';

window.toggleNotificationCard = async function () {
  var notification_card = document.getElementById('notification_card');
  if (!notification_card) return;

  notification_card.classList.toggle('open');

  if (notification_card.classList.contains('open')) {
    notification_card.style.display = 'flex';
    const enable_checkbox = document.getElementById('enable_notifications');
    if (enable_checkbox) enable_checkbox.focus();
    renderNotificationSettings();
  } else {
    notification_card.style.display = 'none';
  }
};

function getSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem(NOTIF_STORAGE_KEY)) || { enabled: true };
    return settings;
  } catch {
    return { enabled: true };
  }
}

function saveSettings(settings) {
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(settings));
}

function renderNotificationSettings() {
  const settings_container = document.getElementById('notification_settings');
  const settings = getSettings();
  
  const enable_checkbox = document.getElementById('enable_notifications');
  enable_checkbox.checked = settings.enabled;
}

function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return Promise.resolve('denied');
  }
  if (Notification.permission === 'granted') {
    return Promise.resolve('granted');
  }
  return Notification.requestPermission();
}

function showBrowserNotification(message, sender) {
  if (Notification.permission !== 'granted') return;
  new Notification(`New Message from ${sender}`, {
    body: message,
    icon: 'https://slchat.alwaysdata.net/static/icon.svg',
    tag: 'slchat_message',
  });
}

if (controlsSection && typeof socket !== 'undefined' && socket) {
  const user_id = GetCookie('op');
  const notif_audio = new Audio(NOTIF_SOUND_URL);

  document.body.insertAdjacentHTML('beforeend', `
    <div id="notification_card" class="notification-card" style="display:none; flex-direction: column;">
      <div class="notification-header">
        <p class="notification-title"><i class="bx bx-bell bx-xs"></i> Notification Settings</p>
        <button onclick="toggleNotificationCard()" class="notification-close-btn" aria-label="Close notification settings">
          <i class="bx bx-x"></i>
        </button>
      </div>
      <div id="notification_settings" class="notification-settings">
        <label class="notification-label">
          <input id="enable_notifications" type="checkbox" class="notification-checkbox">
          Enable Notifications
        </label>
      </div>
    </div>

    <style>
      /* Container */
      .notification-card {
        max-width: 360px;
        max-height: 420px;
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: linear-gradient(145deg, var(--darker-secondary-color, #222), var(--secondary-color, #333));
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.8);
        padding: 20px;
        border-radius: 16px;
        display: none;
        flex-direction: column;
        color: var(--font-color, #ffffff);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 10000;
      }

      .notification-card.open {
        display: flex;
        opacity: 1;
        transform: translateY(0);
      }

      /* Header */
      .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .notification-title {
        font-weight: 700;
        font-size: 1.3rem;
        margin: 0;
        user-select: none;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .notification-title i {
        font-size: 1.2rem;
        color: var(--primary-color, #0af);
      }

      .notification-close-btn {
        background: transparent;
        border: none;
        color: var(--font-color, #bbb);
        font-size: 28px;
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
      }
      .notification-close-btn:hover {
        color: var(--red, #ff5555);
        background: rgba(255, 85, 85, 0.1);
        transform: scale(1.1);
      }

      /* Settings container */
      .notification-settings {
        flex-grow: 1;
        background: var(--secondary-color, #333);
        border-radius: 12px;
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      /* Label styling */
      .notification-label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 1rem;
        color: var(--font-color, #ffffff);
        gap: 10px;
      }

      /* Checkbox */
      .notification-checkbox {
        appearance: none;
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        background: var(--secondary-color, #333);
        border: 2px solid var(--font-color, #ffffff);
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        transition: background 0.2s ease, border-color 0.2s ease;
      }
      .notification-checkbox:hover {
        border-color: var(--primary-color, #0af);
      }
      .notification-checkbox:checked {
        background: var(--primary-color, #0af);
        border-color: var(--primary-color, #0af);
      }
      .notification-checkbox:checked::after {
        content: '\\2713';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
        color: var(--font-color, #ffffff);
      }

      /* Toggle button */
      .notification-toggle-btn {
        background: var(--primary-color, #0a0a0a);
        border: none;
        color: var(--font-color, #ffffff);
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 5px;
        line-height: 0;
        transition: filter 0.2s ease, transform 0.2s ease;
      }
      .notification-toggle-btn i {
        font-size: 24px;
        line-height: 1;
        background: none !important;
        border: none !important;
      }
      .notification-toggle-btn:hover {
        filter: brightness(120%);
        transform: scale(1.05);
      }
    </style>
  `);

  // Initialize notification toggle button
  const newButton = document.createElement('button');
  newButton.className = 'notification-toggle-btn';
  newButton.innerHTML = `<i class='bx bx-bell'></i>`;
  newButton.title = 'Toggle Notification Settings';
  newButton.onclick = () => {
    requestNotificationPermission().then(permission => {
      if (permission === 'granted') {
        toggleNotificationCard();
      } else {
        alert('Notification permission denied. Please enable it in browser settings.');
      }
    });
  };
  controlsSection.insertBefore(newButton, controlsSection.querySelector('button[onclick="sendMessage()"]'));

  // Add event listeners for settings
  const enable_checkbox = document.getElementById('enable_notifications');
  enable_checkbox.addEventListener('change', function () {
    const settings = getSettings();
    settings.enabled = this.checked;
    saveSettings(settings);
  });

  // Listen for new messages
  socket.on('prompt', function(prompt) {
    const settings = getSettings();
    if (!settings.enabled) return;
    if (prompt.message.owner.id === user_id) return;

    const messageText = prompt.message.text;
    const sender = prompt.message.owner.nickname || 'Unknown';

    if (document.hidden) {
      notif_audio.play().catch(err => console.error('Audio play error:', err));
      showBrowserNotification(messageText, sender);
    }
  });
}