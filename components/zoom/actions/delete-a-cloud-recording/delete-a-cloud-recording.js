const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-delete-a-cloud-recording",
    name: "Delete a Cloud Recording",
    description: "Remove a recording from a meeting or webinar",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        meetingId: {
            label: "MeetingId",
            type: "string",
            description: "Meeting ID or meeting UUID. If the meeting ID is provided instead of UUID,the response will be for the latest meeting instance. \n\nTo get Cloud Recordings of a webinar, provide the webinar ID or the webinar UUID. If the webinar ID is provided instead of UUID,the response will be for the latest webinar instance." ,
            optional: false,
            default: ""
            // @todo use and async options to pull MeetingId and webinarId
        },
        recordingId: {
            label: "RecordingId",
            type: "string",
            description: "The recording ID.",
            optional: false,
            default: ""
            // @todo use and async options to pull RecordingId
        },
        action: {
            label: "Action",
            type: "string",
            description: `The recording delete actions:
            trash - Move recording to trash.
            delete - Delete recording permanently`,
            options: [
                "trash",
                "delete"
            ],
            optional: true,
            default: "trash"
        }
    },
    async run() {
        // @todo: add action logic
    }
}