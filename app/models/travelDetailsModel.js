const TravelDetails = (sequelize, Sequelize) => {
    const travelDetails = sequelize.define("travelDetails", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        lead_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        travel_type: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        ticket_type: {
            type: Sequelize.ENUM(`Both`, `Ticket_only`, `Visa_only`),
            defaultValue: `Both`,
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
        package_id: {
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
    return travelDetails;
};

module.exports = TravelDetails;
