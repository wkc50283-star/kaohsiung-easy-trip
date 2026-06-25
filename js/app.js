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
    updatePlannerResultIfVisible();
  });
});

document.querySelectorAll('[data-days]').forEach((button) => {
  button.addEventListener('click', () => {
    state.days = button.dataset.days;
    selectButton('days', button);
    updatePlannerResultIfVisible();
  });
});

const message = document.getElementById('planner-message');
const planButton = document.getElementById('plan-button');
const plannerResult = document.getElementById('planner-result');
const plannerResultTitle = document.getElementById('planner-result-title');
const plannerResultDescription = document.getElementById('planner-result-description');
const plannerResultReminder = document.getElementById('planner-result-reminder');
const plannerResultLink = document.getElementById('planner-result-link');

function getTripRecommendation(origin, days) {
  const dayCount = Number(days);
  const fallback = {
    name: '直接 3 日安全牌',
    description: '第一次來高雄、懶得研究，先用 3 日安全牌。路線保守，但比較不會熱死、繞路或拖行李亂跑。',
    reminder: '先照安全牌走，熱季中午保留室內休息點，下雨就改雨天備案。',
    href: 'trips/kaohsiung-3-days.html',
    cta: '看 3 日安全牌'
  };

  if (!origin || !days) return fallback;

  if (['台北', '桃園', '新竹'].includes(origin)) {
    return {
      name: '高鐵 3 日安全牌',
      description: `你從${origin}出發，適合搭高鐵到左營，第一天不要排太滿，第三天靠左營或高雄車站回程。`,
      reminder: dayCount >= 4 ? '天數較充裕，可以放慢步調，增加雨天備案與住宿區判斷。' : '避開拖行李跑旗津、熱季中午走港邊、最後一天排太遠。',
      href: 'trips/kaohsiung-3-days.html',
      cta: '看 3 日安全牌'
    };
  }

  if (['台中', '嘉義', '台南'].includes(origin)) {
    const isTwoDays = dayCount === 2;
    return {
      name: '2～3 日短程版',
      description: `你從${origin}出發，交通時間較短，適合週末或短假期。第一天可以直接進市區，第二天排港邊或夜市，最後一天不要排太遠。`,
      reminder: dayCount === 1 ? '1 天不要排太滿，以半日或一日順路玩法為主。' : dayCount >= 4 ? '4～5 天可以放慢，加入雨天備案與住宿區判斷。' : '短程旅遊重點是少繞路，行李先放好再開始走。',
      href: isTwoDays ? 'trips/kaohsiung-2-days.html' : 'trips/kaohsiung-3-days.html',
      cta: isTwoDays ? '看 2 日短程版' : '看 3 日安全牌'
    };
  }

  if (origin === '屏東') {
    return {
      name: '1～2 日輕旅行版',
      description: '屏東出發不一定要住宿，適合半日、一日或輕住宿。不要把行程排成外地長天數玩法，重點是天氣、時間與地點順路。',
      reminder: dayCount >= 3 ? '天數較多時也不要硬塞觀光客路線，優先依天氣與體力安排。' : '1～2 天以少轉乘、少曝曬、少繞路為主。',
      href: 'local.html',
      cta: '看本地玩法'
    };
  }

  if (['台東', '花蓮'].includes(origin)) {
    return {
      name: '不建議短天數硬衝',
      description: `${origin}到高雄交通時間較長，不建議 1～2 天塞太滿。至少抓 3～5 天，第一天以抵達與市區輕行程為主。`,
      reminder: dayCount <= 2 ? '不建議短天數硬衝，避免把時間花在交通與拖行李移動。' : '第一天輕鬆抵達，後面再排港邊、旗津或左營回程線。',
      href: 'trips/kaohsiung-3-days.html',
      cta: '看 3 日安全牌'
    };
  }

  if (origin === '高雄') {
    return {
      name: '半日／雨天／熱天玩法',
      description: '本地人不用照觀光客路線，直接依天氣、時間與地點選半日玩法。熱天避開港邊中午，雨天改室內與商圈。',
      reminder: '先決定今天要不要曬太陽，再選一區少轉乘、順路吃喝。',
      href: 'local.html',
      cta: '看本地玩法'
    };
  }

  return fallback;
}

function renderPlannerResult(recommendation) {
  if (!plannerResult || !plannerResultTitle || !plannerResultDescription || !plannerResultReminder || !plannerResultLink) return;
  plannerResultTitle.textContent = `你的建議玩法：${recommendation.name}`;
  plannerResultDescription.textContent = recommendation.description;
  plannerResultReminder.textContent = `提醒：${recommendation.reminder}`;
  plannerResultLink.href = recommendation.href;
  plannerResultLink.textContent = recommendation.cta;
  plannerResult.hidden = false;
}

function updatePlannerResultIfVisible() {
  if (!plannerResult || plannerResult.hidden) return;
  renderPlannerResult(getTripRecommendation(state.origin, state.days));
}

if (planButton) {
  planButton.addEventListener('click', () => {
    if (message) message.textContent = '';
    renderPlannerResult(getTripRecommendation(state.origin, state.days));
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
