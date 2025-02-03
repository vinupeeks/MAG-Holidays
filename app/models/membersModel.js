const Members = (sequelize, Sequelize) => {
    const members = sequelize.define("members", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        leader_id: {
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
        travel_type: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        ticket_type: {
            type: Sequelize.ENUM(`Both`, `Ticket_only`, `Visa_only`),
            defaultValue: `Both`,
        },
        assigned_to: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        travel_with_in: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        travel_from_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        travel_to_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        member_status: {
            type: Sequelize.ENUM(`HOT`, `WARM`, `COLD`),
            defaultValue: `HOT`,
        },
        package_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
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
