const state = { origin: '', days: '' };
const helperState = { base: '', traveler: '', spots: [], weather: '' };

function selectButton(groupName, button) {
  document.querySelectorAll(`[data-group="${groupName}"] button`).forEach((item) => {
    item.classList.remove('is-selected');
  });
  button.classList.add('is-selected');
}

document.querySelectorAll('[data-origin]').forEach((button) => {
  button.addEventListener('click', () => {
    state.origin = button.dataset.origin;
    selectButton('origin', button);
  });
});

document.querySelectorAll('[data-days]').forEach((button) => {
  button.addEventListener('click', () => {
    state.days = button.dataset.days;
    selectButton('days', button);
  });
});

const message = document.getElementById('planner-message');
const planButton = document.getElementById('plan-button');

if (planButton) {
  planButton.addEventListener('click', () => {
    if (!state.origin || !state.days) {
      if (message) message.textContent = '請先選出發地和旅遊天數。';
      return;
    }

    const routes = {
      '2': 'trips/kaohsiung-2-days.html',
      '3': 'trips/kaohsiung-3-days.html',
      '4': 'trips/kaohsiung-4-days.html',
      '5': 'trips/kaohsiung-5-days.html'
    };

    window.location.href = routes[state.days];
  });
}

function selectHelperButton(groupName, button) {
  document.querySelectorAll(`[data-helper-group="${groupName}"] button`).forEach((item) => {
    item.classList.remove('is-selected');
    item.setAttribute('aria-pressed', 'false');
  });
  button.classList.add('is-selected');
  button.setAttribute('aria-pressed', 'true');
}

function toggleHelperSpot(button) {
  const spot = button.dataset.helperSpot;
  if (!spot) return;
  const isSelected = helperState.spots.includes(spot);
  helperState.spots = isSelected
    ? helperState.spots.filter((item) => item !== spot)
    : [...helperState.spots, spot];
  button.classList.toggle('is-selected', !isSelected);
  button.setAttribute('aria-pressed', String(!isSelected));
}

document.querySelectorAll('[data-helper-base]').forEach((button) => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    helperState.base = button.dataset.helperBase;
    selectHelperButton('base', button);
  });
});

document.querySelectorAll('[data-helper-traveler]').forEach((button) => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    helperState.traveler = button.dataset.helperTraveler;
    selectHelperButton('traveler', button);
  });
});

document.querySelectorAll('[data-helper-spot]').forEach((button) => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => toggleHelperSpot(button));
});

document.querySelectorAll('[data-helper-weather]').forEach((button) => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    helperState.weather = button.dataset.helperWeather;
    selectHelperButton('weather', button);
  });
});

function hasHelperSpot(name) {
  return helperState.spots.includes(name);
}

function helperResultLink(traveler, weather) {
  if (traveler === '高雄本地人') return { href: 'local.html', label: '查看本地玩法' };
  if (traveler === '第一次來高雄') return { href: 'trips/kaohsiung-3-days.html', label: '查看 3 日安全牌' };
  if (weather === '會下雨') return { href: 'rainy-day.html', label: '查看雨天備案' };
  if (weather === '很熱') return { href: 'hot-season.html', label: '查看熱季玩法' };
  return { href: 'trips/kaohsiung-3-days.html', label: '查看完整 3 日行程' };
}

function buildHelperResult() {
  const base = helperState.base || '美麗島／高雄車站';
  const traveler = helperState.traveler || '第一次來高雄';
  const weather = helperState.weather || '普通';
  const selectedSpots = helperState.spots.length ? helperState.spots : ['駁二', '西子灣'];
  const warnings = [];
  const rainyBackups = ['夢時代', '三多商圈', '漢神巨蛋', '科工館'];
  const order = [];
  let title = '不開車順路安全牌';
  let stay = base;
  let transport = '捷運、輕軌、步行，必要時用短程計程車補最後一段。';

  if (traveler === '高雄本地人') {
    title = '高雄本地半日輕鬆版';
    transport = '選一區少轉乘，捷運或輕軌到附近後慢慢走。';
  }
  if (traveler === '第一次來高雄') title = '第一次來高雄 3 日安全牌';
  if (traveler === '帶小孩') {
    title = '親子不開車輕鬆版';
    stay = base === '鹽埕／駁二' ? '三多／夢時代' : base;
    warnings.push('不建議行程太滿，要保留廁所、冷氣與休息點。');
  }
  if (traveler === '帶長輩') {
    title = '長輩友善少走路版';
    stay = ['美麗島／高雄車站', '三多／夢時代'].includes(base) ? base : '美麗島／高雄車站';
    warnings.push('少轉乘、少走路、少曝曬，不建議一天排太多景點。');
  }
  if (traveler === '情侶散步') title = '港邊傍晚散步版';
  if (traveler === '不想曬太陽') title = '室內優先避曬版';

  if (hasHelperSpot('駁二')) order.push('駁二');
  if (hasHelperSpot('西子灣')) order.push('西子灣');
  if (hasHelperSpot('旗津')) order.push('旗津');
  if (hasHelperSpot('夢時代')) order.push('夢時代');
  if (hasHelperSpot('瑞豐夜市') || hasHelperSpot('高雄巨蛋')) order.push('高雄巨蛋／瑞豐夜市');
  if (hasHelperSpot('蓮池潭')) order.push('蓮池潭／左營');
  if (hasHelperSpot('衛武營')) order.push('衛武營');
  if (!order.length) order.push(...selectedSpots);

  if (hasHelperSpot('駁二') && hasHelperSpot('西子灣') && hasHelperSpot('旗津')) {
    warnings.push('駁二、西子灣、旗津可排同區，但要看天氣與體力。');
  }
  if (hasHelperSpot('瑞豐夜市') && hasHelperSpot('高雄巨蛋')) {
    warnings.push('瑞豐夜市與高雄巨蛋同區，適合放晚上。');
  }
  if (hasHelperSpot('夢時代')) {
    warnings.push('夢時代可接三多商圈，雨天與親子都比較穩。');
  }
  if (hasHelperSpot('蓮池潭')) {
    warnings.push('蓮池潭適合接左營回程，不建議放在大雨或正中午。');
  }
  if (hasHelperSpot('衛武營')) {
    warnings.push('衛武營和多數港邊景點不一定順路，建議獨立半日處理。');
  }

  if (weather === '會下雨') {
    warnings.push('雨天不建議旗津、西子灣、蓮池潭長時間戶外。');
  }
  if (weather === '很熱') {
    warnings.push('很熱時中午不排駁二、旗津、西子灣、蓮池潭，戶外改早上或傍晚。');
  }
  if (traveler === '帶小孩') {
    warnings.push('帶小孩優先夢時代、三多、室內、有廁所與休息點。');
  }

  const rainyText = weather === '會下雨'
    ? `直接改走 ${rainyBackups.join('、')}，並查看雨天備案。`
    : `保留 ${rainyBackups.slice(0, 3).join('、')} 作為臨時替代。`;
  const hotText = weather === '很熱' || traveler === '不想曬太陽'
    ? '4～10 月中午避免長時間戶外，戶外排早上或傍晚。'
    : '4～10 月仍建議中午安排室內休息點。';
  const link = helperResultLink(traveler, weather);

  return {
    title,
    stay,
    transport,
    order: order.join(' → '),
    warning: warnings.join(' '),
    rainyText,
    hotText,
    link
  };
}

const helperButton = document.getElementById('helper-button');
const helperResult = document.getElementById('helper-result');

if (helperButton && helperResult) {
  helperButton.addEventListener('click', () => {
    const result = buildHelperResult();
    helperResult.hidden = false;
    helperResult.innerHTML = `
      <h3>${result.title}</h3>
      <dl>
        <div><dt>建議住宿區</dt><dd>${result.stay}</dd></div>
        <div><dt>建議交通方式</dt><dd>${result.transport}</dd></div>
        <div><dt>建議順序</dt><dd>${result.order}</dd></div>
        <div><dt>不建議安排</dt><dd>${result.warning || '不要把行程排太滿，保留休息與轉乘時間。'}</dd></div>
        <div><dt>雨天替代</dt><dd>${result.rainyText}</dd></div>
        <div><dt>熱季提醒</dt><dd>${result.hotText}</dd></div>
      </dl>
      <a class="back-button" href="${result.link.href}">${result.link.label}</a>
    `;
  });
}

const weatherStatus = document.getElementById('weather-status');
const weatherCurrent = document.getElementById('weather-current');
const weatherDaily = document.getElementById('weather-daily');

function weatherText(code) {
  if ([0].includes(code)) return '晴朗';
  if ([1, 2, 3].includes(code)) return '多雲';
  if ([45, 48].includes(code)) return '有霧';
  if ([51, 53, 55, 56, 57].includes(code)) return '毛毛雨';
  if ([61, 63, 65, 66, 67].includes(code)) return '下雨';
  if ([80, 81, 82].includes(code)) return '陣雨';
  if ([95, 96, 99].includes(code)) return '雷雨';
  return '天氣變化';
}

function weatherAdvice(maxTemp, rainProb, code) {
  if (rainProb >= 60 || [61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
    return '建議改走室內或雨天備案：夢時代、三多商圈、漢神巨蛋、科工館、駁二室內展館。';
  }
  if (maxTemp >= 32) {
    return '中午避免長時間戶外，港邊、旗津、西子灣、蓮池潭請排早上或傍晚。';
  }
  return '可排戶外慢遊，但仍保留室內休息點。';
}

async function loadKaohsiungWeather() {
  if (!weatherStatus || !weatherCurrent || !weatherDaily) return;
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=22.6273&longitude=120.3014&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTaipei&forecast_days=5';
    const response = await fetch(url);
    if (!response.ok) throw new Error('weather fetch failed');
    const data = await response.json();
    const currentTemp = Math.round(data.current.temperature_2m);
    const currentCode = data.current.weather_code;
    weatherStatus.textContent = '已讀取高雄最新天氣預報';
    weatherCurrent.innerHTML = `<strong>${currentTemp}°C｜${weatherText(currentCode)}</strong><span>${weatherAdvice(currentTemp, data.daily.precipitation_probability_max[0] || 0, currentCode)}</span>`;
    weatherDaily.innerHTML = data.daily.time.map((date, index) => {
      const max = Math.round(data.daily.temperature_2m_max[index]);
      const min = Math.round(data.daily.temperature_2m_min[index]);
      const rain = data.daily.precipitation_probability_max[index] ?? 0;
      const code = data.daily.weather_code[index];
      const label = index === 0 ? '今天' : index === 1 ? '明天' : date.slice(5).replace('-', '/');
      return `<article class="weather-day"><strong>${label}</strong><span>${weatherText(code)}</span><span>最高 ${max}°C</span><span>最低 ${min}°C</span><span>降雨機率 ${rain}%</span><small>${weatherAdvice(max, rain, code)}</small></article>`;
    }).join('');
  } catch (error) {
    weatherStatus.textContent = '天氣預報暫時讀取失敗，先用保守規則安排行程。';
    weatherCurrent.innerHTML = '<strong>保守規則：</strong><span>4～10 月中午避免長時間戶外；下雨就改走室內或雨天備案，例如夢時代、三多商圈、漢神巨蛋、科工館。</span>';
    weatherDaily.innerHTML = '';
  }
}

loadKaohsiungWeather();
