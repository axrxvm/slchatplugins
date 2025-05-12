(function () {
  const root = document.documentElement;

  const themeVariables = {
    '--primary-color': '#000000',               // Main background: pure black
    '--secondary-color': '#0a0a0a',             // Slightly raised surfaces
    '--darker-secondary-color': '#050505',      // Cards, modals
    '--light-gray-color': '#b9bbbe',            // Subtext
    '--gray-color': '#72767d',                  // Muted icons, labels
    '--font-color': '#ffffff'                   // White text
  };

  for (const [varName, value] of Object.entries(themeVariables)) {
    root.style.setProperty(varName, value);
  }
})();
