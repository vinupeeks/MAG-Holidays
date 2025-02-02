const LeadsFollowUp = (sequelize, Sequelize) => {
    const leadFollowUp = sequelize.define("leadFollowUp", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        lead_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'leads',
                key: 'id'
            },
            allowNull: false
        },
        lead_status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        feed_back: {
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
            uniqueKeys: {
                uniqueLeadFollowUp: {
                    fields: ['lead_id', 'created_by', 'updated_by']
                }
            }
        });
    return leadFollowUp;
};

module.exports = LeadsFollowUp;
