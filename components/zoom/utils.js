/**
 * Removes empty, undefined and null values from a request object.
 * @param {*} data Request body
 * @returns request body
 */
function filterEmptyRequestFields(data) {
    Object.keys(data).forEach(key => {
        if (data[key] === null || 
            data[key] === undefined ||
            Object.keys(data[key]).length === 0) {
            delete data[key];
        }
    });
    return data;
}

/**
 * takes an object representing query parameters and returns a string  
 * filters out empty, undefined and null values
 * returns an empty string if no query parameters are present
 * @param {Object} params 
 * @returns {String}
 */
 function makeQueryParams(params) {
    
    params = filterEmptyRequestFields(params);
    let queryParams = Object.keys(params).map(key => {
        return `${key}=${params[key]}`;
    }).join('&');

    return queryParams !== "" ? `?${queryParams}` : "";
}

module.exports = {
    filterEmptyRequestFields,
    makeQueryParams,
}