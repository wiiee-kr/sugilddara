const airportOrder = {
  depart: [
    ['터미널 찾기', '예매 내역에서 출발 터미널을 확인하세요. 공항에 도착하면 그 터미널의 출발층으로 가세요.'],
    ['체크인·짐 부치기', '항공사 카운터에서 여권을 보여주고 탑승권을 받으세요. 비행기에 부칠 짐도 여기서 맡겨요.'],
    ['보안검색·출국심사', '여권과 탑승권을 들고 출국장으로 들어가세요. 보안검색을 받은 뒤 출국심사 표지를 따라가세요.'],
    ['탑승구 찾기', '전광판에서 내 편명 옆의 탑승구 번호를 찾으세요. 같은 번호가 적힌 표지를 따라가세요.'],
    ['비행기 타기', '탑승구 앞에서 기다리다가 내 탑승 순서가 되면 여권과 탑승권을 보여주고 비행기에 타세요.']
  ],
  arrive: [
    ['입국심사 받기', '비행기에서 내려 입국심사 표지를 따라가세요. 여권을 꺼내 두세요.'],
    ['부친 짐 찾기', '전광판에서 내 편명 옆의 수하물 벨트 번호를 확인하고 그곳에서 짐을 찾으세요.'],
    ['도착장으로 나가기', '짐을 챙긴 뒤 세관 안내를 따라 도착장으로 나가세요.']
  ]
};

function showAirportOrder(direction, active = []) {
  const list = document.querySelector('#airport-order');
  list.replaceChildren();
  for (const [index, [title, explanation]] of airportOrder[direction].entries()) {
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
    details.append(summary, description);
    row.append(details);
    list.append(row);
  }
}
