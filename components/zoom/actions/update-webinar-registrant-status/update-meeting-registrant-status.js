const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-update-webinar-registrant-status",
    name: "Update webinar registrant status",
    description: "Update registrant status for a webinar",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        meetingId: {
            label: "MeetingId",
            type: "integer",
            description: "The meeting ID",
            optional: false,
            default: ""
            // @todo use and async options to pull MeetingId
        },
        occurrenceIds: {
            label: "Occurrence ids",
            type: "string",
            description: "Occurrence ID",
            optional: true,
            default: ""
            // @todo use and async options to pull occurrenceIds 
        },
        action: {
            label: "Action",
            type: "string",
            description: "Used to approve a registrant, deny a registrant, or cancel a previously approved registrant. ",
            optional: false,
            default: ""
        },
        registrants: {
            label: "Registrants",
            type: "any",
            description: `List of registrants JSON Example: 
            '[{"id": "Registrant ID", "email": "Registrant's email address"}]'`,
            optional: true,
            default: ""
        }

    },
    async run() {
        // @todo: add action logic
    }
}