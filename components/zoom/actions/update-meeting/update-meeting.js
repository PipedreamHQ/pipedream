const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-update-meeting",
    name: "Update meeting details",
    description: "Update the details of a meeting",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        meetingId: {
            label: "MeetingId",
            type: "integer",
            description: "The meeting ID ",
            optional: false,
            default: ""
            // @todo use and async options to pull MeetingId
        },
        occurrenceId: {
            label: "Occurrence id",
            type: "string",
            description: "Meeting occurrence id",
            optional: true,
            default: ""
            // @todo use and async options to pull MeetingId
        },
        scheduleFor: {
            label: "Schedule for",
            type: "string",
            description: "The email address or 'userId' of the user to schedule a meeting for.",
            optional: true,
            default: ""
        },
        topic: {
            label: "Topic",
            type: "string",
            description: "Meeting topic.",
            optional: true,
            default: ""
        },
        type: {
            label: "Type",
            type: "integer",
            description: `Meeting Types:
            1 - Instant meeting.
            2 - Scheduled meeting.
            3 - Recurring meeting with no fixed time.
            8 - Recurring meeting with a fixed time.
            `,
            options: [
                {
                    label: "1 - Instant meeting",
                    value: 1,
                },
                {
                    label: "2 - Scheduled meeting",
                    value: 2,
                },
                {
                    label: "3 - Recurring meeting with no fixed time",
                    value: 3,
                },
                {
                    label: "8 - Recurring meeting with a fixed time",
                    value: 8,
                }
            ],
            optional: true,
            default: ""
        },
        preSchedule: {
            label: "Pre schedule",
            type: "boolean",
            description: "Whether to create a prescheduled meeting. This **only** supports the meeting 'type' value of '2' (Scheduled Meeting):\n* 'true' — Create a prescheduled meeting.\n* 'false' — Create a regular meeting",
            optional: true,
            default: ""
        },
        startTime: {
            label: "Start time",
            type: "string",
            description: "Meeting start time. When using a format like \"yyyy-MM-dd'T'HH:mm:ss'Z'\", always use GMT time",
            optional: true,
            default: ""
        },
        duration: {
            label: "Duration",
            type: "integer",
            description: "Meeting duration (minutes). Used for scheduled meetings only.",
            optional: true,
            default: ""
        },
        timezone: {
            label: "Timezone",
            type: "string",
            description: "Time zone to format start_time. For example, \"America/Los_Angeles\".",
            optional: true,
            default: ""
        },
        password: {
            label: "Password",
            type: "string",
            description: "Meeting passcode. Passcode may only contain the following characters: [a-z A-Z 0-9 @ - _ *] and can have a maximum of 10 characters.",
            optional: true,
            default: ""
        },
        agenda: {
            label: "Agenda",
            type: "string",
            description: "Meeting description.",
            optional: true,
            default: ""
        },
        templateId: {
            label: "Template id",
            type: "string",
            description: "Unique identifier of the meeting template. \n\nUse this field if you would like to [schedule the meeting from a meeting template](https://support.zoom.us/hc/en-us/articles/360036559151-Meeting-templates#h_86f06cff-0852-4998-81c5-c83663c176fb). ",
            optional: true,
            default: ""
            // @todo use and async options to pull templateId
        },
        trackingFields: {
            label: "Tracking fields",
            type: "any",
            description: `Tracking fields. JSON Example: 
            '[{"field": "Tracking fields type", "value": "Tracking fields value"}]'
            `,
            optional: true,
            default: ""
        },
        recurrence: {
            label: "Recurrence",
            type: "object",
            description: `Recurrence object. Use this object only for a meeting with type 8 i.e., a recurring meeting with fixed time. url: https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingupdate JSON Example: 
            {
                "type": "type-integer, 1-Daily/2-Weekly/3-Monthly",
                "repeat_interval": "Define the interval at which the webinar should recur. For instance, if you would like to schedule a Webinar that recurs every two months, you must set the value of this field as  2  and the value of the  type  parameter as  3",
                "weekly_days":"1-Sunday/2-Monday/3-Tuesday/4-Wednesday/5-Thursday/6-Friday/7-Saturday",
                "monthly_day": "The value range is from 1 to 31",
                "monthly_week": "-1-Last week/1-First week/2-Second week/3-Third week/4-Fourth week",
                "monthly_week_day": "1-Sunday/2-Monday/3-Tuesday/4-Wednesday/5-Thursday/6-Friday/7-Saturday",
                "end_times": "Select how many times the webinar will recur before it is canceled. (Cannot be used with \"end_date_time\".)",
                "end_date_time": "Select a date when the webinar will recur before it is canceled. Should be in UTC time, such as 2017-11-25T12:00:00Z. (Cannot be used with \"end_times\".)"
            }
            `,
            optional: true,
            default: ""
        },
        settings: {
            label: "Settings",
            type: "object",
            description: `Meeting settings. See documentation for more information: https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarcreate`,
            optional: true,
            default: ""
        }

    },
    async run() {
        // @todo: add action logic
    }
}