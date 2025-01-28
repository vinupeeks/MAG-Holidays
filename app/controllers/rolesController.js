const db = require('../models/index');
const Roles = db.roles;


exports.rolesList = async (req, res) => {
    try {
        const roles = await Roles.findAll({
        })
        if (roles.length === 0) {
            return res.status(400).json({ success: false, message: 'No roles found..!' });
        }

        res.status(200).json({ success: true, data: roles, message: 'Roles fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
 