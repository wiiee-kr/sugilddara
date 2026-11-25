// Text inputs can match :focus-visible even when tapped.
document.addEventListener('pointerdown', () => {
  document.documentElement.removeAttribute('data-keyboard-focus');
}, true);

document.addEventListener('keydown', event => {
  if (event.key === 'Tab' ||
      (event.key.startsWith('Arrow') && !event.target.closest('textarea, input:not([type="radio"]), [contenteditable="true"]'))) {
    document.documentElement.setAttribute('data-keyboard-focus', '');
  }
}, true);
