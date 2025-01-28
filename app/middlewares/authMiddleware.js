const jwt = require('jsonwebtoken');
const db = require('../models/index');
const authConfig = require('../config/auth.config');
const User = db.user;
const Roles = db.roles;

exports.generateToken = (id) => {
    return jwt.sign({ id }, authConfig.JWT_SECRET, { expiresIn: '5h' });
};

const protectJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized, No token..!' });

    try {
        const decoded = jwt.verify(token, authConfig.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findByPk(userId)
        if (!user) return res.status(404).json({ message: 'User not found..!' });

        req.user = user;
        if (user) {
            const roles = await User.findAll({
                where: { id: req.user.id },
                include: [
                    {
                        model: Roles,
                        as: 'roles',
                    }
                ],
            })
            const userRoles = roles[0].roles;
            const rolesList = userRoles.map((role) => ({
                id: role.id,
                name: role.name,
            }));
            req.user_roles = rolesList;
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token failed..!' });
    }
};

const rolesList = async (req, res, next) => {

    const roles = await User.findAll({
        where: { id: req.user.id },
        include: [
            {
                model: Roles,
                as: 'roles',
            }
        ],
    })
    const userRoles = roles[0].roles;
    req.user_roles = userRoles;
    next();
}

const validateToken = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ isValid: false });
    }

    try {
        const decoded = jwt.verify(token, authConfig.JWT_SECRET);
        res.status(200).json({ decoded });
    } catch (error) {
        res.status(401).json({ isValid: false });
    }
};

const isAdmin = async (req, res, next) => {

    const roles = await User.findAll({
        where: { id: req.user.id },
        include: [
            {
                model: Roles,
                as: 'roles',
            }
        ],
    })
    const userRoles = roles[0].roles;
    for (let Role of userRoles) {
        if (Role.name === "ADMIN") {
            next();
            return;
        }
    }
    res.status(403).send({
        message: "You are not authorized to perform this action.",
    });
    return;
}

const isUser = async (req, res, next) => {

    const roles = await User.findAll({
        where: { id: req.user.id },
        include: [
            {
                model: Roles,
                as: 'roles',
            }
        ],
    })
    const userRoles = roles[0].roles;
    for (let Role of userRoles) {
        if (Role.name === "USER") {
            next();
            return;
        }
    }
    res.status(403).send({
        message: "You are not authorized to perform this action.",
    });
    return;
}

module.exports = {
    protectJWT,
    rolesList,
    validateToken,
    isAdmin,
    isUser
};
