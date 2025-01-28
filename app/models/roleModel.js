const Role = (sequelize, Sequelize) => {
    const role = sequelize.define("role", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        label: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },);
    return role;
};

module.exports = Role;