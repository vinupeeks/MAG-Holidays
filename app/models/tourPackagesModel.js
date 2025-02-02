const TourPackages = (sequelize, Sequelize) => {
    const tourPackages = sequelize.define("tourPackages", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        place: {
            type: Sequelize.STRING,
            allowNull: false
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        highlights: {
            type: Sequelize.STRING,
            allowNull: false
        },
        day: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        night: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        amount: {
            type: Sequelize.STRING,
            allowNull: false
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
            uniqueKeys: {
                uniquetourPackages: {
                    fields: ['lead_id', 'created_by', 'updated_by']
                }
            }
        });
    return tourPackages;
};

module.exports = TourPackages;
