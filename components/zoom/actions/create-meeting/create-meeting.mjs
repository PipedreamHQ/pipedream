import zoom from "../../zoom.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "zoom-create-meeting",
  name: "Create Meeting",
  description: "Creates a meeting for a user. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/meetings/POST/users/{userId}/meetings)",
  version: "0.1.5",
  type: "action",
  props: {
    zoom,
    userId: {
      propDefinition: [
        zoom,
        "userId",
      ],
    },
    topic: {
      type: "string",
      label: "Topic",
      description: "The meeting's topic",
      optional: true,
    },
    type: {
      type: "integer",
      label: "Type",
      description: "The type of meeting",
      options: [
        {
          label: "An instant meeting",
          value: 1,
        },
        {
          label: "A scheduled meeting",
          value: 2,
        },
        {
          label: "A recurring meeting with no fixed time",
          value: 3,
        },
        {
          label: "A recurring meeting with fixed time",
          value: 8,
        },
        {
          label: "A screen share only meeting",
          value: 10,
        },
      ],
      optional: true,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Meeting start time. We support two formats for start_time - local time and GMT.\nTo set time as GMT the format should be yyyy-MM-ddTHH:mm:ssZ.\nTo set time using a specific timezone, use yyyy-MM-ddTHH:mm:ss format and specify the timezone ID in the timezone field OR leave it blank and the timezone set on your Zoom account will be used. You can also set the time as UTC as the timezone field.\nThe start_time should only be used for scheduled and / or recurring webinars with fixed time.",
      optional: true,
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "Meeting duration (minutes). Used for scheduled meetings only.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Time zone to format start_time. For example, America/Los_Angeles. For scheduled meetings only. Please reference our time [zone list](https://marketplace.zoom.us/docs/api-reference/other-references/abbreviation-lists#timezones) for supported time zones and their formats.",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password to join the meeting. Password may only contain the following characters: [a-z A-Z 0-9 @ - _ *]. Max of 10 characters.",
      optional: true,
    },
    agenda: {
      type: "string",
      label: "Agenda",
      description: "The meeting's agenda",
      optional: true,
    },
    trackingFields: {
      type: "string",
      label: "Tracking Fields",
      description: "An array of objects containing the keys **field** and **value**. Example `[{ \"field\": \"field\", \"value\": \"value1`\" }]`",
      optional: true,
    },
    recurrence: {
      type: "object",
      label: "Recurrence",
      description: "Recurrence object. Use this object only for a meeting with type 8, a recurring meeting with a fixed time. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/meetings/POST/users/{userId}/meetings) for more information. Example: `{ \"end_date_time\": \"2022-04-02T15:59:00Z\", \"end_times\": 7, \"monthly_day\": 1, \"monthly_week\": 1, \"monthly_week_day\": 1, \"repeat_interval\": 1, \"type\": 1, \"weekly_days\": \"1\" }`",
      optional: true,
    },
    settings: {
      type: "object",
      label: "Settings",
      description: "Information about the meeting's settings. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/meetings/POST/users/{userId}/meetings) for more information. Example: `{ \"additional_data_center_regions\": [ \"TY\" ], \"allow_multiple_devices\": true, \"alternative_hosts\": \"jchill@example.com;thill@example.com\", \"alternative_hosts_email_notification\": true, \"approval_type\": 2, \"approved_or_denied_countries_or_regions\": { \"approved_list\": [ \"CX\" ], \"denied_list\": [ \"CA\" ], \"enable\": true, \"method\": \"approve\" }`",
      optional: true,
    },
  },
  methods: {
    createMeeting({
      userId, ...args
    }) {
      return this.zoom.create({
        path: `/users/${userId}/meetings`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.createMeeting({
      $,
      userId: this.userId,
      data: {
        topic: this.topic,
        type: this.type,
        start_time: this.startTime,
        duration: this.duration,
        timezone: this.timezone,
        password: this.password,
        agenda: this.agenda,
        tracking_fields: utils.parseObj(this.trackingFields),
        recurrence: utils.parseObj(this.recurrence),
        settings: utils.parseObj(this.settings),
      },
    });
    $.export("$summary", `Successfully created meeting with ID \`${response.id}\``);
    return response;
  },
};
