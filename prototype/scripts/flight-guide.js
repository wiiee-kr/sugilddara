const query = new URLSearchParams(location.search);
const arriving = query.get('direction') === 'arrive';
const steps = arriving ? [
  {
    title: '입국심사장으로 가세요',
    detail: '비행기에서 내리면 ‘도착·입국’ 표지를 따라가세요. 입국심사 전에 여권을 준비해 주세요.',
    facts: [['도착 터미널', '제2여객터미널']],
    photo: ['immigration', '여권을 들고 입국심사장으로 가는 여행객', '심사장에 도착하면 직원 안내에 따라 줄을 서세요.'],
    next: '입국심사를 마쳤어요'
  },
  {
    title: '부친 짐을 찾으세요',
    detail: '수하물 찾는 곳의 전광판에서 내 편명을 찾아보세요. 표시된 번호의 수하물 벨트로 가세요.',
    facts: [['수하물 벨트 번호 예시', '7번']],
    photo: ['baggage', '수하물 벨트에서 가방을 찾는 여행객', '가방에 달린 이름표를 확인하고 내 짐을 가져가세요. 부친 짐이 없으면 바로 도착장 안내로 넘어가세요.'],
    next: '도착장 안내 보기'
  },
  {
    title: '도착장으로 나가세요',
    detail: '짐을 모두 챙긴 뒤 공항의 세관 안내를 따라가세요.',
    facts: [],
    photo: ['exit', '캐리어를 끌고 도착장 문을 통과하는 여행객', '세관 절차를 마치면 출구 표지를 따라 도착장으로 나가세요.'],
    next: '안내 마치기'
  }
] : [
  {
    title: '먼저 체크인하세요',
    detail: '아래 터미널의 체크인 카운터로 가세요. 여권을 보여주고 부칠 짐을 맡기세요.',
    facts: [['출발 터미널 예시', '제2여객터미널'], ['체크인 카운터 예시', 'A. B. C. D']],
    next: '체크인을 마쳤어요'
  },
  {
    title: '출국장으로 가세요',
    detail: '여권과 탑승권을 준비하세요. 출국장으로 들어가 보안검색을 받은 뒤 출국심사를 받으세요.',
    facts: [['심사 후 이동할 탑승구 예시', '253번']],
    next: '탑승구 안내 보기'
  },
  {
    title: '탑승구로 가세요',
    detail: '전광판에서 내 편명과 탑승구 번호를 다시 확인하세요. 탑승구 앞에서 항공사의 탑승 안내를 기다리세요.',
    facts: [['탑승구 예시', '253번']],
    next: '안내 마치기'
  }
];

function renderGuide() {
  const index = ['#2', '#3'].indexOf(location.hash) + 1;
  const step = steps[index];
  const labels = arriving ? ['입국심사', '짐 찾기', '도착장'] : ['체크인', '출국 수속', '탑승구'];
  document.querySelector('#step-nav').replaceChildren(...labels.map((label, i) => {
    const item = document.createElement(i === index ? 'span' : 'a');
    item.textContent = label;
    if (i === index) item.setAttribute('aria-current', 'step');
    else item.href = '#' + (i + 1);
    return item;
  }));
  const title = document.querySelector('#instruction');
  title.textContent = step.title;
  document.querySelector('#detail').textContent = step.detail;
  const facts = document.querySelector('#facts');
  facts.parentElement.classList.toggle('location--check-in', !arriving && index === 0);
  facts.replaceChildren();
  for (const [label, value] of step.facts) {
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    term.hidden = arriving && index === 0;
    description.textContent = value;
    facts.append(term, description);
  }
  const back = document.querySelector('#back');
  back.href = index ? '#' + index : 'flights.html';
  const next = document.querySelector('#next');
  next.textContent = step.next;
  next.href = index === steps.length - 1 ? 'flights.html' : '#' + (index + 2);
  facts.parentElement.hidden = step.facts.length === 0;
  const figure = document.querySelector('#arrival-photo');
  figure.hidden = !step.photo;
  if (step.photo) {
    const [file, alt, caption] = step.photo;
    const image = figure.querySelector('img');
    image.src = 'assets/arrival/' + file + '.jpg';
    image.alt = alt;
    figure.querySelector('figcaption').textContent = caption;
  }
  title.focus({preventScroll: true});
  document.querySelector('main').scrollTo(0, 0);
}

window.addEventListener('hashchange', renderGuide);
renderGuide();
