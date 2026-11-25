function showSection() {
  const settings = location.hash === '#settings';
  const title = settings ? '설정' : '북마크한 여행지';
  document.title = '수길따라 · ' + title;
  document.querySelector('#title').textContent = title;
  document.querySelector('#settings').hidden = !settings;
  document.querySelector('#bookmarks').hidden = settings;
  if (settings) return;
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
window.addEventListener('hashchange', showSection);
window.addEventListener('pageshow', showSection);
window.addEventListener('storage', showSection);
