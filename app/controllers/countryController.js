const db = require('../models/index');
const { getPagination, getPagingData } = require('../helpers/pagination');
const { where, Op } = require('sequelize');
const Country = db.country;


// branch list
exports.countryList = async (req, res) => {
    const { page, size } = req.body;
    const { limit, offset } = getPagination(page, size);
    let Searchattributes = { limit, offset };
    try {
        const countries = await Country.findAndCountAll({
            ...Searchattributes,
            where: { status: 'ACTIVE' },
        })
        if (countries.length === 0) {
            return res.status(400).json({ success: false, message: 'No Countries found..!' });
        }

        const response = getPagingData(countries, page, limit);
        res.status(200).json({ success: true, data: response, message: 'Countries fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching the country details..!' });
    }
};

// branch creation
exports.countryCreation = async (req, res) => {
    const { name, code, icon } = req.body;
    const user = req.user;

    try {
        const newCountry = await Country.create({
            name,
            code,
            icon: icon || '',
            created_by: user.id,
            updated_by: user.id
        });

        res.status(201).json({ success: true, data: newCountry, message: 'Country created Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error creating the country details..!' });
    }
};

// branch details by  branch ID
exports.countryDetailsById = async (req, res) => {
    const id = req.params.id;

    try {
        const country = await Country.findOne({
            where: { id: id, status: 'ACTIVE' },
        });
        if (!country) {
            return res.status(400).json({ success: false, message: 'Country not found..!' });
        }

        res.status(200).json({ success: true, data: country, message: 'Country fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error fetching the country details..!' });
    }
};

// branch updation by branch ID
exports.countryUpdation = async (req, res) => {
    const id = req.params.id;
    const { name, code, icon } = req.body;
    const user = req.user;

    try {
        const country = await Country.findByPk(id);
        if (!country) {
            return res.status(400).json({ success: false, message: 'Country not found..!' });
        }

        const updateData = {
            name,
            code,
            icon,
            updated_by: user.id,
        };

        await country.update(updateData);
        res.status(200).json({ success: true, data: country, message: 'Country updated Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error updating the country details..!' });
    }
};

// branch deletion by branch ID, change status into INACTIVE.
exports.countryDeletion = async (req, res) => {
    const id = req.params.id;
    const user = req.user;

    try {
        const country = await Country.findByPk(id);
        if (!country) {
            return res.status(400).json({ success: false, message: 'Country not found..!' });
        }

        const deletionData = {
            status: 'INACTIVE',
            updated_by: user.id,
        };

        const [deletedRows] = await Country.update(deletionData, { where: { id } });
        if (!deletedRows) {
            return res.status(400).json({ success: false, message: 'Error deleting country..!' });
        }

        res.status(200).json({ success: true, message: 'Country deleted Successfully..!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error deleting country..!' });
    }
};