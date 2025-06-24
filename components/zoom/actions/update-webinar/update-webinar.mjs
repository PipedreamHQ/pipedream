import zoom from "../../zoom.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "zoom-update-webinar",
  name: "Update Webinar",
  description: "Update a webinar's topic, start time, or other settings. Requires a paid Zoom account. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/webinars/PATCH/webinars/{webinarId})",
  version: "0.1.5",
  type: "action",
  props: {
    zoom,
    paidAccountAlert: {
      propDefinition: [
        zoom,
        "paidAccountAlert",
      ],
    },
    webinarId: {
      propDefinition: [
        zoom,
        "webinarId",
      ],
      description: "The Zoom Webinar ID of the webinar you'd like to update.",
    },
    topic: {
      type: "string",
      label: "Topic",
      description: "Webinar topic",
      optional: true,
    },
    type: {
      type: "integer",
      label: "Type",
      description: "Webinar type:\n1 - Instant webinar.\n2 - Scheduled webinar.\n3 - Recurring webinar with no fixed time.\n8 - Recurring webinar with fixed time.",
      options: [
        {
          label: "An instant webinar",
          value: 1,
        },
        {
          label: "A scheduled webinar",
          value: 2,
        },
        {
          label: "A recurring webinar with no fixed time",
          value: 3,
        },
        {
          label: "A recurring webinar with fixed time",
          value: 8,
        },
      ],
      optional: true,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Webinar start time. We support two formats for start_time - local time and GMT.\nTo set time as GMT the format should be yyyy-MM-ddTHH:mm:ssZ.\nTo set time using a specific timezone, use yyyy-MM-ddTHH:mm:ss format and specify the timezone ID in the timezone field OR leave it blank and the timezone set on your Zoom account will be used. You can also set the time as UTC as the timezone field.\nThe start_time should only be used for scheduled and / or recurring webinars with fixed time.",
      optional: true,
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "Webinar duration (minutes). Used for scheduled webinars only.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Time zone to format start_time. For example, America/Los_Angeles. For scheduled webinars only. Please reference our time [zone list](https://marketplace.zoom.us/docs/api-reference/other-references/abbreviation-lists#timezones) for supported time zones and their formats.",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password to join the webinar. Password may only contain the following characters: [a-z A-Z 0-9 @ - _ *]. Max of 10 characters.",
      optional: true,
    },
    agenda: {
      type: "string",
      label: "Agenda",
      description: "Webinar description",
      optional: true,
    },
    tracking_fields: {
      propDefinition: [
        zoom,
        "trackingFields",
      ],
    },
    recurrence: {
      propDefinition: [
        zoom,
        "recurrence",
      ],
    },
    settings: {
      type: "object",
      label: "Settings",
      description: "Information about the webinar's settings. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/webinars/PATCH/webinars/{webinarId}) for more information. Example: `{ \"allow_multiple_devices\": true, \"alternative_hosts\": \"jchill@example.com\", \"alternative_host_update_polls\": true, \"approval_type\": 0, \"attendees_and_panelists_reminder_email_notification\": { \"enable\": true, \"type\": 0 } }`",
      optional: true,
    },
  },
  methods: {
    updateWebinar({
      webinarId, ...args
    }) {
      return this.zoom.update({
        path: `/webinars/${webinarId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.updateWebinar({
      $,
      webinarId: this.webinarId,
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
    $.export("$summary", `Successfully updated webinar with ID \`${this.webinarId}\``);
    return response;
  },
};
