// Получение элементов DOM
const habitNameInput = document.getElementById('habitName');
const addHabitBtn = document.getElementById('addHabitBtn');
const habitList = document.getElementById('habitList');

// Создание чекбоксов
function createCheckboxes(habit) {
  const checkboxes = habit.dailyProgress.map((completed, index) => `
    <label>
      <input type="checkbox" value="${index}" ${completed ? 'checked' : ''} onchange="markDay(${habit.id}, ${index}, this.checked)">
        ${index + 1}
    </label>
  `).join('');

  return checkboxes;
}

// Создание кнопок
function createButtons(habit) {
  return `
    <button 
      class="complete-btn ${habit.completed ? 'completed' : ''}" 
      onclick="completeHabit(${habit.id}, this, '${habit.name}')">
      Complete
    </button>
    <button 
      class="delete-btn" 
      onclick="deleteHabit(${habit.id})">
      Delete
    </button>
  `;
}

// Отображение привычек
function renderHabits(habits) {
  habitList.innerHTML = '';
  habits.forEach(habit => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="habit-container">
        <h3>${habit.name}</h3>
        <div class="habit-checkboxes">${createCheckboxes(habit)}</div>
        <div class="habit-button">${createButtons(habit)}</div>
      <div>
    `;
    habitList.appendChild(li);
  });
}

// Отмечаем день для привычки
function markDay(habitId, dayIndex, isChecked) {
  fetch(`http://localhost:5001/api/habits/${habitId}/day/${dayIndex}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: isChecked }) 
  })
  .then(fetchHabits);
}

// Получение привычек с сервера
function fetchHabits() {
  fetch('http://localhost:5001/api/habits')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(renderHabits);
}

// Добавление новой привычки
addHabitBtn.addEventListener('click', () => {
  const name = habitNameInput.value.trim();
  if (name) {
    fetch('http://localhost:5001/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, dailyProgress: Array(30).fill(false) })
    })
    .then(() => {
      habitNameInput.value = ''; 
      fetchHabits();
    });
  } else {
    alert('Пожалуйста, введите имя привычки'); 
  }
});

// Удаление привычки
function deleteHabit(id) {
  fetch(`http://localhost:5001/api/habits/${id}`, { method: 'DELETE' })
    .then(fetchHabits);
}

// Завершение привычки
function completeHabit(habitId, button, habitName) {
  fetch(`http://localhost:5001/api/habits/${habitId}/complete`, { method: 'POST' })
    .then(() => {
      button.classList.add('completed'); 
      button.disabled = true; 
      alert(`Поздравляем! Вы завершили привычку: ${habitName}`);
      fetchHabits(); 
    });
}

// Инициализация приложения
fetchHabits();

