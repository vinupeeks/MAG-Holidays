const { where, Op } = require('sequelize');
const db = require('../models/index');
const { getPagination, getPagingData } = require('../helpers/pagination');
const moment = require('moment');
const Leads = db.leads;
const User = db.user;
const Status = db.status;
const TourPackages = db.tourPackages;
const Members = db.members;


// List all leads with pagination 
exports.leadsList = async (req, res) => {
    try {
        const { page, size, ...searchParams } = req.body || {};
        const { limit, offset } = getPagination(page, size);
        let Searchattributes = { limit, offset };
        const user = req.user.id;
        const user_roles = req.user_roles;

        const whereCondition = { status: 'ACTIVE' };
        const {
            first_name,
            mobile,
            email,
            age,
            address,
            travel_type,
            ticket_type,
            assigned_to,
            leader,
            lead_status,
            package_id,
            status_id,
            travel_with_in,
            travel_from_date,
            travel_to_date
        } = searchParams;

        if (first_name) whereCondition.first_name = { [Op.like]: `%${first_name}%` };
        if (mobile) whereCondition.mobile = { [Op.like]: `%${mobile}%` };
        if (email) whereCondition.email = { [Op.like]: `%${email}%` };
        if (age) whereCondition.age = age;
        if (address) whereCondition.address = { [Op.like]: `%${address}%` };
        if (travel_type) whereCondition.travel_type = travel_type;
        if (ticket_type) whereCondition.ticket_type = ticket_type;
        if (assigned_to) whereCondition.assigned_to = assigned_to;
        if (leader) whereCondition.leader = leader;
        if (lead_status) whereCondition.lead_status = lead_status;
        if (package_id) whereCondition.package_id = package_id;
        if (status_id) whereCondition.status_id = status_id;
        if (travel_with_in) whereCondition.travel_with_in = travel_with_in;
        if (travel_from_date) whereCondition.travel_from_date = travel_from_date;
        if (travel_to_date) whereCondition.travel_to_date = travel_to_date;

        let includeOption = null;

        if (user_roles && user_roles.length > 0) {
            const isAdmin = user_roles.some((role) => role.name === 'ADMIN');

            if (isAdmin) {
                includeOption = [
                    { model: User, as: 'assignedTo', attributes: ['id', 'username', 'name'] },
                    { model: Status, as: 'statusId', attributes: ['id', 'name', 'label'] },
                    { model: TourPackages, as: 'packageId', attributes: ['id', 'name', 'place'] }
                ];
            } else {
                whereCondition.assigned_to = user;
            }
        }

        Searchattributes = {
            ...Searchattributes,
            order: [['id', 'DESC']],
            where: {
                ...whereCondition,
                // [Op.or]: [{ mag_id: null }, { leader: 'YES' }]
            },
            include: includeOption || { model: Status, as: 'statusId', attributes: ['id', 'name', 'label'] },
            distinct: true,
        };

        const leads = await Leads.findAndCountAll(Searchattributes);
        if (!leads.rows || leads.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'No Leads found..!' });
        }

        const response = getPagingData(leads, page, limit);
        res.status(200).json({ success: true, data: response, message: 'Leads fetched Successfully..!' });
    } catch (error) {
        console.error("Error in leadsList:", error);
        res.status(500).json({ success: false, message: error.message || 'Error fetching Leads list..!' });
    }
};

// creation of leads
exports.leadsCreation = async (req, res) => {
    const { first_name, last_name, mobile, email, age, address, travel_type, ticket_type, assigned_to, package_id, status_id, travel_with_in, travel_from_date, travel_to_date } = req.body;
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
            age,
            address,
            travel_type,
            ticket_type,
            assigned_to,
            package_id,
            status_id,
            travel_with_in,
            travel_from_date,
            travel_to_date,
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
                    [Op.eq]: 'ACTIVE',
                },
            },
            include: [
                {
                    model: User,
                    as: 'assignedTo',
                    attributes: ['id', 'name', 'email', 'mobile'],
                },
                {
                    model: TourPackages,
                    as: 'packageId',
                },
                {
                    model: Status,
                    as: 'statusId',
                    attributes: ['id', 'name', 'label'],
                },
                {
                    model: Members,
                }
            ],
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
    const { first_name, last_name, mobile, email, age, address, travel_type, ticket_type, assigned_to, lead_status, status, package_id, status_id, travel_with_in, travel_from_date, travel_to_date } = req.body;
    const id = req.params.id;
    const user = req.user;

    try {
        const userData = await Leads.findByPk(id);
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
            age,
            address,
            travel_type,
            ticket_type,
            assigned_to,
            lead_status,
            package_id: package_id || '',
            status_id: status_id,
            travel_with_in: travel_with_in || '',
            travel_from_date: travel_from_date || '',
            travel_to_date: travel_to_date || '',
            status,
            updated_by: user.id
        };
        const [updatedRows] = await Leads.update(updateData, { where: { id } });
        if (!updatedRows) {
            return res.status(400).json({ success: false, message: 'Update failed..!' });
        }
        const leadDetails = await Leads.findByPk(id);
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

// // Group Leads creation
exports.groupLeadsCreation = async (req, res) => {
    const leadsList = req.body.leads;
    const user = req.user;

    try {
        if (!Array.isArray(leadsList) || leadsList.length === 0) {
            return res.status(400).json({ message: "Invalid leads data." });
        }
        const leaderData = leadsList.find(lead => lead.leader === "YES");
        if (!leaderData) {
            return res.status(400).json({ message: "No leader found in the provided leads." });
        }

        const leader = await Leads.create({
            ...leaderData,
            created_by: user.id,
            updated_by: user.id
        });
        const membersData = leadsList.filter(lead => lead.leader !== "YES");

        const members = membersData.map(member => ({
            ...member,
            leader_id: leader.id,
            created_by: user.id,
            updated_by: user.id
        }));

        if (members.length > 0) {
            await Members.bulkCreate(members);
        }
        return res.status(201).json({ success: true, message: "Leads and members saved successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error saving group list..!' });
    }
};

// group members list using leader ID
exports.getGroupMembers = async (req, res) => {
    const leaderId = req.params.id;

    try {
        if (!leaderId) {
            return res.status(400).json({ message: "leaderId is required" });
        }
        const leaderDetails = await Leads.findOne({ where: { id: leaderId } });
        if (!leaderDetails.leader === 'YES') {
            return res.status(400).json({ message: "The provided leaderId is not a leader" });
        }
        const members = await Members.findAndCountAll({ where: { leader_id: leaderId } });
        if (members.length === 0) {
            return res.status(404).json({ message: "No members found for this leader" });
        }

        res.status(201).json({ success: true, data: members, message: 'Leads members fetched successfully..!' });
    } catch (error) {
        console.error('Leads members fetch error:', error);
        res.status(500).json({ success: false, message: error.message || 'Error in leads members fetching..!' });
    }
};
