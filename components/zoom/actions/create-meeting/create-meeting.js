const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-create-meeting",
    name: "Create meeting",
    description: "Creates a Zoom meeting for the current user,  user ID or user email",
    type: "action",
    version: "0.0.6",
    props: {
        zoom,
        userId: {
            label: "user",
            type: "string",
            description: "The user id or email, defaults to the authenticated user",
            optional: true,
            default: 'me',
        },
        topic: {
            label: "Topic",
            type: "string",
            description: "The meeting's topic",
            optional: true,
            default: '',
        },
        type: {
            label: "Type",
            type: "integer",
            description: 
            `1 - Instant meeting.
            2 - Scheduled meeting.
            3 - Recurring meeting with no fixed time.
            8 - Recurring meeting with fixed time.`,
            options: [
                {
                    label: "1 - Instant",
                    value: 1,
                },
                {
                    label: "2 - Scheduled",
                    value: 2,
                },
                {
                    label: "3 - Recurring with no fixed time",
                    value: 3,
                },
                {
                    label: "8 - Recurring with fixed time",
                    value: 8,
                },
            ],
            optional: true,
            default: 1,
        },
        scheduleFor: {
            label: "Schedule for",
            type: "string",
            description: "The user ID or email to schedule the meeting for",
            optional: true,
            default: '',
        },
        password: {
            label: "Password",
            type: "string",
            // @todo, pull minimum password requirement setting from zoom api
            // https://support.zoom.us/hc/en-us/articles/360033559832-Meeting-and-webinar-passwords#h_a427384b-e383-4f80-864d-794bf0a37604
            description: "Password required to join the meeting. Defaults to: 10 character long and only alphanumeric charactes and the '@', '-', '_' and '*' characters",
            optional: true,
            default: '',
        },
        preSchedule: {
            label: "Pre schedule",
            type: "boolean",
            description: "Whether to create a prescheduled meeting. Only supports schedule meetings ('2')",
            optional: true,
            default: false,
        },
        startTime: {
            label: "Start Time",
            type: "string",
            description: `Meeting start time. We support two formats for 'start_time' - local time and GMT.
            To set time as GMT the format should be 'yyyy-MM-ddTHH:mm:ssZ'.
            To set time using a specific timezone, use 'yyyy-MM-ddTHH:mm:ss' format and specify the timezone ID in the timezone field OR leave it blank 
            and the timezone set on your Zoom account will be used. You can also set the time as UTC as the timezone field.
            The 'start_time' should only be used for scheduled and / or recurring webinars with fixed time.`,
            optional: true,
            default: '',
        },
        timezone: {
            label: "Timezone",
            type: "string",
            description: "The timezone to assign to the 'start_time' value. Used for scheduled meetings only.",
            optional: true,
            default: '',
        },
        duration: {
            label: "Duration",
            type: "integer",
            description: "Meeting duration (minutes). Used for scheduled meetings only. defaults to 60 mins",
            optional: true,
            default: 60
        },
        agenda: {
            label: "Agenda",
            type: "string",
            description: "Meeting description, maximum length of 2,000 characters",
            optional: true,
            default: '',
        },
        trackingFields: {
            label: "Tracking fields",
            type: "object",
            description: "information about the meeting's tracking fields. item schema: '[{field:value},{field:value}]'",
            optional: true,
            default: {},
        },
        recurrence: {
            label: "Recurrence",
            type: "object",
            description: "Use this object only for recurring meeting type. See [recurrence object docs](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingcreate) for field details.",
            optional: true,
            default: {},
        },
        settings: {
            label: "Settings",
            type: "object",
            description: "The meeting settings, see meeting [settings](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingcreate) api docs.",
            optional: true,
            default: {},
        },
        templateId: {
            label: "Template Id",
            type: "string",
            description: `The admin meeting template’s unique ID. by default this is disabled`,
            // @todo implement an async function to get the template list from zoom api
            // https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/listmeetingtemplates
            optional: true,
            default: '',
        },
    },
    async run() {

        const requestBody = this.zoom.filterEmptyRequestFields({
            topic: this.topic,
            type: this.type,
            schedule_for: this.scheduleFor,
            password: this.password,
            pre_schedule: this.preSchedule,
            start_time: this.startTime,
            timezone: this.timezone,
            duration: this.duration,
            agenda: this.agenda,
            tracking_fields: this.trackingFields,
            recurrence: this.recurrence,
            settings: this.settings,
            template_id: this.templateId,
        });

        const requestConfig = this.zoom.makeRequestConfig(
            `/users/${this.userId}/meetings`,
            "post",
            requestBody
        );

        try {
            let response = await axios(this, requestConfig);
            return response;
        } catch (error) {
            return error.response.data;
        }
    }
}
