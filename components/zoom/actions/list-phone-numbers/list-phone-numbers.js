const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-list-phone-numbers",
    name: "List Phone Numbers",
    description: "List all phone numbers owned by a user",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        nextPageToken: {
            label: "Next page token",
            type: "string",
            description: "The next page token is used to paginate through large result sets. A next page token will be returned whenever the set of available results exceeds the current page size. The expiration period for this token is 15 minutes.",
            optional: true,
            default: ""
        },
        type: {
            label: "Type",
            type: "string",
            description: "Query response by number assignment. The value can be one of the following:\n<br>\n'assigned': The number has been assigned to either a user, a call queue, an auto-receptionist or a common area phone in an account. <br>'unassigned': The number is not assigned to anyone.<br>\n'all': Include both assigned and unassigned numbers in the response.<br>\n'byoc': Include Bring Your Own Carrier (BYOC) numbers only in the response.",
            optional: true,
            default: ""
        },
        extensionType: {
            label: "Extension type",
            type: "string",
            description: "The type of assignee to whom the number is assigned. The value can be one of the following:<br>\n'user'<br> 'callQueue'<br> 'autoReceptionist'<br>\n'commonAreaPhone'",
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
        numberType: {
            label: "Number type",
            type: "string",
            description: "The type of phone number. The value can be either 'toll' or 'tollfree'.",
            optional: true,
            default: ""
        },
        pendingNumbers: {
            label: "Pending numbers",
            type: "boolean",
            description: "Include or exclude pending numbers in the response. The value can be either 'true' or 'false'.",
            optional: true,
            default: ""
        },
        siteId: {
            label: "Site id",
            type: "string",
            description: "Unique identifier of the site. Use this query parameter if you have enabled multiple sites and would like to filter the response of this API call by a specific phone site. See [Managing multiple sites](https://support.zoom.us/hc/en-us/articles/360020809672-Managing-multiple-sites) or [Adding a site](https://support.zoom.us/hc/en-us/articles/360020809672-Managing-multiple-sites#h_05c88e35-1593-491f-b1a8-b7139a75dc15) for details.",
            optional: true,
            default: ""
        }
        // @todo: add props
    },
    async run() {
        // @todo: add action logic
    }
}