const db = require('../models/index');
const { getPagination, getPagingData } = require('../helpers/pagination');
const { where, Op } = require('sequelize');
const Status = db.status;


// status list
exports.statusList = async (req, res) => {
    const { page, size } = req.body;
    const { limit, offset } = getPagination(page, size);
    let Searchattributes = { limit, offset };
    try {
        const statuses = await Status.findAndCountAll({
            ...Searchattributes,
            where: { status: 'ACTIVE' },
        })
        if (statuses.length === 0) {
            return res.status(400).json({ success: false, message: 'No statuses found..!' });
        }

        const response = getPagingData(statuses, page, limit);
        res.status(200).json({ success: true, data: response, message: 'Status fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching the status details..!' });
    }
};

// status creation
exports.statusCreation = async (req, res) => {
    const { name, label } = req.body;
    const user = req.user;

    try {
        const newStatus = await Status.create({
            name,
            label,
            created_by: user.id,
            updated_by: user.id
        });

        res.status(201).json({ success: true, data: newStatus, message: 'Status created Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error creating the status details..!' });
    }
};

// status details by  status ID
exports.statusDetailsById = async (req, res) => {
    const id = req.params.id;

    try {
        const statuses = await Status.findOne({
            where: { id: id, status: 'ACTIVE' },
        });
        if (!statuses) {
            return res.status(400).json({ success: false, message: 'Status not found..!' });
        }

        res.status(200).json({ success: true, data: statuses, message: 'Status fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching the status details..!' });
    }
};

// status updation by status ID
exports.statusUpdation = async (req, res) => {
    const id = req.params.id;
    const { name, label } = req.body;
    const user = req.user;

    try {
        const status = await Status.findByPk(id);
        if (!status) {
            return res.status(400).json({ success: false, message: 'Status not found..!' });
        }

        const updateData = {
            name,
            label,
            updated_by: user.id,
        };

        await status.update(updateData);
        res.status(200).json({ success: true, data: status, message: 'Status updated Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error updating the status details..!' });
    }
};

// status deletion by status ID, change status into INACTIVE.
exports.statusDeletion = async (req, res) => {
    const id = req.params.id;
    const user = req.user;

    try {
        const status = await Status.findByPk(id);
        if (!status) {
            return res.status(400).json({ success: false, message: 'Status not found..!' });
        }

        const deletionData = {
            status: 'INACTIVE',
            updated_by: user.id,
        };

        const [deletedRows] = await Status.update(deletionData, { where: { id } });
        if (!deletedRows) {
            return res.status(400).json({ success: false, message: 'Error deleting status..!' });
        }

        res.status(200).json({ success: true, message: 'Status deleted Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error deleting status..!' });
    }
};