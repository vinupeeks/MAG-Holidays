const { where, Op } = require('sequelize');
const db = require('../models/index');
const { getPagination, getPagingData } = require('../helpers/pagination');
const LeadsFollowUp = db.leadFollowUp;
const Leads = db.leads;


exports.leadsFollowUpList = async (req, res) => {
    try {
        const leadsFollowUps = await LeadsFollowUp.findAll({
        })
        if (leadsFollowUps.length === 0) {
            return res.status(400).json({ success: false, message: 'No leads followups found..!' });
        }

        res.status(200).json({ success: true, data: roles, message: 'Leads followups fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// List all leads with pagination 
exports.leadsFollowUpCreation = async (req, res) => {
    const { lead_id, lead_status, feed_back, } = req.body;
    const id = req.params.id;
    const user = req.user;

    try {
        const leadDetails = await Leads.findOne({
            where: {
                id,
                status: {
                    [Op.eq]: 'ACTIVE',
                },
            },
        });
        if (leadDetails === null) {
            return res.status(400).json({ success: false, message: `Lead not found, you can't create lead followup..!` });
        }

        const newLead = await Leads.create({
            lead_id,
            lead_status,
            feed_back,
            created_by: user.id,
            updated_by: user.id
        });

        res.status(201).json({ success: true, data: newLead, message: 'User created Successfully..!' });

        res.status(200).json({ success: true, data: roles, message: 'Roles fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
