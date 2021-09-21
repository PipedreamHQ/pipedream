const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-list-meeting-registrants",
    name: "List Meeting Registrants",
    description: "List all registrants of a meeting",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        meetingId: {
            label: "MeetingId",
            type: "integer",
            description: "The meeting ID ",
            optional: false,
            default: ""
            // @todo use and async options to pull meetingId
        },
        occurrenceId: {
            label: "Occurrence id",
            type: "string",
            description: "The meeting occurrence ID.",
            optional: true,
            default: ""
            // @todo use and async options to pull occurrenceId
        },
        status: {
            label: "Status",
            type: "string",
            description: "The registrant status:<br>'pending' - Registrant's status is pending.<br>'approved' - Registrant's status is approved.<br>'denied' - Registrant's status is denied.",
            optional: true,
            default: ""
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
            description: "\n**Deprecated** - This field has been deprecated and we will stop supporting it completely in a future release.",
            optional: true,
            default: ""
        },
        nextPageToken: {
            label: "Next page token",
            type: "string",
            description: "The next page token is used to paginate through large result sets. A next page token will be returned whenever the set of available results exceeds the current page size. The expiration period for this token is 15 minutes.",
            optional: true,
            default: ""
        }
    },
    async run() {
        const queryParams = this.zoom.makeQueryParams({
            occurrence_id: this.occurrenceId,
            status: this.status,
            page_size: this.pageSize,
            page_number: this.pageNumber,
            next_page_token: this.nextPageToken
        });
      
        const requestConfig = this.zoom.makeRequestConfig(
            `/meetings/${this.meetingId}/registrants${queryParams}`,
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