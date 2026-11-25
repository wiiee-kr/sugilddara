(() => {
  const screen = document.createElement('dialog');
  screen.className = 'network-screen';
  screen.setAttribute('aria-labelledby', 'network-title');
  screen.setAttribute('aria-describedby', 'network-description');
  screen.innerHTML = `
    <div class="network-screen__bar">
      <button type="button" class="network-screen__back" aria-label="뒤로가기">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 4-8 8 8 8"/></svg>
      </button>
      <span>네트워크 오류</span>
    </div>
    <img class="network-screen__icon" src="assets/network-error.png" width="120" height="100" alt="">
    <h2 id="network-title">네트워크에 접속할 수 없어요</h2>
    <p id="network-description" role="status">잠시 후 다시 시도해주세요.</p>
    <button type="button" class="network-screen__retry" autofocus>재시도</button>`;
  document.body.append(screen);

  const description = screen.querySelector('#network-description');
  const initialMessage = description.textContent;
  const isPreview = () => location.hash === '#/network-error';

  function show() {
    if (screen.open) return;
    description.textContent = initialMessage;
    screen.showModal();
  }

  function dismiss() {
    if (isPreview()) history.replaceState(history.state, '', '#/');
    if (screen.open) screen.close();
  }

  function sync() {
    if (!navigator.onLine || isPreview()) show();
    else if (screen.open) screen.close();
  }

  screen.querySelector('.network-screen__retry').addEventListener('click', () => {
    if (navigator.onLine) dismiss();
    else description.textContent = '인터넷 연결을 확인한 뒤 다시 시도해주세요.';
  });
  screen.querySelector('.network-screen__back').addEventListener('click', dismiss);
  screen.addEventListener('cancel', event => {
    event.preventDefault();
    dismiss();
  });

  window.addEventListener('offline', show);
  window.addEventListener('online', dismiss);
  window.addEventListener('pageshow', sync);
  window.addEventListener('hashchange', sync);
  sync();
})();
