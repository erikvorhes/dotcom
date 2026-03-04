// import onLoad from './onLoad.js';
function backButton() {
  const button = document.getElementById('back-button');
  if (!button) {
    return;
  }

  const buttonLabel = document.querySelector(`#${button.getAttribute('aria-labelledby')}`);
  if (buttonLabel) {
    buttonLabel.innerHTML = 'Go back';
  }

  button.addEventListener('click', function(event) {
    event.preventDefault();

    if (document.referrer && new URL(document.referrer).hostname === location.hostname) {
      history.back();
    } else {
      location.href = '/';
    }
  });
}

onLoad(backButton);
