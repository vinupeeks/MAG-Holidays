const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

const getPagingData = (data, page, limit, dataItems = null) => {

    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    const currentPageItems = items.length
    if (dataItems !== null) {

        return { totalItems, totalPages, currentPage, dataItems, currentPageItems };
    } else {
        return { totalItems, items, totalPages, currentPage, currentPageItems };
    }

};

const getGroupPagingData = (totalItems, data, page, limit) => {
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page ? +page : 0;
    const items = data?.rows
    return { totalItems, items, totalPages, currentPage };
};

module.exports = { getPagination, getPagingData, getGroupPagingData };