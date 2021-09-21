const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-list-call-logs",
    name: "List call logs",
    description: "List call logs of a user within a month",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        from: {
            label: "From",
            type: "string",
            description: "Start date for the report in 'yyyy-mm-dd' format. Specify a 30 day range using the 'from' and 'to' parameters as the response provides a maximum of a month worth of data per API request.",
            optional: true,
            default: ""
        },
        to: {
            label: "To",
            type: "string",
            description: "End date for the report in 'yyyy-mm-dd' format.",
            optional: true,
            default: ""
        },
        siteId: {
            label: "Site id",
            type: "string",
            description: "Unique identifier of the [site](https://support.zoom.us/hc/en-us/articles/360020809672-Managing-multiple-sites). Use this query parameter if you have enabled multiple sites and would like to filter the response of this API call by call logs of a specific phone site.",
            optional: true,
            default: ""
        },
        qualityType: {
            label: "Quality type",
            type: "string",
            description: "Filter call logs by voice quality. Zoom uses MOS of 3.5 as a general baseline to categorize calls by call quality. A MOS greater than or equal to 3.5 means good quality, while below 3.5 means poor quality. <br><br>The value of this field can be one of the following:<br>\n* 'good': Retrieve call logs of the call(s) with good quality of voice.<br>\n* 'bad': Retrieve call logs of the call(s) with good quality of voice.<br>\n* 'all': Retrieve all call logs without filtering by voice quality. ",
            optional: true,
            default: ""
        },
        pageSize: {
            label: "Page size",
            type: "integer",
            description: "The number of records returned within a single call.",
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
        // @todo: add action logic
    }
}