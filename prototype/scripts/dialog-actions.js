/* Three or more visible actions use a text-only cancel button. */
window.prepareDialogCancel = function(dialog) {
  const buttons = [...dialog.querySelectorAll('button')].filter(b => !b.closest('[hidden]') && !b.classList.contains('sheet-close'));
  dialog.querySelectorAll('.popup-cancel-text').forEach(b => b.classList.remove('popup-cancel-text'));
  if (buttons.length < 3) return;
  buttons.forEach(b => {
    if (b.matches('.cancel,[data-close],#confirm-cancel,[data-action="cancel"],[data-action="close"]') || b.textContent.trim() === '취소') {
      b.classList.add('popup-cancel-text');
    }
  });
};
/* Shared popup actions. Called after content is built and before showModal. */
window.prepareDialogActions = function(dialog) {
  window.prepareDialogCancel(dialog);
  if (dialog.id === 'profile-dialog') {
    dialog.querySelector('.save-button')?.classList.add('popup-primary');
    dialog.querySelector('.photo-edit')?.classList.remove('popup-primary', 'popup-tertiary');
    return;
  }
  const buttons = [...dialog.querySelectorAll('button')].filter(b => !b.hidden && !b.classList.contains('sheet-close'));
  if (!buttons.length) return;
  // Menu options are flat rows, not confirmation CTAs.
  if (buttons.every(b => b.classList.contains('menu-action'))) return;
  const risky = dialog.dataset.risky === 'true';
  const caution = new Set(['delete','delete-confirm','block','block-confirm','report']);
  for (const b of buttons) {
    const action = b.dataset.action || b.dataset.menu;
    const cancel = b.matches('.cancel,[data-close],#confirm-cancel') || action === 'close';
    const danger = caution.has(action) || b.classList.contains('danger') || (risky && !cancel);
    const preferred = !danger && (!cancel || risky || b.classList.contains('primary') || buttons.length === 1);
    b.classList.remove('popup-primary','popup-tertiary');
    b.classList.add(preferred ? 'popup-primary' : 'popup-tertiary');
    // Preserve submit ownership when actions move out of their original form.
    if (b.form && b.type === 'submit') {
      if (!b.form.id) b.form.id = dialog.id + '-form';
      b.setAttribute('form', b.form.id);
    }
  }
  const footer = document.createElement('div');
  footer.className = 'popup-actions' + (buttons.length === 2 ? ' popup-actions--pair' : '');
  const ordered = buttons.length >= 3 ? [...buttons].sort((a,b) => Number(b.classList.contains('popup-primary')) - Number(a.classList.contains('popup-primary'))) : buttons;
  ordered.forEach(b => footer.append(b));
  dialog.querySelectorAll('button[hidden]').forEach(b => footer.append(b));
  dialog.querySelectorAll('.popup-actions,.actions,.stack').forEach(el => { if (!el.children.length) el.remove(); });
  dialog.append(footer);
};
