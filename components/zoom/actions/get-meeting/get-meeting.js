const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-get-meeting",
    name: "Get meeting details",
    description: "Retrieves the details of a meeting",
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
            // @todo use and async options to pull meeting list
        },
        occurrenceId: {
            label: "Occurrence id",
            type: "string",
            description: "Meeting Occurrence ID. Provide this field to view meeting details of a particular occurrence of the [recurring meeting](https://support.zoom.us/hc/en-us/articles/214973206-Scheduling-Recurring-Meetings).",
            optional: true,
            default: ""
            // @todo use and async options to pull meeting occurrenceId list
        },
        showPreviousOccurrences: {
            label: "Show previous occurrences",
            type: "boolean",
            description: "Set the value of this field to 'true' if you would like to view meeting details of all previous occurrences of a [recurring meeting](https://support.zoom.us/hc/en-us/articles/214973206-Scheduling-Recurring-Meetings). ",
            optional: true,
            default: ""
        }
    },
    async run() {
        const queryParams = this.zoom.makeQueryParams({
            occurrence_id : this.occurrenceId,
            show_previous_occurrences : this.showPreviousOccurrences
        });

        const requestConfig = this.zoom.makeRequestConfig(
            `/meetings/${this.meetingId}${queryParams}`,
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