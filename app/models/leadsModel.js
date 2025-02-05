const Leads = (sequelize, Sequelize) => {
    const leads = sequelize.define("leads", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        mobile: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        age: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        address: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        assigned_to: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        leader: {
            type: Sequelize.ENUM(`YES`, `NO`),
            defaultValue: `NO`,
        },
        lead_status: {
            type: Sequelize.ENUM(`HOT`, `WARM`, `COLD`),
            defaultValue: `HOT`,
        },
        status_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        status: {
            type: Sequelize.ENUM(`ACTIVE`, `INACTIVE`, `DELETED`),
            defaultValue: `ACTIVE`,
        },
        created_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        updated_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    },
        {
            timestamps: true,
        });
    return leads;
};

module.exports = Leads;
