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


const searchForm = document.querySelector('#stock-search-form');
const searchInput = document.querySelector('#stock-query');
const searchResult = document.querySelector('#stock-search-result');
const searchMessage = document.querySelector('#stock-search-message');
const nasdaq = new Set('AAPL MSFT NVDA GOOGL GOOG AMZN META TSLA AMD INTC QCOM AVGO NFLX PLTR CRDO MRVL RXRX ABSI AAOI AXTI AEHR ANET DDOG NBIS MTSI COHR AMAT LRCX HOOD'.split(' '));
const nyse = new Set('IBM ORCL CRM UBER VRT T BABA NKE DIS JPM BAC WMT'.split(' '));
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const raw = searchInput.value.trim().toUpperCase();
  if (!/^[A-Z0-9.]{1,15}$/.test(raw)) {
    searchMessage.textContent = 'กรุณาใส่ Symbol หุ้นภาษาอังกฤษ เช่น TSLA';
    return;
  }
  const exchange = nyse.has(raw) ? 'NYSE' : nasdaq.has(raw) ? 'NASDAQ' : null;
  if (!exchange) {
    searchResult.hidden = true;
    searchMessage.replaceChildren(document.createTextNode('ยังไม่รู้จักตลาดของ ' + raw + ' — '));
    const link = document.createElement('a');
    link.href = 'https://www.tradingview.com/symbols/?query=' + encodeURIComponent(raw);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'ค้นหาบน TradingView';
    searchMessage.append(link);
    return;
  }
  const symbol = exchange + ':' + raw;
  searchMessage.textContent = 'กำลังแสดง ' + symbol + ' (ข้อมูลอาจหน่วงตามตลาด)';
  searchResult.hidden = false;
  searchResult.replaceChildren();
  const heading = document.createElement('div');
  heading.className = 'result-title';
  heading.append(document.createTextNode(symbol));
  const link = document.createElement('a');
  link.href = 'https://www.tradingview.com/symbols/' + exchange + '-' + raw + '/';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'ดูรายละเอียด ↗';
  heading.append(link);
  searchResult.append(heading);
  const widget = document.createElement('div');
  widget.className = 'tradingview-widget-container';
  const inner = document.createElement('div');
  inner.className = 'tradingview-widget-container__widget';
  widget.append(inner);
  const script = document.createElement('script');
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
  script.async = true;
  script.textContent = JSON.stringify({ autosize: true, symbol, interval: 'D', timezone: 'Asia/Bangkok', theme: 'dark', style: '1', locale: 'en', allow_symbol_change: true, hide_side_toolbar: false, calendar: false, support_host: 'https://www.tradingview.com' });
  widget.style.height = '460px';
  widget.style.width = '100%';
  widget.append(script);
  searchResult.append(widget);
  searchResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
