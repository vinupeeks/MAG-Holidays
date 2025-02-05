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

db.branches = require('./brachesModel')(sequelize, Sequelize);
db.country = require('./countryModel')(sequelize, Sequelize);
// db.leadFollowUp = require('./leadFollowUpModel')(sequelize, Sequelize);
db.leads = require('./leadsModel')(sequelize, Sequelize);
db.members = require('./membersModel')(sequelize, Sequelize);
db.roles = require('./roleModel')(sequelize, Sequelize);
db.status = require('./statusModel')(sequelize, Sequelize);
db.tourPackages = require('./tourPackagesModel')(sequelize, Sequelize);
db.travelType = require('./travelTypeModel')(sequelize, Sequelize);
db.user = require('./userModel')(sequelize, Sequelize);
db.userRoles = require('./userRolesModel')(sequelize, Sequelize);
db.travelDetails = require('./travelDetailsModel')(sequelize, Sequelize);

// relation of  User Table
db.roles.belongsToMany(db.user, { through: db.userRoles, as: 'users', foreignKey: 'role_id' });
db.user.belongsToMany(db.roles, { through: db.userRoles, as: 'roles', foreignKey: 'user_id' });

db.branches.hasMany(db.user, { foreignKey: 'branch_id' });
db.user.belongsTo(db.branches, { as: "branchId", foreignKey: 'branch_id' });


// relation of leads Table
db.user.hasMany(db.leads, { foreignKey: 'assigned_to' });
db.leads.belongsTo(db.user, { as: "assignedTo", foreignKey: 'assigned_to' });

db.status.hasMany(db.leads, { foreignKey: 'status_id' });
db.leads.belongsTo(db.status, { as: "statusId", foreignKey: 'status_id' });

db.user.hasMany(db.leads, { foreignKey: 'created_by' });
db.leads.belongsTo(db.user, { as: "createdBy", foreignKey: 'created_by' });

db.user.hasMany(db.leads, { foreignKey: 'updated_by' });
db.leads.belongsTo(db.user, { as: "updatedBy", foreignKey: 'updated_by' });


// relation of TravelDetails table
db.leads.hasMany(db.travelDetails, { foreignKey: 'lead_id' });
db.travelDetails.belongsTo(db.leads, { as: "leadId", foreignKey: 'lead_id' });

db.travelType.hasMany(db.travelDetails, { foreignKey: 'travel_type' });
db.travelDetails.belongsTo(db.travelType, { as: "travelId", foreignKey: 'travel_type' });

db.tourPackages.hasMany(db.travelDetails, { foreignKey: 'package_id' });
db.travelDetails.belongsTo(db.tourPackages, { as: "packageId", foreignKey: 'package_id' });

db.user.hasMany(db.travelDetails, { foreignKey: 'created_by' });
db.travelDetails.belongsTo(db.user, { as: "createdBy", foreignKey: 'created_by' });

db.user.hasMany(db.travelDetails, { foreignKey: 'updated_by' });
db.travelDetails.belongsTo(db.user, { as: "updatedBy", foreignKey: 'updated_by' });


// relation of Members Table
db.leads.hasMany(db.members, { foreignKey: 'lead_id' });
db.members.belongsTo(db.leads, { as: "leadId", foreignKey: 'lead_id' });

db.travelDetails.hasMany(db.members, { foreignKey: 'travel_details_id' })
db.members.belongsTo(db.travelDetails, { as: "travelDetailsId", foreignKey: 'travel_details_id' })

db.user.hasMany(db.members, { foreignKey: 'assigned_to' });
db.members.belongsTo(db.user, { as: "assignedTo", foreignKey: 'assigned_to' });

db.status.hasMany(db.members, { foreignKey: 'status_id' });
db.members.belongsTo(db.status, { as: "statusId", foreignKey: 'status_id' });

db.user.hasMany(db.members, { foreignKey: 'created_by' });
db.members.belongsTo(db.user, { as: "createdBy", foreignKey: 'created_by' });

db.user.hasMany(db.members, { foreignKey: 'updated_by' });
db.members.belongsTo(db.user, { as: "updatedBy", foreignKey: 'updated_by' });


// relation of leadFollowUp Table
// db.leads.hasMany(db.leadFollowUp, { foreignKey: 'lead_id' });
// db.leadFollowUp.belongsTo(db.leads, { as: "leadId", foreignKey: 'lead_id' });

// db.user.hasMany(db.leadFollowUp, { foreignKey: 'created_by' });
// db.leadFollowUp.belongsTo(db.user, { as: "createdBy", foreignKey: 'created_by' });

// db.user.hasMany(db.leadFollowUp, { foreignKey: 'updated_by' });
// db.leadFollowUp.belongsTo(db.user, { as: "updatedBy", foreignKey: 'updated_by' });


module.exports = db;
