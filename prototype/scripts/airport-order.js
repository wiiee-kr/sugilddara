const airportOrder = {
  depart: [
    ['터미널 찾기', '예매 내역에서 출발 터미널을 확인하세요. 공항에 도착하면 그 터미널의 출발층으로 가세요.'],
    ['탑승권과 부칠 짐 확인', '탑승권이 필요하면 항공사 카운터로 가세요. 탑승권이 있고 부칠 짐만 있다면 짐 부치는 곳으로 가세요. 둘 다 준비됐다면 출국장으로 이동하세요.', ['counter-bag']],
    ['보안검색·출국심사', '여권과 탑승권을 들고 출국장으로 들어가세요. 보안검색을 받은 뒤 출국심사 표지를 따라가세요.', ['security', 'passport']],
    ['탑승구 찾기', '전광판에서 내 편명 옆의 탑승구 번호를 찾으세요. 같은 번호가 적힌 표지를 따라가세요.', ['wayfinding']],
    ['비행기 타기', '탑승구 앞에서 기다리다가 내 탑승 순서가 되면 여권과 탑승권을 보여주고 비행기에 타세요.', ['gate']]
  ],
  arrive: [
    ['입국심사 받기', '비행기에서 내려 입국심사 표지를 따라가세요. 여권을 꺼내 두세요.'],
    ['부친 짐 찾기', '전광판에서 내 편명 옆의 수하물 벨트 번호를 확인하고 그곳에서 짐을 찾으세요.'],
    ['도착장으로 나가기', '짐을 챙긴 뒤 세관 안내를 따라 도착장으로 나가세요.']
  ]
};

const landmarks = {
 'counter-bag': ['체크인 직원과 여행객이 여권을 주고받고 왼쪽 수하물 벨트에 청록색 캐리어가 세워진 모습', '직원이 안내하면 부칠 가방을 옆 벨트에 올려 주세요. 탑승권과 여권을 챙기면 돼요.'],
 counter: ['체크인 표지 아래 직원에게 여권을 건네는 승객과 옆 수하물 벨트', '전광판에서 내 편명의 카운터를 찾은 뒤 직원에게 여권을 보여주세요.'],
 bag: ['Bag Drop 표지와 짐을 올리는 벨트', '내 항공사의 ‘Bag Drop’은 짐을 맡기는 곳이에요.'],
 security: ['가방을 바구니에 올리는 보안검색대', '보안검색대에서는 직원 안내에 따라 가방과 소지품을 바구니에 놓으세요.'],
 passport: ['출국심사 표지와 심사대', '검사가 끝나면 짐을 챙기고 ‘출국심사’ 표지를 따라가세요. 여권을 준비하세요.'],
 wayfinding: ['여러 탑승구 번호와 방향이 표시된 공항 표지판을 보는 여행객', '공항 표지판에서 내 탑승구 번호가 포함된 범위를 찾으세요. 그 옆의 화살표를 따라가세요.'],
 gate: ['비행기로 연결되는 탑승구 입구', '탑승구 앞 화면에서 내 편명과 목적지가 맞는지 확인하고 기다리세요. 내 탑승 순서가 되면 여권과 탑승권을 직원에게 보여주세요.']
};
function departurePhoto(name) {
   const photo = document.createElement('img');
   photo.src = 'assets/departure/' + name + '.jpg';
   photo.alt = landmarks[name][0];
   photo.width = 760;
   photo.height = 334;
   const credit = document.createElement('small');
   credit.className = 'ds-example-image__credit';
   credit.textContent = 'AI생성 예시이미지';
   const frame = document.createElement('div');
   frame.className = 'ds-example-image';
   frame.append(photo, credit);
   return frame;
}

function showAirportOrder(direction, active = [], steps = airportOrder[direction]) {
  const list = document.querySelector('#airport-order');
  list.replaceChildren();
  for (const [index, [title, explanation, photos = []]] of steps.entries()) {
    const row = document.createElement('li');
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const number = document.createElement('span');
    number.className = 'order-number';
    number.textContent = index + 1;
    summary.append(number, title);
    if (active.includes(index)) {
      row.className = 'current-order';
      const label = document.createElement('small');
      label.textContent = '현재 안내';
      summary.append(label);
    }
    const description = document.createElement('p');
    description.textContent = explanation;
    details.append(summary, description, ...photos.map(departurePhoto));
    row.append(details);
    list.append(row);
  }
}
