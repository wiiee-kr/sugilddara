const query = new URLSearchParams(location.search);
const arriving = query.get('direction') === 'arrive';
const steps = arriving ? [
  {
    title: '입국심사장으로 가세요',
    detail: '비행기에서 내리면 ‘도착·입국’ 표지를 따라가세요. 입국심사 전에 여권을 준비해 주세요.',
    facts: [['도착 터미널', '제2여객터미널']],
    next: '입국심사를 마쳤어요'
  },
  {
    title: '부친 짐을 찾으세요',
    detail: '수하물 찾는 곳의 전광판에서 내 편명을 찾아보세요. 표시된 번호의 수하물 벨트로 가세요.',
    facts: [['수하물 벨트', '7번']],
    next: '도착장 안내 보기'
  },
  {
    title: '도착장으로 나가세요',
    detail: '세관 안내를 따라 도착장으로 나가세요. 버스를 이용한다면 노선과 타는 곳을 확인하세요.',
    facts: [['공항버스 출발 터미널', '제2여객터미널']],
    next: '항공편 조회로 돌아가기'
  }
] : [
  {
    title: '먼저 체크인하세요',
    detail: '아래 터미널의 체크인 카운터로 가세요. 여권을 보여주고 부칠 짐을 맡기세요.',
    facts: [['출발 터미널', '제2여객터미널'], ['체크인 카운터', 'A · B · C · D']],
    next: '체크인을 마쳤어요'
  },
  {
    title: '출국장으로 가세요',
    detail: '여권과 탑승권을 준비하세요. 출국장으로 들어가 보안검색을 받은 뒤 출국심사를 받으세요.',
    facts: [['심사 후 이동할 탑승구', '253번']],
    next: '탑승구 안내 보기'
  },
  {
    title: '탑승구로 가세요',
    detail: '전광판에서 내 편명과 탑승구 번호를 다시 확인하세요. 탑승구 앞에서 항공사의 탑승 안내를 기다리세요.',
    facts: [['탑승구', '253번']],
    next: '항공편 조회로 돌아가기'
  }
];

function renderGuide() {
  const index = ['#2', '#3'].indexOf(location.hash) + 1;
  const step = steps[index];
  document.querySelector('#ticket-title').textContent = [query.get('flight'), arriving ? '인천 도착' : '인천 출발'].filter(Boolean).join(' · ');
  const date = query.get('date');
  const dateLabel = arriving ? '도착일' : '탑승일';
  document.querySelector('#ticket-date').textContent = date ? dateLabel + ' ' + date : '';
  const active = arriving ? [index] : [[0, 1], [2], [3, 4]][index];
  const direction = arriving ? 'arrive' : 'depart';
  showAirportOrder(direction, active);
  document.querySelector('#progress').textContent = (index + 1) + '단계';
  const title = document.querySelector('#instruction');
  title.textContent = step.title;
  document.querySelector('#detail').textContent = step.detail;
  const facts = document.querySelector('#facts');
  facts.replaceChildren();
  for (const [label, value] of step.facts) {
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = value;
    facts.append(term, description);
  }
  const back = document.querySelector('#back');
  back.href = index ? '#' + index : 'flights.html';
  const next = document.querySelector('#next');
  next.textContent = step.next;
  next.href = index === steps.length - 1 ? 'flights.html' : '#' + (index + 2);
  const bus = arriving && index === 2;
  const official = document.querySelector('#official');
  official.href = bus ? 'https://www.airport.kr/ap_ko/976/subview.do' : 'https://www.airport.kr/';
  official.textContent = bus ? '공항버스 노선·타는 곳 보기 ↗' : '인천공항 공식 안내 보기 ↗';
  title.focus({preventScroll: true});
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', renderGuide);
renderGuide();

const orderSheet = document.querySelector('#order-sheet');
document.querySelector('#open-order').addEventListener('click', () => {
  orderSheet.showModal();
  orderSheet.scrollTop = 0;
});
window.addEventListener('hashchange', () => {
  if (orderSheet.open) orderSheet.close();
});
