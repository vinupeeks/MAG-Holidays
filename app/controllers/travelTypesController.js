const db = require('../models/index');
const { getPagination, getPagingData } = require('../helpers/pagination');
const { where, Op } = require('sequelize');
const TravelTypes = db.travelType;


// Travel Types list
exports.travelTypesList = async (req, res) => {
    const { page, size } = req.body;
    const { limit, offset } = getPagination(page, size);
    let Searchattributes = { limit, offset };
    try {
        const travelTypes = await TravelTypes.findAndCountAll({
            ...Searchattributes,
            where: { status: 'ACTIVE' },
        })
        if (travelTypes.length === 0) {
            return res.status(400).json({ success: false, message: 'No travel types found..!' });
        }

        const response = getPagingData(travelTypes, page, limit);
        res.status(200).json({ success: true, data: response, message: 'Travel types fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching the travel types details..!' });
    }
};

// Travel Types creation
exports.travelTypesCreation = async (req, res) => {
    const { name, label } = req.body;
    const user = req.user;

    try {
        const newTravelTypes = await TravelTypes.create({
            name,
            label,
            created_by: user.id,
            updated_by: user.id
        });

        res.status(201).json({ success: true, data: newTravelTypes, message: 'Travel type created Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Error creating the travel type details..!' });
    }
};

// Travel Types details by  Travel Types ID
exports.travelTypesDetailsById = async (req, res) => {
    const id = req.params.id;

    try {
        const travelTypeDetails = await TravelTypes.findOne({
            where: { id: id, status: 'ACTIVE' },
        });
        if (!travelTypeDetails) {
            return res.status(400).json({ success: false, message: 'Travel type not found..!' });
        }

        res.status(200).json({ success: true, data: travelTypeDetails, message: 'Travel type fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching the travel type details..!' });
    }
};

// Travel Types updation by Travel Types ID
exports.travelTypesUpdation = async (req, res) => {
    const id = req.params.id;
    const { name, label } = req.body;
    const user = req.user;

    try {
        const travelTypeDetails = await TravelTypes.findByPk(id);
        if (!travelTypeDetails) {
            return res.status(400).json({ success: false, message: 'Travel type not found..!' });
        }

        const updateData = {
            name,
            label,
            updated_by: user.id,
        };

        await travelTypeDetails.update(updateData);
        res.status(200).json({ success: true, data: travelTypeDetails, message: 'Travel type updated Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error updating the travel type details..!' });
    }
};

// Travel Types deletion by Travel Types ID, change status into INACTIVE.
exports.travelTypesDeletion = async (req, res) => {
    const id = req.params.id;
    const user = req.user;

    try {
        const travelTypeDetails = await TravelTypes.findByPk(id);
        if (!travelTypeDetails) {
            return res.status(400).json({ success: false, message: 'Travel type not found..!' });
        }

        const deletionData = {
            status: 'INACTIVE',
            updated_by: user.id,
        };

        const [deletedRows] = await TravelTypes.update(deletionData, { where: { id } });
        if (!deletedRows) {
            return res.status(400).json({ success: false, message: 'Error deleting travel type..!' });
        }

        res.status(200).json({ success: true, message: 'Travel type deleted Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error deleting the travel type details..!' });
    }
};