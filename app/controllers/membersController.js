const { Op } = require('sequelize');
const db = require('../models/index');
const { getPagination, getPagingData } = require('../helpers/pagination'); 
const Leads = db.leads; 
const Status = db.status; 
const Members = db.members; 


// List all leads with pagination 
exports.membersList = async (req, res) => {
    const leaderId = req.params.id;

    try {
        if (!leaderId) {
            return res.status(400).json({ success: false, message: "leaderId is required" });
        }
        const leaderDetails = await Leads.findOne({ where: { id: leaderId, } });

        if (leaderDetails === null || !leaderDetails.leader === 'YES') {
            return res.status(400).json({ success: false, message: "The provided leaderId is not a leader" });
        }
        const members = await Members.findAndCountAll({ where: { lead_id: leaderId, status: { [Op.ne]: 'DELETED', } } });
        if (members.length === 0) {
            return res.status(404).json({ success: false, message: "No members found for this leader" });
        }

        res.status(201).json({ success: true, data: members, message: 'Leads members fetched successfully..!' });
    } catch (error) {
        console.error('Leads members fetch error:', error);
        res.status(500).json({ success: false, message: error.message || 'Error in leads members fetching..!' });
    }
};

// leads details by Id
exports.membersDetailsById = async (req, res) => {
    const id = req.params.id;

    try {
        const memberDetails = await Members.findOne({
            where: {
                id, status: { [Op.eq]: 'ACTIVE', },
            },
            include: [{
                model: Leads,
                as: 'leaderId',
                attributes: ['id', 'first_name', 'last_name', 'email', 'mobile'],
            },
            {
                model: Status,
                as: 'statusId',
                attributes: ['id', 'name', 'label'],
            }],
        });
        if (!memberDetails) {
            return res.status(400).json({ success: false, message: 'Member not found..!' });
        }
        res.status(200).json({ success: true, data: memberDetails, message: 'Member fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching the Member details..!' });
    }
};

// leads Updation by Id
exports.membersUpdation = async (req, res) => {
    const { lead_id, travel_details_id, first_name, last_name, mobile, email, age, address, assigned_to, member_status, status_id, status } = req.body;
    const id = req.params.id;
    const user = req.user;

    try {
        const memberData = await Members.findByPk(id);
        if (!memberData) {
            return res.status(404).json({ success: false, message: 'Member not found..!' });
        }

        if (email) {
            const existingEmail = await Members.findOne({ where: { email, id: { [Op.ne]: id } } });
            if (existingEmail) {
                 return res.status(400).json({ success: false, message: 'The email already exists, provide another one..!' });
            }
        }

        if (mobile) {
            const existingMobile = await Members.findOne({ where: { mobile, id: { [Op.ne]: id } } });
            if (existingMobile) { 
                return res.status(400).json({ success: false, message: 'The phone number already exists, provide another one..!' });
            }
        }

        const updateData = {
            lead_id,
            travel_details_id,
            first_name,
            last_name,
            mobile,
            email,
            age,
            address,
            assigned_to,
            member_status,
            status_id: status_id,
            status,
            updated_by: user.id,
        };

        const [updatedRows] = await Members.update(updateData, { where: { id } });
        if (!updatedRows) {
            return res.status(400).json({ success: false, message: 'Update failed..!' });
        }
        const updatedMember = await Members.findByPk(id);
        res.status(201).json({ success: true, data: updatedMember, message: 'Member updated Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Member updation error..!' });
    }
};

// leads Deletion by Id
exports.membersDeletion = async (req, res) => {
    const id = req.params.id;
    const user = req.user;

    try {
        const memberDetails = await Members.findByPk(id);
        if (!memberDetails) {
            return res.status(404).json({ success: false, message: 'Member not found..!' });
        }

        const deletionData = {
            status: 'INACTIVE',
            updated_by: user.id,
        };
        const [deletedRows] = await Members.update(deletionData, { where: { id } });
        if (!deletedRows) {
            return res.status(400).json({ success: false, message: 'Error deleting member..!' });
        }
        res.status(200).json({ success: true, message: 'Member deleted Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error deleting Member..!' });
    }
};
