const { Op } = require('sequelize');
const db = require('../models/index');
const { getPagination, getPagingData } = require('../helpers/pagination'); 
const Leads = db.leads;
const User = db.user;
const Status = db.status;
const TourPackages = db.tourPackages;
const Members = db.members;
const TravelDetails = db.travelDetails;
const TravelType = db.travelType;


// List all leads with pagination 
exports.leadsList = async (req, res) => {
    try {
        const { page, size, ...searchParams } = req.body || {};
        const { limit, offset } = getPagination(page, size);
        let Searchattributes = { limit, offset };
        const user = req.user.id;
        const user_roles = req.user_roles;

        const whereCondition = { status: 'ACTIVE' };
        const travelWhereCondition = {};

        const {
            first_name, mobile, email, age, address,
            assigned_to, leader, lead_status, status_id,

            travel_type, ticket_type, package_id, travel_with_in,
            travel_from_date, travel_to_date

        } = searchParams;

        if (first_name) whereCondition.first_name = { [Op.like]: `%${first_name}%` };
        if (mobile) whereCondition.mobile = { [Op.like]: `%${mobile}%` };
        if (email) whereCondition.email = { [Op.like]: `%${email}%` };
        if (age) whereCondition.age = age;
        if (address) whereCondition.address = { [Op.like]: `%${address}%` };
        if (assigned_to) whereCondition.assigned_to = assigned_to;
        if (leader) whereCondition.leader = leader;
        if (lead_status) whereCondition.lead_status = lead_status;
        if (status_id) whereCondition.status_id = status_id;

        if (travel_type) travelWhereCondition.travel_type = travel_type;
        if (ticket_type) travelWhereCondition.ticket_type = ticket_type;
        if (package_id) travelWhereCondition.package_id = package_id;
        if (travel_with_in) travelWhereCondition.travel_with_in = travel_with_in;

        if (travel_from_date && travel_from_date.start && travel_from_date.end) {
            travelWhereCondition.travel_from_date = {
                [Op.gte]: travel_from_date.start,
                [Op.lte]: `${travel_from_date.end}T23:59:59.999Z`
            };
        }
        if (travel_to_date && travel_to_date.start && travel_to_date.end) {
            travelWhereCondition.travel_to_date = {
                [Op.gte]: travel_to_date.start,
                [Op.lte]: `${travel_to_date.end}T23:59:59.999Z`
            };
        }
        let includeOption = [
            { model: User, as: 'assignedTo', attributes: ['id', 'username', 'name'] },
            { model: Status, as: 'statusId', attributes: ['id', 'name', 'label'] }
        ];

        if (Object.keys(travelWhereCondition).length > 0) {
            includeOption.push({
                model: TravelDetails,
                required: true,
                where: travelWhereCondition,
                include: [
                    { model: TravelType, as: 'travelId', attributes: ['id', 'name'] },
                    { model: TourPackages, as: 'packageId', attributes: ['id', 'name', 'place'] }
                ],
            });
        } else {
            includeOption.push({
                model: TravelDetails,
                include: [
                    { model: TravelType, as: 'travelId', attributes: ['id', 'name'] },
                    { model: TourPackages, as: 'packageId', attributes: ['id', 'name', 'place'] }
                ],
            });
        }

        if (user_roles && user_roles.length > 0) {
            const isAdmin = user_roles.some((role) => role.name === 'ADMIN');
            if (!isAdmin) {
                whereCondition.assigned_to = user;
            }
        }

        Searchattributes = {
            ...Searchattributes,
            order: [['id', 'DESC']],
            where: whereCondition,
            include: includeOption,
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
            assigned_to,
            status_id,
            created_by: user.id,
            updated_by: user.id
        });
        const lead_id = newLead.id;
        const newTravelDetails = await TravelDetails.create({
            lead_id,
            travel_type,
            ticket_type,
            travel_with_in,
            travel_from_date,
            travel_to_date,
            package_id,
            created_by: user.id,
            updated_by: user.id
        })
        const mergedData = { ...newLead, ...newTravelDetails }

        res.status(201).json({ success: true, data: mergedData, message: 'User created Successfully..!' });
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
                    model: Status,
                    as: 'statusId',
                    attributes: ['id', 'name', 'label'],
                },
                {
                    model: TravelDetails,
                    include: [
                        {
                            model: TravelType,
                            as: 'travelId',
                            attributes: ['id', 'name', 'label'],
                        },
                        {
                            model: TourPackages,
                            as: 'packageId',
                        },
                    ],
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
    const { first_name, last_name, mobile, email, age, address, leader, travel_type,
        ticket_type, assigned_to, lead_status, status, package_id, status_id, travel_with_in,
        travel_from_date, travel_to_date } = req.body;
    const id = req.params.id;
    const user = req.user;

    const transaction = await db.sequelize.transaction();

    try {
        const userData = await Leads.findByPk(id, { transaction });

        if (!userData) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'User not found..!' });
        }

        if (email) {
            const existingEmail = await Leads.findOne({ where: { email, id: { [Op.ne]: id } }, transaction });
            if (existingEmail) {
                await transaction.rollback();
                return res.status(400).json({ success: false, message: 'The email already exists, provide another one..!' });
            }
        }

        if (mobile) {
            const existingMobile = await Leads.findOne({ where: { mobile, id: { [Op.ne]: id } }, transaction });
            if (existingMobile) {
                await transaction.rollback();
                return res.status(400).json({ success: false, message: 'The phone number already exists, provide another one..!' });
            }
        }

        const updateData = {
            first_name,
            last_name,
            mobile,
            email,
            age,
            address,
            assigned_to,
            leader,
            lead_status,
            status_id: status_id,
            status,
            updated_by: user.id,
        };

        const [updatedRows] = await Leads.update(updateData, { where: { id }, transaction });
        if (!updatedRows) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: 'Update failed..!' });
        }

        if (travel_type || ticket_type || package_id || travel_with_in || travel_from_date || travel_to_date) {
            const travelUpdateData = {
                travel_type,
                ticket_type,
                package_id: package_id || '',
                travel_with_in: travel_with_in || '',
                travel_from_date: travel_from_date || '',
                travel_to_date: travel_to_date || '',
                updated_by: user.id,
            };
            const existingTravel = await TravelDetails.findOne({ where: { lead_id: id }, transaction });

            if (existingTravel) {
                await TravelDetails.update(travelUpdateData, { where: { lead_id: id }, transaction });
            } else {
                await TravelDetails.create({ ...travelUpdateData, lead_id: id }, { transaction });
            }
        }
        if (lead_status || status_id || assigned_to || status) {
            const data = {
                assigned_to,
                member_status: lead_status,
                status_id,
                status
            }
            const memberStatusUpdation = await Members.update(data, { where: { lead_id: id }, transaction });
        }
        await transaction.commit();
        const leadDetails = await Leads.findByPk(id, { include: TravelDetails });

        res.status(201).json({ success: true, data: leadDetails, message: 'Lead updated Successfully..!' });
    } catch (error) {
        await transaction.rollback();
        console.log(error);

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
    const leadsList = req.body;
    const user = req.user;
    const t = await db.sequelize.transaction();

    try {
        if (!Array.isArray(leadsList) || leadsList.length === 0) {
            return res.status(400).json({ message: "Invalid leads data." });
        }

        const leaderData = leadsList.find(lead => lead.leader === "YES");
        if (!leaderData) {
            return res.status(400).json({ message: "No leader found in the provided leads." });
        }

        const membersData = leadsList.filter(lead => lead.leader !== "YES");
        const existingLeader = await Leads.findOne({
            where: {
                [Op.or]: [
                    { email: leaderData.email }, { mobile: leaderData.mobile }
                ],
            },
            transaction: t
        });

        if (existingLeader) {
            let errorMessage = "Leader data conflict:";
            if (existingLeader.email === leaderData.email) {
                errorMessage += ` Email '${leaderData.email}' is already taken.`;
            }
            if (existingLeader.mobile === leaderData.mobile) {
                errorMessage += ` Mobile '${leaderData.mobile}' is already taken.`;
            }
            return res.status(400).json({ success: false, message: errorMessage });
        }

        const memberEmails = membersData.map(member => member.email);
        const memberMobiles = membersData.map(member => member.mobile);

        const existingMembers = await Members.findAll({
            where: {
                [Op.or]: [
                    { email: { [Op.in]: memberEmails } }, { mobile: { [Op.in]: memberMobiles } }
                ],
            },
            transaction: t
        });
        if (existingMembers.length > 0) {
            let existingEmails = existingMembers.map(mem => mem.email).filter(email => memberEmails.includes(email));
            let existingMobiles = existingMembers.map(mem => mem.mobile).filter(mobile => memberMobiles.includes(mobile));

            let errorMessage = "Member data conflict:";
            if (existingEmails.length > 0) {
                errorMessage += ` Emails (${existingEmails.join(", ")}) are already taken.`;
            }
            if (existingMobiles.length > 0) {
                errorMessage += ` Mobile numbers (${existingMobiles.join(", ")}) are already taken.`;
            }
            return res.status(400).json({ success: false, message: errorMessage });
        }


        const newLead = await Leads.create({
            first_name: leaderData.first_name,
            last_name: leaderData.last_name,
            mobile: leaderData.mobile,
            email: leaderData.email,
            age: leaderData.age,
            address: leaderData.address,
            assigned_to: leaderData.assigned_to,
            leader: leaderData.leader,
            status_id: leaderData.status_id,
            created_by: user.id,
            updated_by: user.id
        },
            { transaction: t }
        );

        const newTravelDetails = await TravelDetails.create({
            lead_id: newLead.id,
            travel_type: leaderData.travel_type,
            ticket_type: leaderData.ticket_type,
            travel_with_in: leaderData.travel_with_in,
            travel_from_date: leaderData.travel_from_date,
            travel_to_date: leaderData.travel_to_date,
            package_id: leaderData.package_id || null,
            created_by: user.id,
            updated_by: user.id
        },
            { transaction: t }
        )

        const membersToCreate = membersData.map(member => ({
            lead_id: newLead.id,
            travel_details_id: newTravelDetails.id,
            first_name: member.first_name,
            last_name: member.last_name,
            mobile: member.mobile,
            email: member.email,
            age: member.age || null,
            address: member.address || null,
            assigned_to: member.assigned_to || null,
            member_status: member.member_status || "HOT",
            status_id: member.status_id || null,
            status: member.status || "ACTIVE",
            created_by: user.id,
            updated_by: user.id
        }));
        if (membersToCreate.length > 0) {
            await Members.bulkCreate(membersToCreate, { transaction: t });
        }
        await t.commit();

        return res.status(201).json({ success: true, message: "Leads and members saved successfully." });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, message: error.message || 'Error saving group list..!' });
    }
};


// group members list using leader ID
exports.getGroupMembers = async (req, res) => {
    const leaderId = req.params.id;

    try {
        if (!leaderId) {
            return res.status(400).json({ success: false, message: "leaderId is required" });
        }
        const leaderDetails = await Leads.findOne({ where: { id: leaderId } });
        if (leaderDetails === null || !leaderDetails.leader === 'YES') {
            return res.status(400).json({ success: false, message: "The provided leaderId is not a leader" });
        }

        const members = await Members.findAndCountAll({ where: { lead_id: leaderId } });
        if (members.length === 0) {
            return res.status(404).json({ success: false, message: "No members found for this leader" });
        }

        res.status(201).json({ success: true, data: members, message: 'Leads members fetched successfully..!' });
    } catch (error) {
        console.error('Leads members fetch error:', error);
        res.status(500).json({ success: false, message: error.message || 'Error in leads members fetching..!' });
    }
};
