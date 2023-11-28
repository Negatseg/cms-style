const express = require('express');
const session = require('express-session');
const handlebars = require('express-handlebars');
const sequelize = require('./models'); // adjust path accordingly

const app = express();

// Set up Handlebars as the template engine
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Set up session middleware
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Sync Sequelize models with the database
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
});

// Your routes and controllers go here...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});