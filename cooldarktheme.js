(function () {
  const htmlElement = document.documentElement;
  const selectedElements = document.querySelectorAll('.sidebar li .selected');

  // Set theme variables
  const themeVariables = {
    '--primary-color': '#000000',               // Main background: pure black
    '--secondary-color': '#0a0a0a',             // Slightly raised surfaces
    '--darker-secondary-color': '#050505',      // Cards, modals
    '--light-gray-color': '#b9bbbe',            // Subtext
    '--gray-color': '#72767d',                  // Muted icons, labels
    '--font-color': '#ffffff',                  // White text
    '--green': '#18B357'                        // Retain green for specific elements
  };

  for (const [varName, value] of Object.entries(themeVariables)) {
    htmlElement.style.setProperty(varName, value);
  }

  // Ensure a dark theme class is applied
  const hasTheme = htmlElement.classList.contains('dark_theme') || htmlElement.classList.contains('midnight_theme');
  if (!hasTheme) {
    htmlElement.classList.add('dark_theme');
  }

  // Set the background of .selected elements to --secondary-color
  selectedElements.forEach((element) => {
    element.style.setProperty('background', 'var(--secondary-color)', 'important');
  });

  // Inject a CSS rule to adjust the hover effect for .selected to be even lighter
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .sidebar li .selected:hover {
      filter: brightness(100%) !important;
    }
  `;
  document.head.appendChild(styleSheet);
})();
