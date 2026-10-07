const clock = document.querySelector('#clock');
const marketLabel = document.querySelector('#market-label');
const year = document.querySelector('#year');

function updateClock() {
  const now = new Date();
  clock.textContent = new Intl.DateTimeFormat('th-TH', {
    timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(now) + ' BKK';

  const nyParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
  }).formatToParts(now).reduce((parts, part) => ({ ...parts, [part.type]: part.value }), {});
  const minutes = Number(nyParts.hour) * 60 + Number(nyParts.minute);
  const weekday = !['Sat', 'Sun'].includes(nyParts.weekday);
  marketLabel.textContent = weekday && minutes >= 570 && minutes < 960 ? 'US MARKET OPEN' : 'LIVE MARKET DATA';
}

year.textContent = new Date().getFullYear();
updateClock();
setInterval(updateClock, 1000);

