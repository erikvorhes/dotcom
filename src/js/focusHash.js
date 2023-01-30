// Publicly available at https://gist.github.com/erikvorhes/2ceb77788b9db10c89fd7200440f2de8

/**
 * Focuses an element even if it isn't focusable.
 * @param {HTMLElement} target - element to focus
 */
function focusTarget(target) {
  if (document.activeElement === target) {
    return;
  }

  if (target.tabIndex < 0 && !target.getAttribute('tabIndex')) {
    target.setAttribute('tabIndex', '-1');
  }

  target.focus();
}

function focusHash() {
  const hash = window.location.hash;
  const target = hash ? document.querySelector(hash) : null;

  if (target) {
    focusTarget(target);
  }
}

window.addEventListener('DOMContentLoaded', focusHash);
window.addEventListener('hashchange', focusHash);
