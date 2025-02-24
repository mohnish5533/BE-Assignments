const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const logger = require('./middleware/logger');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger);

// View Engine
app.set('view engine', 'ejs');

// Routes
app.use('/', tasksRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
