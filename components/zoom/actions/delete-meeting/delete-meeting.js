const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-delete-meeting",
    name: "Delete Meeting",
    description: "Remove a meeting by ID",
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
            // @todo use and async options to pull occurrenceIds 
        },
        scheduleForReminder: {
            label: "Schedule for reminder",
            type: "boolean",
            description: "'true': Notify host and alternative host about the meeting cancellation via email.\n'false': Do not send any email notification.",
            optional: true,
            default: ""
        },
        cancelMeetingReminder: {
            label: "Cancel meeting reminder",
            type: "string",
            description: "'true': Notify registrants about the meeting cancellation via email. \n\n'false': Do not send any email notification to meeting registrants. ",
            optional: true,
            default: "false"
        }
    },
    async run() {
        // @todo: add action logic
    }
}