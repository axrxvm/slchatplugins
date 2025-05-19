var controlsSection = document.querySelector('.controls');

const NOTIF_STORAGE_KEY = 'notificationplugin_settings'; // Unique key to avoid conflict
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
    const settings = JSON.parse(localStorage.getItem(NOTIF_STORAGE_KEY)) || { enabled: true, volume: 0.5 };
    // Validate volume: ensure it's a finite number between 0 and 1
    if (typeof settings.volume !== 'number' || !isFinite(settings.volume) || settings.volume < 0 || settings.volume > 1) {
      settings.volume = 0.5; // Default if invalid
    }
    return settings;
  } catch {
    return { enabled: true, volume: 0.5 }; // Default if parsing fails
  }
}

function saveSettings(settings) {
  // Ensure volume is valid before saving
  if (typeof settings.volume !== 'number' || !isFinite(settings.volume)) {
    settings.volume = 0.5;
  }
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(settings));
}

function renderNotificationSettings() {
  const settings_container = document.getElementById('notification_settings');
  const settings = getSettings();
  
  // Update the enable checkbox
  const enable_checkbox = document.getElementById('enable_notifications');
  enable_checkbox.checked = settings.enabled;
  
  // Update the volume slider
  const volume_slider = document.getElementById('notification_volume');
  volume_slider.value = settings.volume;
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
  const settings = getSettings();
  // Set volume with validation
  notif_audio.volume = isFinite(settings.volume) ? settings.volume : 0.5;

  // Add the notification settings card
  document.body.insertAdjacentHTML('beforeend', `
    <div id="notification_card" class="notification-card" style="display:none; flex-direction: column;">
      <div class="notification-header">
        <p class="notification-title">Notification Settings</p>
        <button onclick="toggleNotificationCard()" class="notification-close-btn" aria-label="Close notification settings">
          <i class="bx bx-x"></i>
        </button>
      </div>
      <div id="notification_settings" class="notification-settings">
        <label class="notification-label">
          <input id="enable_notifications" type="checkbox" class="notification-checkbox">
          Enable Notifications
        </label>
        <label class="notification-label">
          Sound Volume
          <input id="notification_volume" type="range" min="0" max="1" step="0.1" class="notification-slider">
        </label>
      </div>
    </div>

    <style>
      /* Container */
      .notification-card {
        max-width: 360px;
        max-height: 420px;
        position: fixed;
        bottom: 80px; /* offset above chat controls bar */
        right: 20px;
        background: var(--darker-secondary-color, #222);
        box-shadow: 0 4px 12px rgba(0,0,0,0.7);
        padding: 15px 18px;
        border-radius: 12px;
        display: none;
        flex-direction: column;
        color: white;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        transition: opacity 0.25s ease, transform 0.25s ease;
        z-index: 10000;
      }

      .notification-card.open {
        display: flex;
      }

      /* Header */
      .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .notification-title {
        font-weight: 700;
        font-size: 1.3rem;
        margin: 0;
        user-select: none;
      }

      .notification-close-btn {
        background: transparent;
        border: none;
        color: #bbb;
        font-size: 22px;
        cursor: pointer;
        transition: color 0.2s ease;
      }
      .notification-close-btn:hover {
        color: #ff5555;
      }

      /* Settings container */
      .notification-settings {
        flex-grow: 1;
        background: var(--secondary-color, #333);
        border-radius: 8px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      /* Label styling */
      .notification-label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 1rem;
        color: white;
      }

      /* Checkbox */
      .notification-checkbox {
        width: 18px;
        height: 18px;
        cursor: pointer;
        accent-color: var(--primary-color, #0af);
      }

      /* Slider */
      .notification-slider {
        width: 150px;
        cursor: pointer;
        accent-color: var(--primary-color, #0af);
      }

      /* Toggle button */
      .notification-toggle-btn {
        background: var(--secondary-color, #0a0a0a);
        border: none;
        color: var(--font-color, #ffffff);
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 5px;
        line-height: 0;
      }
      .notification-toggle-btn i {
        font-size: 24px;
        line-height: 1;
        background: none !important;
        border: none !important;
      }
      .notification-toggle-btn:hover {
        filter: brightness(120%);
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

  const volume_slider = document.getElementById('notification_volume');
  volume_slider.addEventListener('input', function () {
    const settings = getSettings();
    settings.volume = parseFloat(this.value);
    saveSettings(settings);
    notif_audio.volume = settings.volume; // This is now safe due to validation
  });

  // Listen for new messages
  socket.on('prompt', function(prompt) {
    const settings = getSettings();
    if (!settings.enabled) return;
    if (prompt.message.owner.id === user_id) return; // Ignore own messages

    const messageText = prompt.message.text;
    const sender = prompt.message.owner.nickname || 'Unknown';

    if (document.hidden) {
      notif_audio.play().catch(err => console.error('Audio play error:', err));
      showBrowserNotification(messageText, sender);
    }
  });
}