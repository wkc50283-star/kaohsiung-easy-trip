const state = { origin: '', days: '' };

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
      return `<article class="weather-day"><strong>${label}</strong><span>${weatherText(code)}</span><span>${min}°C - ${max}°C</span><span>降雨 ${rain}%</span><small>${weatherAdvice(max, rain, code)}</small></article>`;
    }).join('');
  } catch (error) {
    weatherStatus.textContent = '天氣預報暫時讀取失敗，先用保守規則安排行程。';
    weatherCurrent.innerHTML = '<strong>保守規則：</strong><span>4～10 月中午避免長時間戶外；下雨就改走室內或雨天備案，例如夢時代、三多商圈、漢神巨蛋、科工館。</span>';
    weatherDaily.innerHTML = '';
  }
}

loadKaohsiungWeather();
