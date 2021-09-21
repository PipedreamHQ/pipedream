const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-update-meeting-registrant-status",
    name: "Update meeting registrant status",
    description: "Update registrant status for a meeting",
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
        occurrenceId: {
            label: "Occurrence id",
            type: "string",
            description: "The meeting occurrence ID.",
            optional: true,
            default: ""
            // @todo use and async options to pull occurrenceId
        },
        action: {
            label: "Action",
            type: "string",
            description: `Registrant Status:
            approve - Approve registrant.
            cancel - Cancel previously approved registrant's registration.
            deny - Deny registrant.`,
            options: [
                "approve",
                "cancel",
                "deny"
            ],
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
        // @todo: add props
    },
    async run() {
        // @todo: add action logic
    }
}