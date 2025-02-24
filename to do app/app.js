const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const TASKS_FILE = path.join(__dirname, 'tasks.json');

const readTasks = () => {
    if (!fs.existsSync(TASKS_FILE)) return [];
    return JSON.parse(fs.readFileSync(TASKS_FILE));
};

const writeTasks = (tasks) => {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

app.get('/', (req, res) => {
    res.redirect('/tasks');
});

app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.render('tasks', { tasks });
});

app.get('/task', (req, res) => {
    const { id } = req.query;
    const tasks = readTasks();
    const task = tasks.find(t => t.id === parseInt(id));
    task ? res.render('task', { task }) : res.status(404).send('Task not found');
});

app.get('/add-task', (req, res) => {
    res.render('addTask');
});

app.post('/add-task', (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const tasks = readTasks();
    const newTask = { id: tasks.length + 1, title };
    tasks.push(newTask);
    writeTasks(tasks);
    res.redirect('/tasks');
});

app.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});
