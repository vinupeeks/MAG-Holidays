const db = require('../models/index');
const { getPagination, getPagingData } = require('../helpers/pagination');
const { where, Op } = require('sequelize');
const Branches = db.branches;


// branch list
exports.branchesList = async (req, res) => {
    const { page, size } = req.body;
    const { limit, offset } = getPagination(page, size);
    let Searchattributes = { limit, offset };
    try {
        const branches = await Branches.findAndCountAll({
            ...Searchattributes,
            where: { status: 'ACTIVE' },
        })
        if (branches.length === 0) {
            return res.status(400).json({ success: false, message: 'No Branches found..!' });
        }

        const response = getPagingData(branches, page, limit);
        res.status(200).json({ success: true, data: response, message: 'Branches fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching the branch details..!' });
    }
};

// branch creation
exports.branchesCreation = async (req, res) => {
    const { name, location, mobile, email, address } = req.body;
    const user = req.user;

    try {
        const newBranch = await Branches.create({
            name,
            location,
            mobile,
            email,
            address,
            created_by: user.id,
            updated_by: user.id
        });

        res.status(201).json({ success: true, data: newBranch, message: 'Branch created Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error creating the branch details..!' });
    }
};

// branch details by  branch ID
exports.branchesDetailsById = async (req, res) => {
    const id = req.params.id;

    try {
        const branch = await Branches.findOne({
            where: { id: id, status: 'ACTIVE' },
        });
        if (!branch) {
            return res.status(400).json({ success: false, message: 'Branch not found..!' });
        }

        res.status(200).json({ success: true, data: branch, message: 'Branch fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching the branch details..!' });
    }
};

// branch updation by branch ID
exports.branchesUpdation = async (req, res) => {
    const id = req.params.id;
    const { name, location, mobile, email, address } = req.body;
    const user = req.user;

    try {
        const branch = await Branches.findByPk(id);
        if (!branch) {
            return res.status(400).json({ success: false, message: 'Branch not found..!' });
        }

        const updateData = {
            name,
            location,
            mobile,
            email,
            address,
            updated_by: user.id,
        };

        await branch.update(updateData);
        res.status(200).json({ success: true, data: branch, message: 'Branch updated Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error updating the branch details..!' });
    }
};

// branch deletion by branch ID, change status into INACTIVE.
exports.branchesDeletion = async (req, res) => {
    const id = req.params.id;
    const user = req.user;

    try {
        const branch = await Branches.findByPk(id);
        if (!branch) {
            return res.status(400).json({ success: false, message: 'Branch not found..!' });
        }

        const deletionData = {
            status: 'INACTIVE',
            updated_by: user.id,
        };

        const [deletedRows] = await Branches.update(deletionData, { where: { id } });
        if (!deletedRows) {
            return res.status(400).json({ success: false, message: 'Error deleting branch..!' });
        }

        res.status(200).json({ success: true, message: 'Branch deleted Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error deleting branch..!' });
    }
};