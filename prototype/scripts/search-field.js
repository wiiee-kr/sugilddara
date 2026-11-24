document.addEventListener('click', event => {
  const button = event.target.closest('.ds-search-clear');
  if (!button) return;
  const input = button.parentElement.querySelector('input');
  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.focus();
});
