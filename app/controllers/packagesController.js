const db = require('../models/index');
const { getPagination, getPagingData } = require('../helpers/pagination');
const { where, Op } = require('sequelize');
const TourPackages = db.tourPackages;


// TourPackages list
exports.packagesList = async (req, res) => {
    const { page, size } = req.body;
    const { limit, offset } = getPagination(page, size);
    let Searchattributes = { limit, offset };
    try {
        const tourPackages = await TourPackages.findAndCountAll({
            ...Searchattributes,
            where: { status: 'ACTIVE' },
        })
        if (tourPackages.length === 0) {
            return res.status(400).json({ success: false, message: 'No packages found..!' });
        }

        const response = getPagingData(tourPackages, page, limit);
        res.status(200).json({ success: true, data: response, message: 'Packages fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching the package details..!' });
    }
};

// TourPackages creation
exports.packagesCreation = async (req, res) => {
    const { name, place, type, highlights, day, night, amount } = req.body;
    const user = req.user;

    try {
        const newTourPackage = await TourPackages.create({
            name,
            place,
            type,
            highlights,
            day,
            night,
            amount,
            created_by: user.id,
            updated_by: user.id
        });

        res.status(201).json({ success: true, data: newTourPackage, message: 'Package created Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Error creating the package details..!' });
    } 
};

// TourPackages details by  TourPackages ID
exports.packagesDetailsById = async (req, res) => {
    const id = req.params.id;

    try {
        const tourPackage = await TourPackages.findOne({
            where: { id: id, status: 'ACTIVE' },
        });
        if (!tourPackage) {
            return res.status(400).json({ success: false, message: 'Package not found..!' });
        }

        res.status(200).json({ success: true, data: tourPackage, message: 'Package fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching the package details..!' });
    }
};

// TourPackages updation by TourPackages ID
exports.packagesUpdation = async (req, res) => {
    const id = req.params.id;
    const { name, place, type, highlights, day, night, amount } = req.body;
    const user = req.user;

    try {
        const tourPackage = await TourPackages.findByPk(id);
        if (!tourPackage) {
            return res.status(400).json({ success: false, message: 'Package not found..!' });
        }

        const updateData = {
            name,
            place,
            type,
            highlights,
            day,
            night,
            amount,
            updated_by: user.id,
        };

        await tourPackage.update(updateData);
        res.status(200).json({ success: true, data: tourPackage, message: 'Package updated Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error updating the package details..!' });
    }
};

// TourPackages deletion by TourPackages ID, change status into INACTIVE.
exports.packagesDeletion = async (req, res) => {
    const id = req.params.id;
    const user = req.user;

    try {
        const tourPackage = await TourPackages.findByPk(id);
        if (!tourPackage) {
            return res.status(400).json({ success: false, message: 'Package not found..!' });
        }

        const deletionData = {
            status: 'INACTIVE',
            updated_by: user.id,
        };

        const [deletedRows] = await TourPackages.update(deletionData, { where: { id } });
        if (!deletedRows) {
            return res.status(400).json({ success: false, message: 'Error deleting package..!' });
        }

        res.status(200).json({ success: true, message: 'Package deleted Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error deleting package..!' });
    }
};