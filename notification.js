var controlsSection = document.querySelector('.controls');

const NOTIF_STORAGE_KEY = 'notificationplugin_settings';
const NOTIF_SOUND_URL = 'https://media.memesoundeffects.com/2021/06/Discord-Notification-Sound-Effect.mp3';

function getSettings() {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_STORAGE_KEY)) || { enabled: true };
  } catch {
    return { enabled: true };
  }
}

function saveSettings(settings) {
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(settings));
}

function toggleNotifications() {
  const settings = getSettings();
  settings.enabled = !settings.enabled;
  saveSettings(settings);
  updateButtonState();
  return settings.enabled;
}

function updateButtonState() {
  const button = document.querySelector('.notification-toggle-btn');
  if (button) {
    const settings = getSettings();
    button.style.filter = settings.enabled ? 'none' : 'grayscale(80%)';
    button.title = settings.enabled ? 'Disable Notifications' : 'Enable Notifications';
  }
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
  const newButton = document.createElement('button');
  newButton.className = 'notification-toggle-btn';
  newButton.innerHTML = `<i class='bx bx-bell'></i>`;
  newButton.onclick = () => {
    requestNotificationPermission().then(permission => {
      if (permission === 'granted') {
        const enabled = toggleNotifications();
        if (enabled) {
          alert('Notifications enabled!');
        } else {
          alert('Notifications disabled!');
        }
      } else {
        alert('Notification permission denied. Please enable it in browser settings.');
      }
    });
  };
  controlsSection.insertBefore(newButton, controlsSection.querySelector('button[onclick="sendMessage()"]'));

  // Update button state on load
  updateButtonState();

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

// CSS for styling the notification button
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .notification-toggle-btn {
    background: var(--secondary-color, #0a0a0a);
    border: none;
    color: var(--font-color, #ffffff);
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
  }
  .notification-toggle-btn i {
    font-size: 20px; /* Slightly smaller to match SVG sizes */
    line-height: 1;
  }
  .notification-toggle-btn:hover {
    filter: brightness(120%);
  }
`;
document.head.appendChild(styleSheet);