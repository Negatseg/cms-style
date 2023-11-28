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



const express = require('express');
const exphbs  = require('express-handlebars');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'your_database_name'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static folder
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  // Fetch existing blog posts from the database
  const query = 'SELECT * FROM blog_posts';
  
  connection.query(query, (err, results) => {
    if (err) throw err;

    // Render the homepage with existing blog posts
    res.render('home', { posts: results });
  });
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/dashboard', (req, res) => {
  // Check if the user is logged in (implement authentication logic here)

  // If the user is logged in, render the dashboard
  res.render('dashboard');
  
  // If the user is not logged in, redirect to the login page
  // res.redirect('/login');
});

// Other routes for login, sign up, etc.

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


--------
app.get('/', (req, res) => {
  // Fetch existing blog posts from the database
  const query = 'SELECT * FROM blog_posts';
  
  connection.query(query, (err, results) => {
    if (err) throw err;

    // Render the homepage with existing blog posts
    res.render('home', { posts: results, user: req.user });
  });
});

app.get('/post/:id', (req, res) => {
  const postId = req.params.id;
  
  // Fetch the blog post and its comments from the database
  const postQuery = 'SELECT * FROM blog_posts WHERE id = ?';
  const commentsQuery = 'SELECT * FROM comments WHERE post_id = ?';

  connection.query(postQuery, [postId], (err, postResult) => {
    if (err) throw err;

    connection.query(commentsQuery, [postId], (err, commentsResult) => {
      if (err) throw err;

      // Render the post page with post details and comments
      res.render('post', { post: postResult[0], comments: commentsResult, user: req.user });
    });
  });
});

// Add routes for sign up, login, and logout

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
  connection.query(insertQuery, [username, password], (err) => {
    if (err) throw err;

    // Redirect to login page after successful signup
    res.redirect('/login');
  });
});

// Add routes for login and logout

// ... (Other routes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Routes
// ... (Previous routes)

// Dashboard route (requires authentication)
app.get('/dashboard', isAuthenticated, (req, res) => {
  const userId = req.user.id;
  // Fetch blog posts created by the current user
  const query = 'SELECT * FROM blog_posts WHERE author_id = ?';
  connection.query(query, [userId], (err, results) => {
    if (err) throw err;

    // Render the dashboard with the user's blog posts
    res.render('dashboard', { posts: results, user: req.user });
  });
});

// Add routes for creating, updating, and deleting blog posts

app.post('/create-post', isAuthenticated, (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  const query = 'INSERT INTO blog_posts (title, content, author_id) VALUES (?, ?, ?)';
  connection.query(query, [title, content, userId], (err) => {
    if (err) throw err;

    // Redirect to the updated dashboard after creating a new blog post
    res.redirect('/dashboard');
  });
});

app.get('/edit-post/:id', isAuthenticated, (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  // Fetch the blog post to edit
  const query = 'SELECT * FROM blog_posts WHERE id = ? AND author_id = ?';
  connection.query(query, [postId, userId], (err, results) => {
    if (err) throw err;

    // Render the edit-post page with the blog post details
    res.render('edit-post', { post: results[0], user: req.user });
  });
});

app.post('/update-post/:id', isAuthenticated, (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  // Update the blog post
  const query = 'UPDATE blog_posts SET title = ?, content = ? WHERE id = ?';
  connection.query(query, [title, content, postId], (err) => {
    if (err) throw err;

    // Redirect to the updated dashboard after updating the blog post
    res.redirect('/dashboard');
  });
});

app.get('/delete-post/:id', isAuthenticated, (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  // Delete the blog post
  const query = 'DELETE FROM blog_posts WHERE id = ? AND author_id = ?';
  connection.query(query, [postId, userId], (err) => {
    if (err) throw err;

    // Redirect to the updated dashboard after deleting the blog post
    res.redirect('/dashboard');
  });
});

// ... (Other routes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
