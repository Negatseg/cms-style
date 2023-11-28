const router = require('express').Router();
const homeRoutes = require('./userRoutes');
const projectRoutes = require('./projectRoutes');

router.use('/', userRoutes);
router.use('/projects',projectRoutes);

module.exports = router;