const state = { origin: '', days: '', play: '' };

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

document.querySelectorAll('[data-play]').forEach((button) => {
  button.addEventListener('click', () => {
    state.play = button.dataset.play;
    selectButton('play', button);
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
  const tripHref = {
    2: 'trips/kaohsiung-2-days.html',
    3: 'trips/kaohsiung-3-days.html',
    4: 'trips/kaohsiung-4-days.html',
    5: 'trips/kaohsiung-5-days.html'
  };
  const slowTripCta = {
    3: '看 3 日安全牌',
    4: '看 4 日慢玩版',
    5: '看 5 日慢玩版'
  };
  const fallback = {
    name: '直接 3 日安全牌',
    description: '第一次來高雄、懶得研究，先用 3 日安全牌。路線保守，但比較不會熱死、繞路或拖行李亂跑。',
    reminder: '先照安全牌走，熱季中午保留室內休息點，下雨就改雨天備案。',
    href: 'trips/kaohsiung-3-days.html',
    cta: '看 3 日安全牌'
  };

  if (!origin || !days) return fallback;

  if (['台北', '新北', '基隆', '桃園', '新竹', '宜蘭'].includes(origin)) {
    if (dayCount === 1) {
      return {
        name: '高鐵一日快閃版',
        description: `${origin}當天來回高雄可以，但不要貪心。建議只選一條線：左營／巨蛋／瑞豐夜市，或鹽埕／駁二半日。`,
        reminder: '一日來回最怕拖行李、轉乘太多、夏天中午走港邊。第一次來高雄不建議只排 1 天。',
        href: 'local.html',
        cta: '看輕量玩法'
      };
    }
    if (dayCount === 2) {
      return {
        name: '高鐵 2 日壓縮版',
        description: `${origin}出發玩 2 天可以，但要把行程壓小。第一天進市區或港邊，第二天靠左營或高雄車站回程。`,
        reminder: '不要把旗津、西子灣、駁二、夜市全部塞滿，2 天重點是少轉乘、少拖行李。',
        href: 'trips/kaohsiung-2-days.html',
        cta: '看 2 日壓縮版'
      };
    }
    if (dayCount >= 4) {
      return {
        name: '高鐵慢玩版',
        description: `${origin}出發玩 ${days} 天，時間比較充裕，可以放慢步調，把港邊、旗津、左營與雨天備案分開排。`,
        reminder: '天數多不要代表每天塞滿，建議保留半天彈性時間，遇到熱天或雨天才不會爆掉。',
        href: tripHref[dayCount] || 'trips/kaohsiung-3-days.html',
        cta: slowTripCta[dayCount] || '看 3 日安全牌'
      };
    }
    return {
      name: '高鐵 3 日安全牌',
      description: `你從${origin}出發，適合搭高鐵到左營，第一天不要排太滿，第三天靠左營或高雄車站回程。`,
      reminder: '避開拖行李跑旗津、熱季中午走港邊、最後一天排太遠。',
      href: 'trips/kaohsiung-3-days.html',
      cta: '看 3 日安全牌'
    };
  }

  if (['苗栗', '台中', '彰化', '南投', '雲林', '嘉義', '台南'].includes(origin)) {
    if (dayCount === 1) {
      return {
        name: '短程一日輕旅行',
        description: `${origin}出發一日高雄可行，但不要排太滿。建議只選一區：鹽埕／駁二、巨蛋／瑞豐夜市，或三多商圈雨天備案。`,
        reminder: '一日行程重點是少移動，不要把港邊、旗津、夜市全部塞進同一天。',
        href: 'local.html',
        cta: '看輕量玩法'
      };
    }
    if (dayCount === 2) {
      return {
        name: '2 日短程版',
        description: `${origin}出發玩 2 天，適合週末或短假期。第一天市區或港邊，第二天回程前排左營或高雄車站附近。`,
        reminder: '2 天要避開跨太多區，先決定住宿區，再排順路吃喝。',
        href: 'trips/kaohsiung-2-days.html',
        cta: '看 2 日短程版'
      };
    }
    return {
      name: '3 日以上短程慢玩版',
      description: `${origin}出發玩 ${days} 天，交通壓力較小，可以把港邊、旗津、夜市與住宿區分開排。`,
      reminder: '天數越多越要放慢，不要每天換太多區。',
      href: tripHref[dayCount] || 'trips/kaohsiung-3-days.html',
      cta: slowTripCta[dayCount] || '看 3 日安全牌'
    };
  }

  if (origin === '屏東') {
    if (dayCount === 1) {
      return {
        name: '屏東一日輕旅行',
        description: '屏東出發不一定要住宿，適合一日或半日高雄玩法。重點是選一區玩，不要照外地旅客長天數路線排。',
        reminder: '一日玩法優先考慮天氣、轉乘少、回程方便。',
        href: 'local.html',
        cta: '看本地玩法'
      };
    }
    return {
      name: '屏東 2 日以上輕住宿版',
      description: `屏東出發玩 ${days} 天，可以輕住宿，但不要硬塞觀光客路線。適合把港邊、夜市與室內備案分開。`,
      reminder: '屏東出發的優勢是彈性，不必把每一天排滿。',
      href: tripHref[dayCount] || 'local.html',
      cta: slowTripCta[dayCount] || (dayCount === 2 ? '看 2 日短程版' : '看本地玩法')
    };
  }

  if (['台東', '花蓮', '澎湖', '金門', '馬祖'].includes(origin)) {
    if (dayCount <= 2) {
      return {
        name: '不建議短天數硬衝',
        description: `${origin}到高雄交通時間較長，不建議 ${days} 天塞太滿。短天數會把時間花在交通與拖行李移動。`,
        reminder: `若只有 ${days} 天，建議只排市區輕行程，不要硬塞旗津、港邊與夜市全包。`,
        href: 'trips/kaohsiung-3-days.html',
        cta: '看 3 日安全牌'
      };
    }
    return {
      name: '東部出發慢玩版',
      description: `${origin}出發玩 ${days} 天比較合理。第一天以抵達與市區輕行程為主，後面再排港邊、旗津或左營回程線。`,
      reminder: '東部出發不要第一天就排太硬，先降低交通疲勞。',
      href: tripHref[dayCount] || 'trips/kaohsiung-3-days.html',
      cta: slowTripCta[dayCount] || '看 3 日安全牌'
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
