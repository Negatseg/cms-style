// views/layouts/main.handlebars: Main layout template
// views/homepage.handlebars: Homepage view
// views/blogPost.handlebars: Blog post view
// views/dashboard.handlebars: Dashboard view
// views/addBlogPost.handlebars: Add blog post form view
// views/editBlogPost.handlebars: Edit blog post form view


const router = require('express').Router();

router.get('/', async (req, res) => {
  // Send the rendered Handlebars.js template back as the response
  res.render('homepage');
});

module.exports = router;