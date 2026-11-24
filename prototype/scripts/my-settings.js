function showSection() {
  const settings = location.hash === '#settings';
  const title = settings ? '설정' : '북마크';
  document.title = '수길따라 · ' + title;
  document.querySelector('#title').textContent = title;
  document.querySelector('#settings').hidden = !settings;
  document.querySelector('#bookmarks').hidden = settings;
  const selected = location.hash === '#bookmarks/courses' ? '여행 루트' : '여행지';
  for (const tab of document.querySelectorAll('.activity-tabs a')) {
    if (tab.textContent === selected) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  }
  document.querySelector('.bookmark-empty span').textContent =
    selected === '여행지' ? '아직 북마크한 여행지가 없어요' : '아직 북마크한 여행 루트가 없어요';
}
window.addEventListener('hashchange', showSection);
showSection();
