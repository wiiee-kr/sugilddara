'use strict';

function renderBookmarks() {
  const list = document.querySelector('#bookmarks .destination-list');
  const empty = document.querySelector('.bookmark-empty');
  let message = '아직 북마크한 여행지가 없어요';
  try {
    list.innerHTML = travelCountries.filter(isCountryBookmarked)
      .map(country => destinationRow(country, 'index.html#country/' + country.id + '?from=bookmarks')).join('');
  } catch {
    list.replaceChildren();
    message = '북마크한 여행지를 불러오지 못했어요.';
  }
  list.hidden = !list.childElementCount;
  empty.hidden = !list.hidden;
  empty.querySelector('span').textContent = message;
}

const notices = [
  {
    id: 'welcome', date: '2026-11-26', title: '수길따라에 오신 것을 환영해요',
    heading: '다음 여행에서 가고 싶은 곳을 찾아보세요',
    paragraphs: ['홈에서 나라를 고르면 수길따라 영상에 나온 장소와 여행 코스를 볼 수 있어요.',
      '가고 싶은 나라는 북마크해 두세요. 마이페이지의 ‘북마크한 여행지’에서 다시 볼 수 있어요.']
  },
  {
    id: 'update', date: '2026-11-25', title: '수길따라 미리보기 안내',
    heading: '출발 전에 이렇게 준비해 보세요',
    paragraphs: ['준비물 탭에서 여행 체크리스트를 만들고 짐을 챙길 때마다 표시해 보세요.',
      '인천공항을 이용한다면 항공편 탭에 편명을 입력해 보세요. 출발과 도착에 맞춰 공항 이용 순서를 살펴볼 수 있어요.']
  },
  {
    id: 'community', date: '2026-11-24', title: '함께 만드는 기분 좋은 커뮤니티',
    heading: '여행 경험을 나눠 주세요',
    paragraphs: ['처음 떠나는 분의 질문에 직접 다녀온 경험으로 답해 주세요. 짧은 한마디도 다음 여행자에게 도움이 돼요.',
      '여행 사진을 올릴 때는 여권 번호나 탑승권 바코드가 보이는지 확인해 주세요. 불편한 게시글이나 댓글은 신고할 수 있어요.']
  }
];

const noticeList = document.querySelector('.notice-list');
const noticeDetail = document.querySelector('.notice-detail');
const noticeDate = date => `<time datetime="${date}">${date.replaceAll('-', '.')}</time>`;
noticeList.innerHTML = notices.map(item => `
  <li><a href="#notices/${item.id}">
    <span><strong>${item.title}</strong>${noticeDate(item.date)}</span>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
  </a></li>`).join('');

function renderNotices(id) {
  noticeList.hidden = Boolean(id);
  noticeDetail.hidden = !id;
  if (!id) return;
  const item = notices.find(notice => notice.id === id);
  noticeDetail.innerHTML = item ? `
    <header><h2>${item.title}</h2>${noticeDate(item.date)}</header>
    <h3>${item.heading}</h3>${item.paragraphs.map(copy => `<p>${copy}</p>`).join('')}
    <p class="example-note">디자인 확인을 위한 예시 공지입니다.</p>` : '<p>공지사항을 찾을 수 없어요.</p>';
}

const dialog = document.querySelector('#settings-dialog');
const confirmButton = dialog.querySelector('#confirm-action');
const cancelButton = dialog.querySelector('#confirm-cancel');
cancelButton.addEventListener('click', () => dialog.close());

function showDialog(title, message, actionLabel, onConfirm) {
  dialog.querySelector('#confirm-title').textContent = title;
  dialog.querySelector('#confirm-copy').textContent = message;
  dialog.dataset.risky = String(Boolean(onConfirm));
  confirmButton.hidden = !onConfirm;
  confirmButton.textContent = actionLabel || '';
  confirmButton.onclick = onConfirm || null;
  cancelButton.textContent = onConfirm ? '취소' : '닫기';
  window.prepareDialogActions(dialog);
  if (!dialog.open) dialog.showModal();
  cancelButton.focus();
}

const preferenceKey = 'sugilddara.notification-settings.v1';
const switches = [...document.querySelectorAll('.notification-toggle input')];
function renderPreferences() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem(preferenceKey)); } catch { /* Use defaults. */ }
  switches.forEach(input => { input.checked = saved?.[input.name] !== false; });
}
document.querySelector('#notifications').addEventListener('change', event => {
  const input = event.target;
  try {
    const preferences = Object.fromEntries(switches.map(item => [item.name, item.checked]));
    localStorage.setItem(preferenceKey, JSON.stringify(preferences));
  } catch {
    input.checked = !input.checked;
    showDialog('알림 설정', '설정을 저장하지 못했어요. 다시 시도해 주세요.');
  }
});
document.querySelector('#notification-help').onclick = () => showDialog('휴대폰 알림 설정 방법',
  '수길따라 앱을 설치한 휴대폰에서 설정을 열고, 앱 목록에서 수길따라를 찾아 알림을 허용해 주세요.');
document.querySelector('#logout').onclick = () => showDialog('로그아웃할까요?',
  '현재는 로그아웃 절차를 미리 볼 수 있어요.', '로그아웃', () => showDialog('로그아웃 미리보기 완료', '실제 계정과 저장된 여행지는 그대로예요.'));
const consent = document.querySelector('#withdraw-consent');
const withdraw = document.querySelector('#withdraw-confirm');
consent.onchange = () => { withdraw.disabled = !consent.checked; };
withdraw.onclick = () => showDialog('정말 탈퇴할까요?', '미리보기에서는 계정과 여행지가 그대로 유지돼요.', '탈퇴 확인', () => {
  history.replaceState(null, '', '#account');
  showSection();
  showDialog('탈퇴 미리보기 완료', '회원탈퇴 절차를 모두 확인했어요.');
});

const sections = [...document.querySelectorAll('main > section')];
function showSection() {
  const [key, id] = (location.hash.slice(1) || 'bookmarks').split('/');
  const current = sections.find(section => section.id === key) || document.querySelector('#settings');
  sections.forEach(section => { section.hidden = section !== current; });
  const title = current.dataset.title;
  document.querySelector('#title').textContent = title;
  document.title = '수길따라 · ' + title;
  let parent = '#settings';
  switch (current.id) {
    case 'bookmarks':
      renderBookmarks();
      parent = 'mypage.html';
      break;
    case 'settings':
      parent = 'mypage.html';
      break;
    case 'notices':
      renderNotices(id);
      if (id) parent = '#notices';
      break;
    case 'notifications':
      renderPreferences();
      break;
    case 'withdraw':
      parent = '#account';
      consent.checked = false;
      withdraw.disabled = true;
      break;
  }
  document.querySelector('.page-bar a').href = parent;
}
window.addEventListener('hashchange', () => {
  if (dialog.open) dialog.close();
  showSection();
  document.querySelector('.settings-page').scrollTop = 0;
  document.querySelector('#title').focus({ preventScroll: true });
});
window.addEventListener('pageshow', showSection);
window.addEventListener('storage', () => {
  if (!document.querySelector('#bookmarks').hidden) renderBookmarks();
  if (!document.querySelector('#notifications').hidden) renderPreferences();
});
showSection();
