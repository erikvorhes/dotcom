// import { getColorScheme, updateColorScheme } from './handleColorSchemeData.js';
// import onLoad from './onLoad.js';
const SETTING_NAME = 'color-scheme';
let isFormMounted = false;

/**
 * @param {string} id - element ID to mount the form to
 */
function mountFormOnLoad(id) { onLoad(function() { mountForm(id); }); }

/**
 * @param {string} id - element ID to mount the form to
 */
function mountForm(id) {
  if (isFormMounted || !CSS.supports('color', 'light-dark(black, white)')) {
    return;
  }
  
  const root = document.getElementById(id);
  if (!root) {
    return;
  }

  createAndAppendForm(root);
  isFormMounted = true;
}

/**
 * @param {HTMLElement} el - element to mount the form to
 */
function createAndAppendForm(el) {
  const heading = document.createElement('h2');
  const form = document.createElement('form');
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  const formId = 'set-color-scheme';

  heading.innerText = 'Light or dark mode selection';

  form.setAttribute('name', formId);
  form.setAttribute('id', formId);
  form.setAttribute('action', '.');
  form.addEventListener('submit', function(e) { e.preventDefault(); });

  fieldset.classList.add('flow');

  legend.classList.add('h3');
  legend.innerText = 'Color scheme:';

  fieldset.append(legend, createOptions());
  form.append(fieldset);
  el.append(heading, form);
}

/**
 * @returns {HTMLUListElement}
 */
function createOptions() {
  const initialVal = getColorScheme();
  const options = {
    'system': ['🤖', 'System'],
    'light': ['☀', 'Light'],
    'dark': ['●', 'Dark'],
  };

  const ul = document.createElement('ul');
  ul.role = 'list';

  for (const [val, [iconText, labelText]] of Object.entries(options)) {
    const li = document.createElement('li');
    const input = document.createElement('input')
    const label = document.createElement('label');
    const icon = document.createElement('span');
    const optionId = `color-scheme-${val}`;

    input.setAttribute('type', 'radio');
    input.setAttribute('id', optionId);
    input.setAttribute('name', SETTING_NAME);
    input.setAttribute('value', val);
    if (val === initialVal) {
      input.setAttribute('checked', ''); // resolves to `true` which feels magical
    }
    input.addEventListener('change', function(event) {
      updateColorScheme(event.target.value);
    });

    label.setAttribute('for', optionId);

    icon.classList.add('icon');
    icon.innerText = iconText;
    icon.setAttribute('ariaHidden', 'true'); // ARIA expects a string

    label.append(icon, ' ', labelText);
    li.append(input, label);
    ul.append(li);
  }

  return ul;
}