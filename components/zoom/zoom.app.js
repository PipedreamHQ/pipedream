const {
  filterEmptyRequestFields,
  makeQueryParams,
} = require("./utils");

module.exports = {
  type: "app",
  app: "zoom",
  methods: {
    makeQueryParams,
    filterEmptyRequestFields,
    /**
     * @param {String} requestUrl URL relative to zoom api root:   
     * https://api.zoom.us/v2  
     * including query params  
     * 
     * @param {String} method HTTP method
     * @param {Object} data Request body
     */
    makeRequestConfig(requestUrl, method="get", data) {
      return {
        method,
        url: `https://api.zoom.us/v2${requestUrl}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        data,
      };
    }, // end makeRequestConfig
  }
};