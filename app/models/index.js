const config = require("../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
      host: config.HOST,
      dialect: config.dialect,
      operatorsAliases: 0,
      logging : false,
      pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
      }
    }
  );

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize; 
 
db.user = require('./userModel')(sequelize, Sequelize);
db.roles = require('./roleModel')(sequelize, Sequelize);
db.userRoles = require('./userRolesModel')(sequelize, Sequelize);
db.leads = require('./leadsModel')(sequelize, Sequelize);

 
db.roles.belongsToMany(db.user, { through: db.userRoles, as: 'users', foreignKey: 'role_id' }); 
db.user.belongsToMany(db.roles, { through: db.userRoles, as: 'roles', foreignKey: 'user_id' });

module.exports = db;
 