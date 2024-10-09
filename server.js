const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;
const cors = require('cors');
const habits = [];

app.use(cors());
app.use(express.json());


// Получение всех привычек
app.get('/api/habits', (req, res) => {
  res.status(200).json(habits);
});

// Добавление новой привычки
app.post('/api/habits', (req, res) => {
  const newHabit = {
    id: habits.length + 1,
    name: req.body.name,
    dailyProgress: req.body.dailyProgress,
    completed: false,
  };
  habits.push(newHabit);
  res.status(201).json(newHabit);
});

//Удалять, завершать и т.д. планируется только существующие привычки, поэтому не добавляла проверку на существование привычки.

// Удаление привычки
app.delete('/api/habits/:id', (req, res) => {
  const habitId = parseInt(req.params.id);
  const index = habits.findIndex(h => h.id === habitId);
  habits.splice(index, 1);
  res.status(204).end();
});

// Завершение привычки
app.post('/api/habits/:id/complete', (req, res) => {
  const habitId = parseInt(req.params.id);
  const habit = habits.find(h => h.id === habitId);
  habit.completed = true;
  res.status(200).json(habit);
});

// Обновление статуса привычки, отслеживание
app.post('/api/habits/:id/day/:dayIndex', (req, res) => {
  const habitId = parseInt(req.params.id);
  const dayIndex = parseInt(req.params.dayIndex);
  const { completed } = req.body;
  const habit = habits.find(h => h.id === habitId);
  habit.dailyProgress[dayIndex] = completed; 
  res.status(200).json(habit); 
});

// Запуск сервера 5000 порт 
app.listen(PORT);
