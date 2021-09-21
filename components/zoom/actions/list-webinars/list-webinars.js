const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-list-webinars",
    name: "List Webinars",
    description: "List all webinars of a user",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        userId: {
            label: "UserId",
            type: "string",
            description: "The user ID",
            optional: false,
            default: ""
            // @todo use and async options to pull userId 
        },
        pageSize: {
            label: "Page size",
            type: "integer",
            description: "The number of records returned within a single API call.",
            optional: true,
            default: ""
        },
        pageNumber: {
            label: "Page number",
            type: "integer",
            description: "\n**Deprecated** - This field has been deprecated and we will stop supporting it completely in a future release. ",
            optional: true,
            default: ""
        }
    },
    async run() {
        const queryParams = this.zoom.makeQueryParams({
            page_size: this.pageSize,
            page_number: this.pageNumber
        });
      
        const requestConfig = this.zoom.makeRequestConfig(
            `/users/${this.userId}/webinars${queryParams}`,
            "get",
            ""
        );
      
        try {
            let response = await axios(this, requestConfig);
            return response;
        } catch (error) {
            return error.response.data;
        } 
    }
}