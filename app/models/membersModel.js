const Members = (sequelize, Sequelize) => {
    const members = sequelize.define("members", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        lead_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        travel_details_id: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        member_status: {
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
    return members;
};

module.exports = Members;
