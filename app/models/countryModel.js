const Country = (sequelize, Sequelize) => {
    const country = sequelize.define("country", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        code: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        icon: {
            type: Sequelize.STRING,
            allowNull: false,
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
    return country;
};

module.exports = Country;