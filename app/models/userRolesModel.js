const UserRoles = (sequelize, Sequelize) => {
    const user_roles = sequelize.define("user_roles", {
        user_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            },
            allowNull: false
        },
        role_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'roles',
                key: 'id'
            },
            allowNull: false
        }
    },
    {
        timestamps: false,
        uniqueKeys: {
            uniqueUserRoles: {
                fields: ['user_id', 'role_id']
            }
        }
    });
    return user_roles;
};

module.exports = UserRoles;