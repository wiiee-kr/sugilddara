// Each series can publish videos immediately and link detailed courses as they become available.
const travelSeries = [
  {
    id: 'laos', name: '라오스', cover: 'assets/series/laos.jpg',
    cities: ['비엔티안', '루앙프라방', '팍세'],
    keywords: ['동남아시아', 'Laos', 'Vientiane', 'Luang Prabang', 'Pakse'],
    films: [
      { id: 'd6BjAOEnrNs', title: '다시 찾은 라오스', places: '농키아우 · 무앙응오이 · 반나마을' },
      { id: 'B5R5y_Y-XY0', title: '라오스 여행 몰아보기', places: '비엔티안 · 루앙프라방 · 팍세' }
    ]
  },
  {
    id: 'central-asia', name: '중앙아시아', cover: 'assets/series/central-asia.jpg',
    cities: ['알마티', '비슈케크', '아쉬가바트'],
    keywords: ['카자흐스탄', '키르기스스탄', '키르기즈스탄', '투르크메니스탄', '아시가바트', 'Central Asia', 'Almaty', 'Bishkek', 'Ashgabat'],
    films: [
      { id: 'WvT9OsoCM74', title: '카자흐스탄과 키르기스스탄 몰아보기', places: '알마티 · 비슈케크' }
    ]
  },
  {
    id: 'caucasus', name: '코카서스 3국', cover: 'assets/series/caucasus.jpg',
    cities: ['바쿠', '트빌리시', '예레반'],
    keywords: ['조지아', '아르메니아', '아제르바이잔', '캅카스', 'Caucasus', 'Baku', 'Tbilisi', 'Yerevan'],
    films: [
      { id: 'Swz7ZOQlIDY', countryId: 'ge', title: '조지아 여행 몰아보기', places: '트빌리시 · 카즈베기 · 바투미' },
      { id: 'P_kHMDe9Ufo', countryId: 'az', title: '아제르바이잔의 수도, 바쿠', places: '아제르바이잔 · 바쿠' },
      { id: 'QFav5NcG-wY', countryId: 'am', title: '아르메니아에서 만난 예레반', places: '아르메니아 · 예레반' }
    ]
  }
];
