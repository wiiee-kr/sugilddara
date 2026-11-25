// Each video ID opens a public travel film from 수길따라 (UCxQ6xsoXqeVqrDvm71rByQQ).
// Country films are curated newest first from the channel's Videos tab. The first film supplies the home thumbnail.
// A film covering two destinations may appear under both. Cities are examples, not an itinerary.
const continentNames = {
  asia: '아시아', europe: '유럽', africa: '아프리카',
  'north-america': '북아메리카', 'south-america': '남아메리카', oceania: '오세아니아'
};
const countryFilm = (id, title) => ({ id, title });
const officialSeries = Object.fromEntries(travelSeries.map(series => [series.id, series]));
const balkansOne = countryFilm('lYAf8QaIGQw', '발칸반도 여행 1편 · 세르비아와 코소보');
const balkansTwo = countryFilm('jOVQcTto_C4', '발칸반도 여행 2편 · 북마케도니아와 알바니아');
const uzbekistanTajikistan = countryFilm('dgwFC36E9eQ', '우즈베키스탄과 타지키스탄 여행 몰아보기');
const montenegroBosnia = countryFilm('zrtbukIxUeE', '몬테네그로와 보스니아 헤르체고비나 여행');

function destination(id, name, region, places, films, aliases = []) {
  return { id, name, region, places, films, aliases };
}

const countriesByContinent = {
  asia: [
    destination('tw', '대만', '동아시아', '타이베이 · 화롄', [
      countryFilm('m2830fZ78c8', '대만 자유여행 몰아보기'),
      countryFilm('IG1ygTWmjJ8', '대만 동부의 도시, 화롄'),
      countryFilm('77uzl7nQlYI', '타이베이에서 시작하는 대만 자유여행')
    ], ['타이완']),
    destination('kr', '대한민국', '동아시아', '철원', [countryFilm('MN_gzTOzvlE', '국경도시 철원의 가을 여행')], ['한국', '국내']),
    destination('la', '라오스', '동남아시아', '비엔티안 · 루앙프라방 · 팍세', officialSeries.laos.films, officialSeries.laos.keywords),
    destination('mn', '몽골', '동아시아', '울란바토르', [countryFilm('3fX2Iyvb9ro', '몽골 몰아보기 2편 · 초원의 유목 생활'), countryFilm('VhJjJi5exe4', '유목민의 초원에서 울란바토르로')]),
    destination('mm', '미얀마', '동남아시아', '양곤', [countryFilm('m_2Rl5rCfsI', '미얀마 여행 몰아보기')]),
    destination('bd', '방글라데시', '남아시아', '다카', [countryFilm('MdjNVTclBGw', '방글라데시 여행 몰아보기')]),
    destination('vn', '베트남', '동남아시아', '하노이 · 달랏', [
      countryFilm('5o5zkGYdEGs', '베트남 친구와 걷는 하노이'),
      countryFilm('7-Q27IABYhw', '달랏 한 달 살기 숙소')
    ]),
    destination('lk', '스리랑카', '남아시아', '콜롬보 · 캔디', [countryFilm('B7WC5OLGYTw', '스리랑카에서 만난 한국어 열풍')]),
    destination('ae', '아랍에미리트', '서아시아', '두바이', [countryFilm('heQ7RtcTd5Y', '두바이의 미래 도시 풍경')], ['UAE', '중동']),
    destination('am', '아르메니아', '코카서스', '예레반', [countryFilm('owuNJfzrino', '아르메니아 여행 몰아보기'), ...officialSeries.caucasus.films.filter(film => film.countryId === 'am')]),
    destination('az', '아제르바이잔', '코카서스', '바쿠', [countryFilm('6FyklV4o2-8', '아제르바이잔 여행 몰아보기'), ...officialSeries.caucasus.films.filter(film => film.countryId === 'az')]),
    destination('om', '오만', '서아시아', '무스카트 · 니즈와', [countryFilm('ImGMUkyZlLM', '오만 니즈와의 오아시스'), countryFilm('es6Oe6NhHsE', '무스카트에서 만난 사람들')], ['중동']),
    destination('uz', '우즈베키스탄', '중앙아시아', '타슈켄트', [uzbekistanTajikistan, countryFilm('s5_Bl6wzh9c', '한국어로 여행하는 타슈켄트')]),
    destination('in', '인도', '남아시아', '델리 · 뭄바이', [countryFilm('Q7Rdmvg9pzs', '여기로 떠나볼까 · 인도 뭄바이'), countryFilm('rbXa3fc6QF8', '배낭을 메고 델리로')]),
    destination('id', '인도네시아', '동남아시아', '자카르타 · 말랑', [
      countryFilm('gzEeiKUsCB4', '인도네시아 몰아보기 2편 · 수라바야와 발리'),
      countryFilm('77fz-0OuZWk', '다시 머물고 싶은 도시, 말랑'),
      countryFilm('ESl-XQXSikk', '한국어 대회 우승자와 둘러본 자카르타')
    ]),
    destination('jp', '일본', '동아시아', '홋카이도', [countryFilm('e82DAH_57jA', '올여름 가족여행은 시원한 홋카이도에서')]),
    destination('ge', '조지아', '코카서스', '트빌리시 · 카즈베기 · 바투미', officialSeries.caucasus.films.filter(film => film.countryId === 'ge'), ['그루지야']),
    destination('cn', '중국', '동아시아', '칭다오 · 웨이하이 · 옌타이 · 단둥', [countryFilm('XW-AeazkGlY', '중국 산둥성 세 도시 몰아보기'), countryFilm('Co4_1yRxahA', '단둥에서 마주한 압록강 너머의 풍경')]),
    destination('kz', '카자흐스탄', '중앙아시아', '알마티', officialSeries['central-asia'].films, ['Almaty']),
    destination('qa', '카타르', '서아시아', '도하', [countryFilm('uT5jx3VESY8', '도하에서 시작하는 중동 여행')], ['중동']),
    destination('kh', '캄보디아', '동남아시아', '프놈펜 · 시엠립', [countryFilm('YoLZlTaepEE', '캄보디아 6편 · 불개미를 잡아 살아가는 가족'), countryFilm('IpEfAVUx0kc', '프놈펜에서 시작하는 캄보디아 여행')]),
    destination('kg', '키르기스스탄', '중앙아시아', '비슈케크', [
      countryFilm('51hLM5XGDAI', '다시 가고 싶은 키르기스스탄 몰아보기'),
      countryFilm('3XUDspif8ME', '키르기스스탄의 물가와 여행 이야기'), ...officialSeries['central-asia'].films
    ], ['키르기즈스탄', 'Bishkek']),
    destination('tj', '타지키스탄', '중앙아시아', '두샨베', [uzbekistanTajikistan, countryFilm('svu14oFPAU0', '타지키스탄에서 만난 사람들')]),
    destination('th', '태국', '동남아시아', '빠이', [countryFilm('aceZLW9T08c', '따뜻한 태국에서 겨울나기 · 마지막 편'), countryFilm('PqkybkYJDTE', '태국 빠이의 협곡을 걷다')]),
    destination('tm', '투르크메니스탄', '중앙아시아', '아쉬가바트', [countryFilm('VqyhmguzqUk', '투르크메니스탄 여행 3편')], ['아시가바트', 'Ashgabat', 'Turkmenistan']),
    destination('tr', '튀르키예', '서아시아', '이스탄불 · 안탈리아', [countryFilm('YpHRVwoQrDU', '나 홀로 튀르키예 40일 · 마지막 편'), countryFilm('5yb_d_Fd8Js', '튀르키예에서 보낸 40일')], ['터키']),
    destination('ph', '필리핀', '동남아시아', '바기오', [countryFilm('zwYg3VNxsvc', '필리핀 6편 · 빈민가에서 만난 사람들'), countryFilm('lRaiFlzAe4I', '바기오에서 보낸 어학연수 생활')])
  ],
  europe: [
    destination('me', '몬테네그로', '발칸반도', '코토르', [montenegroBosnia]),
    destination('ba', '보스니아 헤르체고비나', '발칸반도', '사라예보 · 모스타르', [montenegroBosnia], ['보스니아', '보시니아']),
    destination('mk', '북마케도니아', '발칸반도', '스코페 · 오흐리드', [balkansTwo]),
    destination('rs', '세르비아', '발칸반도', '베오그라드 · 노비사드', [balkansOne, countryFilm('lBlGOvkDkqs', '세르비아에서 시작하는 발칸 여행')]),
    destination('es', '스페인', '남유럽', '마드리드', [countryFilm('4sWOWIW5zqk', '마드리드에서 마무리한 스페인 여행')]),
    destination('si', '슬로베니아', '발칸반도', '류블랴나 · 블레드', [countryFilm('6InIcKBIAeg', '슬로베니아 여행 몰아보기')]),
    destination('al', '알바니아', '발칸반도', '지로카스트로', [balkansTwo]),
    destination('xk', '코소보', '발칸반도', '프리슈티나 · 프리즈렌', [balkansOne]),
    destination('hr', '크로아티아', '발칸반도', '두브로브니크 · 자그레브', [countryFilm('ehYP17Vet04', '크로아티아 여행 몰아보기')]),
    destination('pt', '포르투갈', '남유럽', '리스본 · 포르투', [countryFilm('dK1MTj2WsGQ', '포르투에서 만나는 와인'), countryFilm('Y3fW4Z1hvAY', '배낭을 메고 리스본으로')])
  ],
  africa: [
    destination('ma', '모로코', '북아프리카', '마라케시 · 페스', [countryFilm('ifY8BQzxSbc', '모로코 여행 몰아보기')]),
    destination('tn', '튀니지', '북아프리카', '카이루안 · 모나스티르', [countryFilm('a1odKgU4Oro', '튀니지 여행 몰아보기')])
  ]
};
const travelCountries = Object.entries(countriesByContinent).flatMap(([continent, entries]) =>
  entries.map(entry => ({ ...entry, continent }))
).sort((a, b) => a.name.localeCompare(b.name, 'ko'));

const countryBookmarkKey = country => 'sugilddara.bookmarks.country.' + country.id;
const isCountryBookmarked = country => localStorage.getItem(countryBookmarkKey(country)) === '1';
