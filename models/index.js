

const User = require('./User');
const project = require('./project');

User.hasMany(Project,{
  foriegnKey: 'user_id',
  onDelete: 'CASCADE'
})

Project.belongsTo(User, {
  foreignKey: 'user_id'
})

module.exports = { User };
