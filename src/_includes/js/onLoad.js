/**
 * @param {() => void} callback 
 */
function onLoad(callback) {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}
