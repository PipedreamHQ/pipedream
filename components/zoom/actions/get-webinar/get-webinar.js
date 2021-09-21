const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-get-webinar",
    name: "Get webinar details",
    description: "Retrieves the details of a webinar",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        webinarId: {
            label: "WebinarId",
            type: "integer",
            description: "The webinar ID ",
            optional: false,
            default: ""
            // @todo use and async options to pull webinar ID 
        },
        occurrenceId: {
            label: "Occurrence id",
            type: "string",
            description: "Unique Identifier that identifies an occurrence of a recurring webinar. [Recurring webinars](https://support.zoom.us/hc/en-us/articles/216354763-How-to-Schedule-A-Recurring-Webinar) can have a maximum of 50 occurrences.",
            optional: true,
            default: ""
            // @todo use and async options to pull occurrenceId 
        },
        showPreviousOccurrences: {
            label: "Show previous occurrences",
            type: "boolean",
            description: "Set the value of this field to 'true' if you would like to view Webinar details of all previous occurrences of a recurring Webinar.",
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
            `/webinars/${this.webinarId}${queryParams}`,
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