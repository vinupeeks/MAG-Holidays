const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth.config');
const db = require('../models/index');
const { Op, where } = require('sequelize');
const { getPagination, getPagingData } = require('../helpers/pagination');
const transporter = require('../helpers/nodeMailer');
const User = db.user;
const UserRoles = db.userRoles;
const Roles = db.roles;

const generateToken = (id) => {
    return jwt.sign({ id }, authConfig.JWT_SECRET, { expiresIn: '5d' });
};

// Add a new user
exports.createUser = async (req, res) => {
    const { username, name, email, mobile, password, roles } = req.body;
    try {
        const uniqueEmail = await User.findOne({ where: { email } });
        if (uniqueEmail) {
            return res.status(400).json({ message: 'Email already taken..!' });
        }
        const uniqueUsername = await User.findOne({ where: { username } });
        if (uniqueUsername) {
            return res.status(400).json({ message: 'Username already taken..!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            name,
            email,
            mobile,
            password: hashedPassword,
            // created_by: req.user.id,
            // updated_by: req.user.id
        });
        const roleDetails = await UserRoles.bulkCreate(roles.map(roleId =>
            ({ user_id: newUser.id, role_id: roleId })));

        res.status(201).json({ success: true, data: newUser, message: 'User created Successfully..!' });
    } catch (error) {
        console.error('User creation error:', error);
        res.status(500).json({ message: error.message || 'User creation error..!' });
    }
};

// login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            where: { email },
            attributes: ['id', 'username', 'email', 'password'],
            include: [{
                model: Roles,
                as: 'roles',
                attributes: ['id', 'name'],
            }]
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials, email not found..!' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials, password not match..!' });
        }

        const token = generateToken(user.id);
        const roles = user.roles.map((role) => ({
            id: role.id,
            name: role.name,
        }));
        const data = {
            id: user.id,
            username: user.username,
            email: user.email,
            roles,
        };
        res.status(200).json({ message: 'Login Successfull..!', Token: token, data: data });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message || 'Login Error..!' });
    }
};

// List all users  
// exports.getAllUsers = async (req, res) => {

//     // console.log(req.userRoles);
//     const { page, size } = req.body;
//     const { limit, offset } = getPagination(page, size);
//     let Searchattributes = { limit, offset };

//     try {

//         Searchattributes = {
//             ...Searchattributes,
//             where: { status: 'ACTIVE' },
//             attributes: { exclude: ['password'] },
//             order: [['id', 'DESC']],
//             distinct: true,
//         };
//         const users = await User.findAndCountAll(Searchattributes);

//         if (users.length === 0) {
//             return res.status(400).json({ success: false, message: 'No users found..!' });
//         }

//         const response = getPagingData(users, page, limit);
//         res.status(200).json({ success: true, data: response, message: 'Users fetched Successfully..!' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//         res.status(500).json({ message: error.message || 'Error fetching users list..!' });
//     }
// };

exports.getAllUsers = async (req, res) => {
    
    const { page = 0, size = 25, filter } = req.body || {};
    const { limit, offset } = getPagination(page, size);
    let Searchattributes = { limit, offset };

    try {
        const filterId = filter ? { id: filter } : {};
        Searchattributes = {
            ...Searchattributes,
            where: { status: 'ACTIVE' },
            attributes: { exclude: ['password'] },
            order: [['id', 'DESC']],
            distinct: true,
            include: [
                {
                    model: Roles,
                    as: 'roles',
                    where: filterId,
                    attributes: [],
                },
            ],
        };
        const users = await User.findAndCountAll(Searchattributes);
        console.log(users);
        if (users.length === 0) {
            return res.status(400).json({ success: false, message: 'No users found..!' });
        }

        const response = getPagingData(users, page, limit);
        res.status(200).json({ success: true, data: response, message: 'Users fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error fetching users list..!' });
    }
};

// Update a user
exports.userUpdate = async function (req, res) {
    const { username, name, mobile, email, status, roles } = req.body;
    const id = req.params.id;

    try {
        const userData = await User.findByPk(id, { attributes: { exclude: ['password'] } });

        if (!userData) {
            return res.status(404).json({ message: 'User not found..!' });
        }

        if (mobile) {
            const existingMobile = await User.findOne({ where: { mobile: mobile } });
            if (existingMobile && existingMobile.id !== parseInt(id)) {
                return res.status(404).json({
                    success: false,
                    message: 'The phone number already exist, provide another one..!',
                });
            }
        }

        if (username) {
            const existingUsername = await User.findOne({ where: { username: username } });
            if (existingUsername && existingUsername.id !== parseInt(id)) {
                return res.status(404).json({
                    success: false,
                    message: 'The username already exist, provide another one..!',
                    // data: existingUsername, id
                });
            }
        }

        const updateData = {
            username,
            name,
            mobile,
            email,
            status: status,
            updated_by: req.user.id,
        };
        const [updatedRows] = await User.update(updateData, { where: { id } });

        if (!updatedRows) {
            return res.status(400).json({ message: 'Update failed..!' });
        }

        const currentRoles = await UserRoles.findAll({ where: { user_id: id } });
        const currentRoleIds = currentRoles.map(role => role.role_id);

        const rolesToAdd = roles.filter(roleId => !currentRoleIds.includes(roleId));
        const rolesToRemove = currentRoleIds.filter(roleId => !roles.includes(roleId));

        if (rolesToAdd.length > 0) {
            await UserRoles.bulkCreate(rolesToAdd.map(roleId => ({ user_id: id, role_id: roleId })));
        }
        if (rolesToRemove.length > 0) {
            await UserRoles.destroy({
                where: {
                    user_id: id,
                    role_id: rolesToRemove,
                },
            });
        }

        const UserDetails = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({ success: true, message: 'User updated Successfully..!', data: UserDetails });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: error.message || 'Error updating user..!' });
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findOne({
            where: { id: id, status: 'ACTIVE' },
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Roles,
                    as: 'roles',
                    attributes: ['id', 'name', 'label'],
                },
            ],
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found..!' });
        }
        res.status(200).json({ success: true, data: user, message: 'User fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error fetching user..!' });
    }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found..!' });
        }

        const deletionData = {
            status: 'DELETED',
            updated_by: req.user.id,
        };
        const [deletedRows] = await User.update(deletionData, { where: { id } });
        if (!deletedRows) {
            return res.status(400).json({ message: 'Error deleting user..!' });
        }

        const DeleteUserRoles = await UserRoles.destroy({ where: { user_id: id } });
        if (!DeleteUserRoles) {
            return res.status(400).json({ message: 'Error deleting user roles..!' });
        }

        res.status(200).json({ message: 'User and user roles deleted Successfully..!' });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error deleting user and their roles..!' });
    }
};

// change password from the admin
exports.adminChangepassword = async function (req, res) {
    const password = req.body.password;
    const id = req.params.id;
    const pwChanger = req.user;

    try {
        const userData = await User.findByPk(id,
            { attributes: { exclude: ['password'] } }
        );
        if (!userData) {
            return res.status(404).json({ message: 'User not found..!' });
        }
        if (!password) {
            return res.status(500).json({ message: "Enter a valide password and proceed..!" })
        }
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);

        const data = {
            password: hashedPassword,
            updated_by: pwChanger.id
        };

        const [updatedRows] = await User.update(data, { where: { id } });

        if (!updatedRows) {
            return res.status(400).json({ message: 'Password updation failed..!' });
        }
        res.status(200).json({ message: "Successfully updated user password..!" })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: err.message || "Some error occured" });
    }
}

// User forgot password with email
exports.userForgetPassword = async function (req, res) {
    const email = req.body.email;
    const user = req.user;

    try {
        const generateOtp = () => Math.floor(100000 + Math.random() * 900000);
        const formatOtp = (otp) => `${otp.toString().slice(0, 3)} ${otp.toString().slice(3)}`;
        const otp = formatOtp(generateOtp());

        transporter.sendMail({
            from: {
                name: process.env.SMTPENAME,
                address: process.env.SMTPEMAIL
            },
            to: email,
            subject: "M&G OTP for Secure Access",
            html: `
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #dddddd;">
                <h2 style="color: #333333; text-align: center;">Your One-Time Password (OTP)</h2>
                <p style="color: #555555; font-size: 16px; line-height: 1.5;">Hi,</p>
                <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                    Your OTP for accessing your account is:
                </p>
                <p style="font-size: 24px; font-weight: bold; text-align: center; color: #4CAF50; margin: 20px 0;">
                    ${otp}
                </p>
                <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                    This OTP is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.
                </p>
                <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                    If you did not request this OTP, please ignore this email or contact us at
                <a href="mailto:support@example.com" style="color: #4CAF50; text-decoration: none;">support@example.com</a>.
                </p>
                <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;" />
                <p style="font-size: 14px; color: #999999; text-align: center;">
                    Thank you, <br />
                <strong>M&G Travels</strong>
                </p>
                </div>
            </body>
                `,
        });
        console.log(generateOtp());
        console.log(otp);


        res.status(200).json({ message: "success", data: user })

    }
    catch (err) {

        console.log(err)
        res.status(500).send({ message: err.message || "Some error occured" });
    }
}

// user change password using old password
exports.userChangePassword = async function (req, res) {
    const actualPassword = req.body.actualPassword;
    const newPassword = req.body.newPassword;
    const id = req.user.id;

    try {
        if (!newPassword) {
            return res.status(400).json({ success: false, message: 'Password is required..!' });
        }
        const userData = await User.findByPk(id);
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found..!' });
        }

        if (newPassword) {
            if (!actualPassword) {
                return res.status(400).json({ success: false, message: 'Please provide the current password to update the password' });
            }

            const isMatch = await bcrypt.compare(actualPassword, userData.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Incorrect current password..!' });
            }

            if (newPassword.length < 4) {
                return res.status(400).json({ success: false, message: 'New password must be at least 4 characters long' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            userData.password = hashedPassword;
            await userData.save();
            res.status(200).json({ success: true, message: 'Profile updated successfully..!', user: { name: userData.name, email: userData.email } });
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: err.message || "Some error occured" });
    }
}
