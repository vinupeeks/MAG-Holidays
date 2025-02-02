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
    logging: false,
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
db.branches=require('./brachesModel')(sequelize, Sequelize);
db.leadFollowUp = require('./leadFollowUpModel')(sequelize, Sequelize);
db.status = require('./statusModel')(sequelize, Sequelize);

 
// relation of  User Table
db.roles.belongsToMany(db.user, { through: db.userRoles, as: 'users', foreignKey: 'role_id' });
db.user.belongsToMany(db.roles, { through: db.userRoles, as: 'roles', foreignKey: 'user_id' });

// relation of leads Table
db.user.hasMany(db.leads, { foreignKey: 'assigned_to' });
db.leads.belongsTo(db.user, { as: "assignedTo", foreignKey: 'assigned_to' });

db.user.hasMany(db.leads, { foreignKey: 'created_by' });
db.leads.belongsTo(db.user, { as: "createdBy", foreignKey: 'created_by' });

db.user.hasMany(db.leads, { foreignKey: 'updated_by' });
db.leads.belongsTo(db.user, { as: "updatedBy", foreignKey: 'updated_by' });

db.status.hasMany(db.leads, { foreignKey: 'lead_status' });
db.leads.belongsTo(db.status, { as: "leadStatus", foreignKey: 'lead_status' });

// relation of leadFollowUp Table
db.leads.hasMany(db.leadFollowUp, { foreignKey: 'lead_id' });
db.leadFollowUp.belongsTo(db.leads, { as: "leadId", foreignKey: 'lead_id' });

db.user.hasMany(db.leadFollowUp, { foreignKey: 'created_by' });
db.leadFollowUp.belongsTo(db.user, { as: "createdBy", foreignKey: 'created_by' });

db.user.hasMany(db.leadFollowUp, { foreignKey: 'updated_by' });
db.leadFollowUp.belongsTo(db.user, { as: "updatedBy", foreignKey: 'updated_by' });


module.exports = db;
