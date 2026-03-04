const KEY = 'ev-color-scheme';
let isColorSchemeInitialized = false;

function getColorScheme() {
  return localStorage.getItem(KEY) || 'system';
}

/**
 * @param {string} val - color scheme value: 'system' | 'light' | 'dark'
 */
function updateColorScheme(val) {
  const doc = document.documentElement;

  switch (val) {
    case 'dark':
      doc.classList.remove('light');
      doc.classList.add(val);
      localStorage.setItem(KEY, val);
      break;

    case 'light':
      doc.classList.remove('dark');
      doc.classList.add(val);
      localStorage.setItem(KEY, val);
      break;

    default:
      doc.classList.remove('dark', 'light');
      localStorage.setItem(KEY, 'system');
      break;
  }
}

function initializeColorScheme() {
  if (!isColorSchemeInitialized) {
    updateColorScheme(getColorScheme());
    isColorSchemeInitialized = true;
  }
}

initializeColorScheme();
