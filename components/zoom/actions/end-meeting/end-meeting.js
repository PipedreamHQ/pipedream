const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-end-meeting",
    name: "End Meeting",
    description: "End a meeting for a user",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        event: {
            label: "Event",
            type: "string",
            description: "Name of the event. ",
            optional: true,
            default: ""
        },
        payload: {
            label: "Payload",
            type: "object",
            description: `See documentation for more information: https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-ending JSON example:
            {
                "account_id": "The account ID of the meeting host",
                "object": {"See documentation for more information"}
            }
            `,
            optional: true,
            default: ""
        }
        // @todo: add props
    },
    async run() {
        // @todo: add action logic
    }
}