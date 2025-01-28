const { where, Op } = require('sequelize');
const db = require('../models/index');
const { getPagination, getPagingData } = require('../helpers/pagination');
const Leads = db.leads;
const User = db.user;


// List all leads with pagination 
exports.leadsList = async (req, res) => {

    const { page, size } = req.body;
    const { limit, offset } = getPagination(page, size);
    let Searchattributes = { limit, offset };
    const user = req.user.id;
    const user_roles = req.user_roles;
    let userLabel = null;

    try {
        if (user_roles && user_roles.length > 0) {
            const isAdmin = user_roles.some((role) => role.name === 'ADMIN');
            userLabel = isAdmin ? {} : { assigned_to: user };
        }

        Searchattributes = {
            ...Searchattributes,
            order: [['id', 'DESC']],
            where: userLabel,
            distinct: true,
        };

        const leads = await Leads.findAndCountAll(Searchattributes);
        if (leads.length === 0) {
            return res.status(400).json({ success: false, message: 'No Leads found..!' });
        }

        const response = getPagingData(leads, page, limit);
        res.status(200).json({ success: true, data: response, message: 'Leads fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching Leads list..!' });
    }
};

// creation of leads
exports.leadsCreation = async (req, res) => {
    const { first_name, last_name, mobile, email, address, travel_type, ticket_type, assigned_to, group } = req.body;
    const user = req.user;

    try {
        const uniqueEmail = await Leads.findOne({ where: { email } });
        if (uniqueEmail) {
            return res.status(400).json({ success: false, message: 'Email already taken..!' });
        }
        const uniqueMobile = await Leads.findOne({ where: { mobile } });
        if (uniqueMobile) {
            return res.status(400).json({ success: false, message: 'Mobile Number already taken..!' });
        }
        const newLead = await Leads.create({
            first_name,
            last_name,
            mobile,
            email,
            address,
            travel_type,
            ticket_type,
            assigned_to,
            group,
            created_by: user.id,
            updated_by: user.id
        });

        res.status(201).json({ success: true, data: newLead, message: 'User created Successfully..!' });
    } catch (error) {
        console.error('User creation error:', error);
        res.status(500).json({ success: false, message: error.message || 'User creation error..!' });
    }
};

// leads details by Id
exports.leadsDetailsById = async (req, res) => {
    const id = req.params.id;

    try {
        const leadDetails = await Leads.findOne({
            where: {
                id,
                status: {
                    [Op.ne]: 'DELETED',
                },
            },
        });
        if (leadDetails === null) {
            return res.status(400).json({ success: false, message: 'Lead not found..!' });
        }

        res.status(200).json({ success: true, data: leadDetails, message: 'Lead fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching the Lead details..!' });
    }
};
// leads Updation by Id
exports.leadsUpdation = async (req, res) => {
    const { first_name, last_name, mobile, email, address } = req.body;
    const id = req.params.id;
    const user = req.user;

    try {
        const userData = await Leads.findByPk(id, { attributes: { exclude: ['password'] } });

        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found..!' });
        }

        if (email) {
            const existingEmail = await Leads.findOne({ where: { email: email } });
            if (existingEmail && existingEmail.id !== parseInt(id)) {
                return res.status(404).json({
                    success: false,
                    message: 'The email already exist, provide another one..!',
                });
            }
        }
        if (mobile) {
            const existingMobile = await Leads.findOne({ where: { mobile: mobile } });
            if (existingMobile && existingMobile.id !== parseInt(id)) {
                return res.status(404).json({
                    success: false,
                    message: 'The phone number already exist, provide another one..!',
                });
            }
        }
        const updateData = {
            first_name,
            last_name,
            mobile,
            email,
            address,
            updated_by: user.id
        };
        const [updatedRows] = await Leads.update(updateData, { where: { id } });

        if (!updatedRows) {
            return res.status(400).json({ success: false, message: 'Update failed..!' });
        }
        const leadDetails = await Leads.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        res.status(201).json({ success: true, data: leadDetails, message: 'Lead updated Successfully..!' });
    } catch (error) {
        console.error('Lead updation error:', error);
        res.status(500).json({ success: false, message: error.message || 'Lead updation error..!' });
    }
};

// leads Deletion by Id
exports.leadsDeletion = async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    try {
        const lead = await Leads.findByPk(id);
        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found..!' });
        }

        const deletionData = {
            status: 'DELETED',
            updated_by: user.id,
        };

        const [deletedRows] = await Leads.update(deletionData, { where: { id } });
        if (!deletedRows) {
            return res.status(400).json({ success: false, message: 'Error deleting lead..!' });
        }
        res.status(200).json({ success: true, message: 'Lead deleted Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error deleting lead..!' });
    }
};