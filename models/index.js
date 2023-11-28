

const User = require('./User');
const Project = require('./Project');

User.hasMany(Project,{
  foriegnKey: 'user_id',
  onDelete: 'CASCADE'
})

Project.belongsTo(User, {
  foreignKey: 'user_id'
})

module.exports = { User };
