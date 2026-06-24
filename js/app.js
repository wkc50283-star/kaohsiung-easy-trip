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

planButton.addEventListener('click', () => {
  if (!state.origin || !state.days) {
    message.textContent = '請先選出發地和旅遊天數。';
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
