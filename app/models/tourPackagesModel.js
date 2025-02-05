const TourPackages = (sequelize, Sequelize) => {
    const tourPackages = sequelize.define("tourPackages", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        place: {
            type: Sequelize.STRING,
            allowNull: true
        },
        highlights: {
            type: Sequelize.STRING,
            allowNull: true
        },
        day: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        night: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        type: {
            type: Sequelize.ENUM(`International`, `Domestic`),
            allowNull: false
        },
        amount: {
            type: Sequelize.STRING,
            allowNull: true
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
    return tourPackages;
};

module.exports = TourPackages;
