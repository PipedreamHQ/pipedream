const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-delete-webinar",
    name: "Delete Webinar",
    description: "Remove a webinar for a user",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        webinarId: {
            label: "WebinarId",
            type: "integer",
            description: "The webinar ID",
            optional: false,
            default: ""
            // @todo use and async options to pull webinarID 
        },
        occurrenceId: {
            label: "Occurrence id",
            type: "string",
            description: "The meeting occurrence ID.",
            optional: true,
            default: ""
            // @todo use and async options to pull occurrenceIds 
        },
        cancelWebinarReminder: {
            label: "Cancel webinar reminder",
            type: "string",
            description: "'true': Notify panelists and registrants about the webinar cancellation via email. \n\n'false': Do not send any email notification to webinar registrants and panelists.",
            optional: true,
            default: "false"
        }
    },
    async run() {
        // @todo: add action logic
    }
}