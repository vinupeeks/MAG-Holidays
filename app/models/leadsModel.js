const bcrypt = require('bcryptjs');

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
            unique: true,
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
            type: Sequelize.ENUM(`Domestic`, `International`),
            defaultValue: `Domestic`,
        },
        ticket_type: {
            type: Sequelize.ENUM(`Both`, `Ticket_only`, `Visa_only`),
            defaultValue: `Both`,
        },
        assigned_to: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        group: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        created_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        updated_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        status: {
            type: Sequelize.ENUM(`FOLLOW-UP-REQUIRED`, `CONTACTED`, `CONFIRMED`, `INACTIVE`, `DELETED`),
            defaultValue: `FOLLOW-UP-REQUIRED`,
        },
    },
        {
            timestamps: true,
        });
    return leads;
};

module.exports = Leads;