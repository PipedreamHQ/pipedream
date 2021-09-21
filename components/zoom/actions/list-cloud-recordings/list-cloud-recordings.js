const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-list-cloud-recordings",
    name: "List Cloud Recordings",
    description: "Search cloud recordings from a meeting or webinar",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        userId: {
            label: "UserId",
            type: "string",
            description: "The user ID ",
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
        nextPageToken: {
            label: "Next page token",
            type: "string",
            description: "The next page token is used to paginate through large result sets. A next page token will be returned whenever the set of available results exceeds the current page size. The expiration period for this token is 15 minutes.",
            optional: true,
            default: ""
        },
        mc: {
            label: "Mc",
            type: "string",
            description: "Query Metadata of Recording if an On-Premise Meeting Connector was used for the meeting.",
            optional: true,
            default: ""
        },
        trash: {
            label: "Trash",
            type: "boolean",
            description: "Query trash.\n'true': List recordings from trash.<br> 'false': Do not list recordings from the trash.<br> The default value is 'false'. If you set it to 'true', you can use the 'trash_type' property to indicate the type of Cloud recording that you need to retrieve. ",
            optional: true,
            default: ""
        },
        from: {
            label: "From",
            type: "string",
            description: "The start date in 'yyyy-mm-dd' UTC format for the date range for which you would like to retrieve recordings. The maximum range can be a month. If no value is provided for this field, the default will be current date.",
            optional: true,
            default: ""
        },
        to: {
            label: "To",
            type: "string",
            description: "End date in 'yyyy-mm-dd' 'yyyy-mm-dd' UTC format. ",
            optional: true,
            default: ""
        },
        trashType: {
            label: "Trash type",
            type: "string",
            description: "The type of Cloud recording that you would like to retrieve from the trash. The value can be one of the following:<br>\n    'meeting_recordings': List all meeting recordings from the trash.<br>\n    'recording_file': List all individual recording files from the trash. ",
            optional: true,
            default: ""
        }
        // @todo: add props
    },
    async run() {
        // @todo: add action logic
    }
}