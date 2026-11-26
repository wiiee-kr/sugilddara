/* The sequence and place names follow the visible stops in the November 16 recording. */
const travelCourses = [{
  id: 'ashgabat', countryId: 'tm', series: 'central-asia', thumbnail: 'assets/ashgabat-video.jpg',
  mapArea: 'Ashgabat, Turkmenistan', keywords: ['아시가바트', 'Ashgabat', 'Turkmenistan', '중앙아시아'],
  city: '아쉬가바트',
  country: '투르크메니스탄',
  sourceVideoId: 'wj7rudH_PGs',
  videos: [
    { id: 'wj7rudH_PGs', episode: 1, duration: '56:10', title: '허락 없이 아무 데나 갈 수 없습니다.', thumbnail: 'assets/ashgabat-video.jpg' },
    { id: '2SStfE9mVcM', episode: 2, duration: '42:26', title: '여행하기 가장 어려운 나라! 미녀 통역사 사막여행' },
    { id: 'VqyhmguzqUk', episode: 3, duration: '53:54', title: '자유여행이 불가한 나라! 모든 걸 허가 받아야 한다. 그런데 떠나려니 아쉽다.' }
  ],
  sections: [
    { title: '시장과 기념탑', stops: [
      { id: 'karakum', name: '카라쿰 호텔', local: 'Karakum Hotel', kind: '숙소',
        summary: '첫날의 출발지', sceneSummary: '아쉬가바트 여행은 카라쿰 호텔에서 시작해요. 수길따라님이 숙소를 나서 처음 향한 곳은 굴리스탄 바자르예요.',
        keywords: ['첫날 숙소', '여행 출발지'], tip: '택시를 타거나 숙소로 돌아올 때 보여줄 수 있게 예약 내역의 호텔 이름과 주소를 함께 보관해 두세요.' },
      { id: 'gulistan', name: '굴리스탄 바자르', local: 'Gulistan Bazaar', kind: '시장',
        summary: '꿀과 캐비어, 김치를 맛본 시장', sceneSummary: '수길따라님은 굴리스탄 바자르에서 꿀과 캐비어, 김치를 맛봤어요. 영상에는 시장에서의 환전 이야기도 담겨 있어요.',
        keywords: ['캐비어', '환전', '전통모자'], seconds: 615,
        tip: '시식한 먹거리를 사고 싶다면, 맛본 양과 판매 단위가 다를 수 있으니 가격과 용량을 함께 물어보세요.',
        visitNote: '시장 영업시간과 상품 가격은 방문 전에 확인하세요.' },
      { id: 'carpet', name: '카펫 박물관', local: 'Turkmen Carpet Museum', kind: '박물관',
        summary: '투르크멘 카펫을 만나는 곳', sceneSummary: '시장을 둘러본 수길따라님이 다음으로 들른 곳은 카펫 박물관이에요. 영상에서는 박물관 안에서 촬영이 제한된다고 소개해요.',
        keywords: ['투르크멘 카펫', '내부 촬영'], tip: '사진을 찍기 전에 전시실의 촬영 안내를 확인하세요.' }
    ] },
    { title: '공원과 야경', stops: [
      { id: 'tashkent', name: '타슈켄트 공원', local: 'Tashkent Park', kind: '공원',
        summary: '둘째 날의 첫 방문지', sceneSummary: '수길따라님은 아쉬가바트의 타슈켄트 공원에서 둘째 날 일정을 시작했어요.',
        keywords: ['둘째 날 첫 코스'], tip: '지도에서 공원을 찾을 때 도시 이름 Ashgabat를 함께 확인하세요. 일정에 담긴 곳은 투르크메니스탄에 있어요.' },
      { id: 'ashgabat-park', name: '아시가바트 공원', local: 'Ashgabat Park', kind: '공원',
        summary: '버스로 이동해 들른 공원', sceneSummary: '수길따라님은 버스를 타고 아시가바트 공원으로 이동했어요. 공원을 둘러본 뒤에는 레닌 동상으로 향했어요.',
        keywords: ['버스 이동', '공원 산책'], tip: '다음 방문지인 레닌 동상도 지도에 함께 저장해 두면 이동할 때 찾기 편해요.' },
      { id: 'lenin', name: '레닌 동상', local: 'Lenin Monument', kind: '관광지',
        summary: '공원에 이어 방문한 기념물', sceneSummary: '아시가바트 공원을 둘러본 수길따라님은 이어서 레닌 동상을 찾았어요.',
        keywords: ['레닌 동상', '공원 주변'], tip: '지도에서는 영어 이름 Lenin Monument로 찾을 수 있어요. 앞서 들른 공원과 위치를 함께 살펴보세요.' }
    ] }
  ]
}, ...filmItineraries.map(itinerary => {
  const country = travelCountries.find(entry => entry.id === itinerary.countryId);
  const film = country.films.find(entry => entry.id === itinerary.sourceVideoId);
  return {
    ...itinerary, id: country.id + '-film', byRegion: true,
    series: { '코카서스': 'caucasus', '중앙아시아': 'central-asia', '동남아시아': 'laos' }[country.region],
    city: country.name, country: country.name, keywords: country.aliases,
    thumbnail: 'https://i.ytimg.com/vi/' + film.id + '/mqdefault.jpg',
    videos: [{ ...film, duration: timeLabel(itinerary.durationSeconds) }]
  };
})].map(item => ({
  ...item,
  sourceVideo: item.videos.find(video => video.id === item.sourceVideoId),
  visits: item.sections.flatMap((section, index) => section.stops.map((stop, i) => ({ ...stop, day: index + 1, number: i + 1 })))
}));
const youtubeUrl = video => 'https://www.youtube.com/watch?v=' + video.id;
const iconPaths = {
  search: '<path d="M20 20l-4-4 M18 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0"/>',
  back: '<path d="m14.5 5.5-6.5 6.5 6.5 6.5"/>',
  next: '<path d="m9 5.5 6.5 6.5L9 18.5"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.3"/>',
  days: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18"/>',
  play: '<path d="m8 5 11 7-11 7z"/>',
  video: '<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
  youtube: '<path fill="#ff0033" stroke="none" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 32 32 0 0 0 0 12a32 32 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A32 32 0 0 0 24 12a32 32 0 0 0-.5-5.8Z"/><path fill="white" stroke="none" d="m9.6 15.6 6.2-3.6-6.2-3.6z"/>',
  external: '<path d="M13 4h7v7m0-7L10 14M9 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3"/>',
  tip: '<path d="M9 17h6m-5 3h4M8.4 12.5a6 6 0 1 1 7.2 0c-.8.6-1 1.2-1 2H9.4c0-.8-.2-1.4-1-2Z"/>'
};
const icon = (name) => '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">' + iconPaths[name] + '</svg>';
const main = document.querySelector('#journey');
const bar = document.querySelector('#bar');
const videoSheet = document.querySelector('#trip-videos');
const bookmarkBar = document.querySelector('.country-bookmark-bar');
const bookmarkButton = bookmarkBar.querySelector('button');
const bookmarkToast = bookmarkBar.querySelector('[role="status"]');
let bookmarkToastTimer;
let fromBookmarks = false;
// A search-origin link carries its query through day changes, deep links and reloads.
const homeHash = continent => continent === 'all' ? '#home' : '#home?continent=' + continent;
const searchHash = term => '#search' + originSuffix(term || null);
function originSuffix(query, series, country) {
  const params = new URLSearchParams();
  if (fromBookmarks) params.set('from', 'bookmarks');
  if (selectedContinent !== 'all') params.set('continent', selectedContinent);
  if (series) params.set('series', series.id);
  if (country) params.set('country', country.id);
  if (query != null) params.set('q', query);
  return params.size ? '?' + params : '';
}
const seriesHash = (series, query = null) => '#series/' + series.id + originSuffix(query);
const countryHash = (country, query = null) => '#country/' + country.id + originSuffix(query);
const courseHash = (item, day, query, series, country) => '#course/' + item.id + '/' + day + originSuffix(query, series, country);
function countryItineraryHash(country, item, day, stop) {
  return '#country/' + country.id + '/' + item.id + '/' + day + (stop ? '/' + stop.id : '') + originSuffix(searchOrigin);
}
const routeHash = day => currentCountry ? countryItineraryHash(currentCountry, course, day) :
  courseHash(course, day, searchOrigin, seriesOrigin, countryOrigin);
function placeHash(stop, filter) {
  if (currentCountry) return countryItineraryHash(currentCountry, course, filter, stop);
  const suffix = originSuffix(searchOrigin, seriesOrigin, countryOrigin);
  return (directPlace ? '#visit/' + course.id + '/' + stop.id : '#course/' + course.id + '/' + filter + '/' + stop.id) + suffix;
}
function timeLabel(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  return (hours ? hours + ':' + String(minutes).padStart(2, '0') : minutes) + ':' + String(seconds % 60).padStart(2, '0');
}
const videoLabel = video => video.episode ? video.episode + '편' : '몰아보기';
const sectionLabel = (item, number) => item.byRegion ? item.sections[number - 1].title : number + '일차';
const external = (url, label, className, glyph) =>
  '<a class="' + className + '" target="_blank" rel="noopener noreferrer" href="' + url + '">' + icon(glyph) + label + '</a>';
let course;
let currentCountry;
let seriesOrigin;
let countryOrigin;
let selectedContinent = 'all';
let lastHomeScroll = { continent: 'all', top: 0 };
let chipScrollAnchor = 0;
let previousCountry;
let searchOrigin = null;
let directPlace = false;
let itineraryPosition;
let returnPlace = '';
let previousView = '';

function header(title, backLink, backLabel, showVideos = false) {
  bar.className = 'app-bar';
  bar.innerHTML = backLink
    ? '<div class="app-bar__leading"><a class="bar-back app-bar__icon" href="' + backLink + '" aria-label="' + backLabel + '">' +
      icon('back') + '</a>' + (title === '검색' ? '<h1>검색</h1>' : '<span class="bar-label">' + title + '</span>') + '</div>'
    : '<h1 class="brand"><img src="assets/sugilddara-logo.png" alt="수길따라"></h1>' +
      '<div class="app-bar__actions"><a id="open-course-search" class="app-bar__icon" href="' + searchHash(null) + '" aria-label="여행 검색">' +
      icon('search') + '</a></div>';
  if (showVideos && course.videos.length) {
    bar.insertAdjacentHTML('beforeend', '<div class="app-bar__actions"><button type="button" id="open-trip-videos" class="app-bar__icon" ' +
      'aria-label="이 여행의 유튜브 영상 보기" aria-haspopup="dialog" aria-controls="trip-videos">' + icon('youtube') + '</button></div>');
  }
  document.title = title + ' · 수길따라';
}

function openVideoSheet() {
  videoSheet.querySelector('h2').textContent = course.country + ' 여행 영상';
  videoSheet.querySelector('.video-list').innerHTML = course.videos.map(video => {
    const thumbnail = video.thumbnail || 'https://i.ytimg.com/vi/' + video.id + '/mqdefault.jpg';
    return '<li><a class="video-list__row" href="' + youtubeUrl(video) + '">' +
      '<span class="video-list__thumbnail" style="background-image:url(\'' + thumbnail + '\')">' +
      '<small>' + video.duration + '</small></span><span class="video-list__info"><small>' + videoLabel(video) +
      '</small><strong>' + video.title + '</strong></span>' + icon('external') + '</a></li>';
  }).join('');
  videoSheet.showModal();
}

bar.addEventListener('click', event => {
  if (event.target.closest('#open-trip-videos')) openVideoSheet();
});
videoSheet.addEventListener('click', event => {
  if (event.target === videoSheet) videoSheet.close();
});

function courseFacts(videoCount = course.videos.length) {
  const dayCount = course && !course.byRegion ? '<span>' + icon('days') + course.sections.length + '일 일정</span>' : '';
  const itinerary = course ? dayCount + '<span>' + icon('pin') + (course.byRegion ? '여행 장면 ' + course.visits.length + '개' : '장소 ' + course.visits.length + '곳') + '</span>' : '';
  return '<div class="facts">' + itinerary + '<span>' + icon('video') + '영상 ' + videoCount + '편</span></div>';
}

function coverArt(series) {
  return '<span class="series-art ds-example-image"><img src="' + series.cover + '" alt="">' +
    '<span class="ds-example-image__credit">AI생성 예시이미지</span></span>';
}

function filmRow(film) {
  return '<li><a class="film-row" href="' + youtubeUrl(film) + '" target="_blank" rel="noopener noreferrer">' +
    '<span class="film-play">' + icon('play') + '</span><span class="film-text"><strong>' + film.title +
    '</strong>' + (film.places ? '<span>' + film.places + '</span>' : '') + '</span>' + icon('external') + '</a></li>';
}

function home() {
  header('홈');
  const continents = Object.keys(continentNames).filter(id => countriesByContinent[id]?.length);
  const filters = ['all', ...continents].map(id => {
    const count = id === 'all' ? travelCountries.length : countriesByContinent[id].length;
    return '<a href="' + homeHash(id) + '"' + (id === selectedContinent ? ' aria-current="page"' : '') + '>' +
      (continentNames[id] || '전체') + ' <span>' + count + '</span></a>';
  }).join('');
  const countries = (selectedContinent === 'all' ? continents : [selectedContinent]).flatMap(id =>
    travelCountries.filter(country => country.continent === id));
  main.innerHTML = '<div class="home-content"><h2 class="destination-title">수길따라 여행따라 ✈️</h2>' +
    '<nav class="continent-chips" aria-label="대륙 선택">' + filters + '</nav>' +
    '<ul class="destination-list">' + countries.map(country => destinationRow(country, countryHash(country))).join('') + '</ul></div>';
  const chips = main.querySelector('.continent-chips');
  const selected = chips.querySelector('[aria-current]');
  chips.scrollLeft = Math.max(0, selected.offsetLeft + selected.offsetWidth + 16 - chips.clientWidth);
}

main.addEventListener('scroll', () => {
  if (previousView !== 'home') return;
  const top = Math.max(0, Math.min(main.scrollTop, main.scrollHeight - main.clientHeight));
  const delta = top - chipScrollAnchor;
  if (top > 0 && Math.abs(delta) < 6) return;
  chipScrollAnchor = top;
  const chips = main.querySelector('.continent-chips');
  if (top === 0 || delta < 0) {
    chips.style.removeProperty('--chips-top');
  } else if (!chips.style.getPropertyValue('--chips-top')) {
    chips.style.setProperty('--chips-top', -chips.offsetHeight + 'px');
  }
}, { passive: true });

function countryVideos(country, films) {
  if (!films.length) return '';
  const cards = films.map(film => {
    const thumb = film.thumbnail || 'https://i.ytimg.com/vi/' + film.id + '/mqdefault.jpg';
    const caption = '수길따라 · ' + country.name + (film.episode ? ' ' + film.episode + '편' : '');
    return '<li><a class="country-video" href="' + youtubeUrl(film) + '" target="_blank" rel="noopener noreferrer">' +
      '<span class="video-thumb"><img src="' + thumb + '" alt="">' + icon('play') + '</span>' +
      '<span class="country-video__text"><strong>' + film.title + '</strong><small>' + caption + '</small></span></a></li>';
  }).join('');
  return '<section class="country-videos"><h2>이 여행이 담긴 영상</h2><ul>' + cards + '</ul></section>';
}

function countryDetail(country, courses, filter) {
  if (fromBookmarks) {
    header('여행지', 'my-settings.html#bookmarks', '북마크한 여행지로 돌아가기');
  } else {
    const parent = searchOrigin === null ? homeHash(selectedContinent) : searchHash(searchOrigin);
    header('여행지', parent, searchOrigin === null ? '여행지 목록으로 돌아가기' : '검색 결과로 돌아가기');
  }
  const itineraryFilms = course?.videos || [];
  const films = itineraryFilms.concat(country.films.filter(film => !itineraryFilms.some(video => video.id === film.id)));
  const itineraries = courses.length > 1 ? '<nav class="itinerary-picker" aria-label="여행 일정 선택">' +
    courses.map(item => '<a href="' + countryItineraryHash(country, item, 'all') + '"' +
      (item === course ? ' aria-current="page"' : '') + '>' + item.city + ' 여행</a>').join('') + '</nav>' : '';
  const places = country.places ? '<section class="country-places"><h2>방문 지역</h2><p>' + country.places + '</p></section>' : '';
  const previousScroll = main.querySelector('.day-chips')?.scrollLeft || 0;
  const previousVideoScroll = main.querySelector('.country-videos ul')?.scrollLeft || 0;
  main.innerHTML = '<article class="country-detail"><p class="country-region">' + continentNames[country.continent] +
    ' · ' + country.region + '</p><h1>' + countryFlag(country) + ' ' + country.name + '</h1>' + itineraries +
    courseFacts(films.length) + (course?.intro ? '<p class="trip-intro">' + course.intro + '</p>' : '') +
    (course ? dayChips(filter) : '') + countryVideos(country, films) +
    (course ? itineraryDays(filter) + travelNotes(course.notes) : places) + '</article>';
  if (course) positionDayChips(previousScroll);
  const videoList = main.querySelector('.country-videos ul');
  if (videoList) videoList.scrollLeft = previousVideoScroll;
}

function courseRow(item, href) {
  return '<li><a class="search-course" href="' + href + '"><img src="' + item.thumbnail +
    '" alt=""><span><strong>' + item.city + ' 여행</strong><small>' + item.country + ' · ' +
    (item.byRegion ? '여행 장면 ' + item.visits.length + '개' : item.sections.length + '일 · 장소 ' + item.visits.length + '곳') +
    '</small></span>' + icon('next') + '</a></li>';
}

function seriesDetail(series) {
  header('여행 시리즈', searchOrigin === null ? '#home' : searchHash(searchOrigin),
    searchOrigin === null ? '홈으로 돌아가기' : '검색 결과로 돌아가기');
  const courses = travelCourses.filter(item => item.series === series.id);
  main.innerHTML = '<article class="series-detail">' + coverArt(series) + '<h1>' + series.name +
    '</h1><p class="series-cities">' + icon('pin') + series.cities.join(' · ') + '</p>' +
    (courses.length ? '<section class="search-section"><h2>여행 코스</h2><ul class="search-list">' +
      courses.map(item => courseRow(item, courseHash(item, item.byRegion ? 'all' : 1, searchOrigin, series))).join('') + '</ul></section>' : '') +
    (series.films.length ? '<section class="collection-section"><h2>여행 영상</h2><ul class="film-list">' +
      series.films.map(filmRow).join('') + '</ul></section>' : '') + '</article>';
}

function searchSection(title, rows) {
  return rows.length ? '<section class="search-section"><h2>' + title + '</h2><ul class="search-list">' + rows.join('') + '</ul></section>' : '';
}

function searchResults(value) {
  const words = value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return '<div class="search-intro"><img class="travel-empty-image" src="assets/empty-travel-plane.png" width="120" height="92" alt=""><p>찾고 싶은 여행지나 장소 이름을 입력해 보세요.</p></div>';
  const matches = text => words.every(word => text.toLowerCase().replace(/\s/g, '').includes(word));
  const params = originSuffix(value);
  const regionAliases = { '코카서스': '코카서스 3국 캅카스 서아시아 Caucasus', '중앙아시아': 'Central Asia' };
  const destinations = travelCountries.filter(country => matches([
    country.name, country.region, country.places, continentNames[country.continent],
    regionAliases[country.region] || '', ...country.aliases
  ].join(' ')));
  const countryRows = (destinations.length ? destinations : travelCountries.filter(country =>
    country.films.some(film => matches([film.title, film.places || ''].join(' '))))
  ).map(country => destinationRow(country, countryHash(country, value)));
  const placeRows = [];
  for (const item of travelCourses) {
    const destination = [item.country, item.city, ...item.keywords].join(' ');
    for (const stop of item.visits.filter(s => matches([destination, sectionLabel(item, s.day), s.name, s.local].join(' ')))) {
      placeRows.push('<li><a class="search-place" href="#visit/' + item.id + '/' + stop.id + params + '"><strong>' + stop.name +
        '</strong><small>' + item.city + ' 여행 · ' + sectionLabel(item, stop.day) + (stop.kind ? ' · ' + stop.kind : '') + '</small></a></li>');
    }
  }
  if (!countryRows.length && !placeRows.length) return '<p class="search-missing">검색 결과가 없어요.</p>';
  const countries = countryRows.length ? '<section class="search-section"><h2>여행지</h2><ul class="destination-list">' + countryRows.join('') + '</ul></section>' : '';
  return countries + searchSection('방문 장소', placeRows);
}

function searchPage(value) {
  header('검색', homeHash(selectedContinent), '홈으로 돌아가기');
  main.innerHTML = '<div class="journey-search"><form role="search"><div class="ds-search-field">' +
    '<input type="search" aria-label="여행지와 방문 장소 검색" placeholder="어떤 여행지나 장소를 찾고 있나요?" autocomplete="off" enterkeyhint="search">' +
    '<button class="ds-search-clear" aria-label="검색어 지우기" type="button"></button></div></form>' +
    '<div id="journey-results" aria-live="polite"></div></div>';
  const input = main.querySelector('input');
  const results = main.querySelector('#journey-results');
  input.value = value;
  results.innerHTML = searchResults(value);
  input.addEventListener('input', () => {
    results.innerHTML = searchResults(input.value);
    try { history.replaceState(history.state, '', searchHash(input.value)); }
    catch { /* Sandboxed previews may restrict updating the current URL. */ }
  });
  main.querySelector('form').addEventListener('submit', e => { e.preventDefault(); input.blur(); });
}

function placeMapQuery(stop) {
  if (stop.mapName) return stop.mapName;
  if (stop.local) return stop.local + ', ' + (course.mapArea || course.country);
  return stop.coords?.join(',') || '';
}

function regionMapQuery(day, stop) {
  const section = course.sections[day - 1];
  return stop?.mapArea || section.mapArea || course.mapArea || section.title + ', ' + course.country;
}

function googleSearchUrl(query) {
  return 'https://www.google.com/maps/search/?' + new URLSearchParams({ api: '1', query });
}

// Mobile Google Maps links support three intermediate stops. Adjacent links share an endpoint.
function routeLinks(stops) {
  const links = [];
  for (let i = 0; i < stops.length - 1; i += 4) {
    const leg = stops.slice(i, i + 5);
    const params = new URLSearchParams({
      api: '1', origin: placeMapQuery(leg[0]), destination: placeMapQuery(leg.at(-1)), travelmode: 'driving'
    });
    if (leg.length > 2) params.set('waypoints', leg.slice(1, -1).map(placeMapQuery).join('|'));
    const label = stops.length <= 5 ? '구글 지도에서 경로 보기' : leg[0].number + '번~' + leg.at(-1).number + '번 경로 보기';
    links.push(external('https://www.google.com/maps/dir/?' + params, label, 'map-link', 'external'));
  }
  return links.join('');
}

function journeyMap(day, selected) {
  const stops = selected ? [selected] : course.visits.filter(stop => stop.day === day);
  const located = stops.filter(placeMapQuery);
  const label = selected?.name || sectionLabel(course, day);
  const params = new URLSearchParams({ hl: 'ko', output: 'embed' });
  let caption;
  let links = '';
  if (located.length > 1) {
    params.set('saddr', placeMapQuery(located[0]));
    params.set('daddr', located.slice(1).map(placeMapQuery).join(' to:'));
    params.set('dirflg', 'd');
    caption = '구글 지도의 추천 차량 경로예요.';
    links = routeLinks(located);
  } else {
    const query = located.length ? placeMapQuery(located[0]) : regionMapQuery(day, selected);
    params.set('q', query);
    if (located[0]?.coords) params.set('ll', located[0].coords.join(','));
    params.set('z', located.length ? '15' : '11');
    caption = located.length ? (selected ? '' : located[0].name) : '촬영 위치 기록이 없어 주변 지역을 표시해요.';
    if (!selected) links = external(googleSearchUrl(query), '구글 지도에서 열기', 'map-link', 'external');
  }
  if (!selected && located.length && located.length < stops.length) {
    caption += ' 전체 ' + stops.length + '곳 중 위치를 찾을 수 있는 ' + located.length + '곳을 표시해요.';
  }
  const footer = (caption ? '<p>' + caption + '</p>' : '') + links;
  return '<figure class="journey-map"><iframe title="' + label + ' 구글 지도" src="https://maps.google.com/maps?' +
    params.toString().replace(/&/g, '&amp;') + '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>' +
    (footer ? '<figcaption>' + footer + '</figcaption>' : '') + '</figure>';
}
function stopRow(s, filter) {
  return '<li><a class="stop-row" id="row-' + s.id + '" href="' + placeHash(s, filter) +
    '"><span class="stop-number">' + s.number + '</span><span class="stop-text"><strong>' + s.name + '</strong><span>' + (s.summary || '영상 ' + timeLabel(s.seconds)) + (placeMapQuery(s) ? '' : ' · 촬영 위치 미확인') +
    '</span></span>' + icon('next') + '</a></li>';
}
function dayChips(filter) {
  if (course.byRegion && course.sections.length === 1) return '';
  const days = course.sections.map((_, index) => String(index + 1));
  return '<nav class="day-chips" aria-label="' + (course.byRegion ? '방문 지역 선택' : '여행 일차 선택') + '">' +
    ['all', ...days].map(day => '<a href="' + routeHash(day) + '"' +
      (filter === day ? ' aria-current="page"' : '') + '>' +
      (day === 'all' ? '전체' : sectionLabel(course, day)) + '</a>').join('') + '</nav>';
}
function itineraryDays(filter) {
  return course.sections.map((day, index) => {
    const number = index + 1;
    if (filter !== 'all' && Number(filter) !== number) return '';
    const stops = course.visits.filter(stop => stop.day === number);
    const tag = course.byRegion ? '' : '<span class="day-tag">' + number + '일차</span>';
    return '<section class="day-section"><div class="day-heading">' + tag + '<h2>' + day.title + '</h2></div>' + journeyMap(number) +
      '<ol class="stops">' + stops.map(stop => stopRow(stop, filter)).join('') + '</ol></section>';
  }).join('');
}
function positionDayChips(previousScroll) {
  const chips = main.querySelector('.day-chips');
  if (!chips) return;
  const selected = chips.querySelector('[aria-current]');
  const left = selected.offsetLeft;
  const right = left + selected.offsetWidth;
  chips.scrollLeft = Math.max(right - chips.clientWidth + 4, Math.min(previousScroll, left - 4));
}
function travelNotes(notes, expanded = false) {
  if (!notes?.length) return '';
  const entries = notes.map(note => '<li><p>' + note.text + '</p><a target="_blank" rel="noopener noreferrer" href="' +
    youtubeUrl(course.sourceVideo) + '&amp;t=' + note.seconds + 's">' + icon('video') + note.kind + ' · ' + timeLabel(note.seconds) + '</a></li>').join('');
  const title = '촬영 당시 여행 메모';
  return expanded ? '<section class="travel-notes"><h2>' + title + '</h2><ul>' + entries + '</ul></section>' :
    '<details class="travel-notes"><summary>' + title + ' ' + notes.length + '개</summary><ul>' + entries + '</ul></details>';
}
function courseDetail(filter) {
  let parent = searchOrigin === null ? homeHash(selectedContinent) : searchHash(searchOrigin);
  let backLabel = searchOrigin === null ? '홈으로 돌아가기' : '검색 결과로 돌아가기';
  if (countryOrigin) {
    parent = countryHash(countryOrigin, searchOrigin);
    backLabel = countryOrigin.name + ' 여행지로 돌아가기';
  } else if (seriesOrigin) {
    parent = seriesHash(seriesOrigin, searchOrigin);
    backLabel = seriesOrigin.name + ' 시리즈로 돌아가기';
  }
  header('여행 코스', parent, backLabel, true);
  const previousScroll = main.querySelector('.day-chips')?.scrollLeft || 0;
  main.innerHTML = '<div class="detail-content"><div class="course-intro"><p class="overline">' + course.country +
    '</p><h1>' + course.city + ' 여행</h1>' + courseFacts() + (course.intro ? '<p class="trip-intro">' + course.intro + '</p>' : '') +
    '</div>' + dayChips(filter) + itineraryDays(filter) + travelNotes(course.notes) +
    '<section class="source-film"><h2>이 코스가 나온 영상</h2><a href="' + youtubeUrl(course.sourceVideo) + '" target="_blank" rel="noopener noreferrer">' +
    '<span class="video-thumb"><img src="' + course.thumbnail + '" alt="">' + icon('play') + '</span><span><strong>' +
    course.sourceVideo.title + '</strong><small>수길따라 · ' + course.country + ' ' + videoLabel(course.sourceVideo) + '</small></span>' + icon('external') + '</a></section></div>';

  positionDayChips(previousScroll);
}
function placeDetail(s, filter) {
  const backLabel = directPlace ? '검색 결과로 돌아가기' : currentCountry ? currentCountry.name + ' 여행지로 돌아가기' : '여행 코스로 돌아가기';
  header('장소 정보', directPlace ? searchHash(searchOrigin) : routeHash(filter), backLabel);
  const mapQuery = placeMapQuery(s);
  const mapUrl = googleSearchUrl(mapQuery || regionMapQuery(s.day, s));
  const video = s.videoId ? course.videos.find(item => item.id === s.videoId) : course.sourceVideo;
  const hasScene = video && Number.isInteger(s.seconds) && s.seconds >= 0;
  const videoUrl = youtubeUrl(video || course.sourceVideo) + (hasScene ? '&amp;t=' + s.seconds + 's' : '');
  const sceneLink = hasScene ? '<div class="place-scene"><dt>' + icon('video') + '영상 속 장면</dt><dd>' +
    '<a href="' + videoUrl + '" target="_blank" rel="noopener noreferrer">' + videoLabel(video) + ' · ' +
    timeLabel(s.seconds) + icon('external') + '</a></dd></div>' : '';
  const keywords = s.keywords?.length ? '<ul class="place-keywords" aria-label="여행 키워드">' +
    s.keywords.map(word => '<li>' + word + '</li>').join('') + '</ul>' : '';
  const story = s.sceneSummary || s.summary;
  main.innerHTML = '<article class="detail-content place-detail">' + journeyMap(s.day, s) +
    '<div class="place-intro"><p class="place-meta">' + sectionLabel(course, s.day) + ' · ' + s.number + (course.byRegion ? '번째 장면' : '번째 방문지') + '</p>' +
    '<div class="place-title"><h1>' + s.name + '</h1>' + (s.kind ? '<span>' + s.kind + '</span>' : '') + '</div></div>' +
    (story ? '<section class="place-story"><h2>영상 속 수길따라님의 여행</h2><p>' + story + '</p>' + keywords + '</section>' : '') +
    '<dl class="place-facts">' + (s.local ? '<div><dt>' + icon('pin') + '장소명</dt><dd>' + s.local + '</dd></div>' : '') +
    sceneLink + '</dl>' +
    (s.tip ? '<section class="tip-box"><h2>' + icon('tip') + '여행 팁</h2><p>' + s.tip + '</p></section>' : '') +
    (s.visitNote ? '<p class="place-note">' + s.visitNote + '</p>' : '') +
    travelNotes(course.notes?.filter(note => note.stopId === s.id), true) +
    '<div class="place-actions">' + external(mapUrl, mapQuery ? '구글 지도에서 위치 보기' : '주변 지도 보기', 'action secondary', 'pin') +
    external(videoUrl, hasScene ? '영상 속 장면 보기' : '관련 영상 보기', 'action primary', 'play') + '</div></article>';
}
bookmarkButton.addEventListener('click', () => {
  try {
    localStorage.setItem(countryBookmarkKey(currentCountry), '1');
    bookmarkButton.classList.add('is-saved');
    bookmarkToast.textContent = '마이페이지에 저장해둘게요!';
  } catch {
    bookmarkToast.textContent = '북마크를 저장하지 못했어요. 다시 시도해 주세요.';
  }
  clearTimeout(bookmarkToastTimer);
  bookmarkToastTimer = setTimeout(() => { bookmarkToast.textContent = ''; }, 3000);
});

function render() {
  if (videoSheet.open) videoSheet.close();
  const hash = location.hash;
  const aliases = { '#flights': 'flights.html', '#my': 'mypage.html', '#packing': 'packing.html', '#community': 'community.html#/' };
  if (aliases[hash]) { location.replace(aliases[hash]); return; }
  const split = hash.indexOf('?');
  const path = split < 0 ? hash : hash.slice(0, split);
  const params = new URLSearchParams(split < 0 ? '' : hash.slice(split + 1));
  const query = params.get('q');
  const continent = params.get('continent');
  const oldContinent = selectedContinent;
  selectedContinent = Object.hasOwn(countriesByContinent, continent) && countriesByContinent[continent].length ? continent : 'all';
  const countryRoute = /^#country\/([a-z]{2})(\/.*)?$/.exec(path);
  const country = countryRoute && travelCountries.find(item => item.id === countryRoute[1]);
  currentCountry = country;
  fromBookmarks = Boolean(country && params.get('from') === 'bookmarks');
  const countryCourses = country ? travelCourses.filter(item => item.countryId === country.id) : [];
  const series = travelSeries.find(item => path === '#series/' + item.id);
  const coursePath = country ? countryRoute[2] : path.startsWith('#course/') && path.slice('#course'.length);
  const match = /^\/([a-z-]+)\/(all|[1-9]\d*)(?:\/([a-z0-9-]+))?$/.exec(coursePath || '');
  const visit = /^#visit\/(?:([a-z-]+)\/)?([a-z0-9-]+)$/.exec(path);
  const matchedCourse = match && (country ? countryCourses : travelCourses).find(item =>
    item.id === match[1] && (match[2] === 'all' || Number(match[2]) <= item.sections.length));
  const filter = matchedCourse ? match[2] : 'all';
  course = matchedCourse || countryCourses[0] || (visit && travelCourses.find(item =>
    visit[1] ? item.id === visit[1] : item.visits.some(stop => stop.id === visit[2])));
  const stopId = visit?.[2] || (matchedCourse && match[3]);
  const stop = stopId && course?.visits.find(p => p.id === stopId && (filter === 'all' || String(p.day) === filter));
  const view = stop ? 'place' : country ? 'country' : matchedCourse ? 'course' : series ? 'series' : path === '#search' ? 'search' : 'home';
  directPlace = Boolean(visit && stop);
  searchOrigin = country || series || course ? query : null;
  countryOrigin = course && travelCountries.find(item => item.id === params.get('country') && item.id === course.countryId);
  if (previousView === 'home' && view !== 'home') lastHomeScroll = { continent: oldContinent, top: main.scrollTop };
  seriesOrigin = course && travelSeries.find(item => item.id === params.get('series') && item.id === course.series);
  document.querySelector('.app-nav').hidden = view !== 'home';
  bookmarkBar.hidden = view !== 'country';
  clearTimeout(bookmarkToastTimer);
  bookmarkToast.textContent = '';
  if (view === 'country') {
    try {
      bookmarkButton.classList.toggle('is-saved', isCountryBookmarked(country));
    } catch {
      bookmarkButton.classList.remove('is-saved');
    }
  }
  const returning = previousView === 'place' && course && (view === 'country' || view === 'course') && returnPlace;
  if (stop && (previousView === 'country' || previousView === 'course')) {
    const link = document.activeElement?.closest('.stop-row');
    itineraryPosition = { hash: routeHash(filter), top: main.scrollTop, linkId: link?.id || 'row-' + stop.id };
  }
  if (stop) {
    returnPlace = stop.id;
    placeDetail(stop, directPlace ? String(stop.day) : filter);
  } else if (view === 'course') {
    courseDetail(filter);
  } else if (country) {
    countryDetail(country, countryCourses, filter);
  } else if (series) {
    seriesDetail(series);
  } else if (view === 'search') {
    searchPage(query || '');
  } else {
    returnPlace = '';
    home();
  }
  main.scrollTop = view === 'home' && previousView !== 'home' && lastHomeScroll.continent === selectedContinent ? lastHomeScroll.top : 0;
  if (view === 'home') chipScrollAnchor = main.scrollTop;
  if (view === 'search' && document.documentElement.hasAttribute('data-keyboard-focus')) {
    main.querySelector('input').focus({ preventScroll: true });
  } else if (view === 'home' && previousView === 'search') {
    document.querySelector('#open-course-search').focus({ preventScroll: true });
  } else if (view === 'home' && previousView === 'country') {
    document.getElementById('country-' + previousCountry)?.focus({ preventScroll: true });
  } else if (view === 'home' && previousView === 'home') {
    main.querySelector('.continent-chips [aria-current]')?.focus({ preventScroll: true });
  } else if (returning) {
    if (itineraryPosition?.hash === routeHash(filter)) {
      main.scrollTop = itineraryPosition.top;
      document.getElementById(itineraryPosition.linkId)?.focus({ preventScroll: true });
    } else {
      const row = document.getElementById('row-' + returnPlace);
      row?.focus({ preventScroll: true });
      row?.scrollIntoView({ block: 'nearest' });
    }
    itineraryPosition = null;
  } else if ((view === 'course' || view === 'country') && previousView === view) {
    main.querySelector('.day-chips [aria-current]')?.focus({ preventScroll: true });
  } else if (previousView) {
    main.focus({ preventScroll: true });
  }
  previousCountry = country?.id;
  previousView = view;
}
// A day switch changes the filter within the same screen. Back should skip past filter changes.
main.addEventListener('click', e => {
  const dayLink = e.target.closest('.day-chips a');
  if (dayLink && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    returnPlace = '';
    try {
      history.replaceState(history.state, '', dayLink.hash);
      render();
    } catch {
      location.hash = dayLink.hash;
    }
  }
});
window.addEventListener('hashchange', render);
render();
