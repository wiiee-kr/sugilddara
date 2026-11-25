const form = document.querySelector('form');
const flight = document.querySelector('#flight');
const statusText = document.querySelector('#status');
const dateInput = document.querySelector('#custom-date');
form.addEventListener('change', () => {
  document.querySelector('#date-title').textContent = form.elements.direction.value === 'depart' ? '출발일' : '도착일';
  if (form.elements.day.value !== 'custom') {
    customChoice.setAttribute('aria-pressed', 'false');
    dateInput.disabled = true;
  }
});
const calendar = document.querySelector('#calendar');
const customChoice = document.querySelector('#choose-date');
const days = document.querySelector('#days');

let month;
dateInput.disabled = true;

function renderMonth() {
  const year = month.getFullYear();
  const index = month.getMonth();
  document.querySelector('#month').textContent = year + '년 ' + (index + 1) + '월';
  days.replaceChildren();
  const lastDay = new Date(year, index + 1, 0).getDate();
  for (let day = 1; day <= lastDay; day++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = day;
    button.dataset.date = [year, String(index + 1).padStart(2, '0'), String(day).padStart(2, '0')].join('-');
    button.setAttribute('aria-label', (index + 1) + '월 ' + day + '일');
    button.setAttribute('aria-pressed', String(button.dataset.date === dateInput.value));
    if (day === 1) button.style.gridColumnStart = month.getDay() + 1;
    days.append(button);
  }
}

customChoice.addEventListener('click', () => {
  const selected = dateInput.value ? new Date(dateInput.value + 'T12:00:00') : new Date();
  month = new Date(selected.getFullYear(), selected.getMonth(), 1);
  renderMonth();
  if (typeof calendar.showModal === 'function') {
    calendar.showModal();
  } else {
    calendar.setAttribute('open', '');
  }
  document.querySelector('#calendar-title').focus();
});
for (const [id, offset] of [['prev-month', -1], ['next-month', 1]]) {
  document.getElementById(id).addEventListener('click', () => {
    month.setMonth(month.getMonth() + offset);
    renderMonth();
  });
}
days.addEventListener('click', event => {
  const value = event.target.dataset.date;
  if (!value) return;
  dateInput.value = value;
  dateInput.disabled = false;
  form.elements.day.value = 'custom';
  customChoice.setAttribute('aria-pressed', 'true');
  customChoice.textContent = (month.getMonth() + 1) + '월 ' + event.target.textContent + '일';
  statusText.textContent = '';
  closeCalendar();
});
function closeCalendar() {
  if (typeof calendar.close === 'function') calendar.close();
  else calendar.removeAttribute('open');
  customChoice.focus();
}
document.querySelector('#close-calendar').addEventListener('click', closeCalendar);
form.addEventListener('input', () => {
  statusText.textContent = '';
  flight.setCustomValidity('');
});
form.addEventListener('submit', event => {
  event.preventDefault();
  flight.value = flight.value.replace(/\s/g, '').toUpperCase();
  if (!/^(?=[A-Z0-9]{0,2}[A-Z])[A-Z0-9]{2,3}\d{1,4}[A-Z]?$/.test(flight.value)) {
    flight.setCustomValidity('KE703처럼 항공사 코드와 숫자를 입력해 주세요.');
    flight.reportValidity();
    return;
  }
  const selectedDay = form.elements.day.value;
  const date = new Date();
  if (selectedDay === 'tomorrow') date.setDate(date.getDate() + 1);
  const localDate = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  const query = new URLSearchParams({
    flight: flight.value,
    direction: form.elements.direction.value,
    date: selectedDay === 'custom' ? dateInput.value : localDate
  });
  const guide = query.get('direction') === 'arrive' ? 'flight-guide.html' : 'departure-preview.html';
  location.assign(guide + '?' + query);
});
