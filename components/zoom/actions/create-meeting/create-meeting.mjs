// legacy_hash_id: a_l0i2Mn
import { axios } from "@pipedream/platform";

export default {
  key: "zoom-create-meeting",
  name: "Create Meeting",
  description: "Creates a meeting for a user. A maximum of 100 meetings can be created for a user in a day.",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zoom: {
      type: "app",
      app: "zoom",
    },
    topic: {
      type: "string",
      description: "Meeting topic",
      optional: true,
    },
    type: {
      type: "integer",
      description: "Meeting type:\n1 - Instant meeting.\n2 - Scheduled meeting.\n3 - Recurring meeting with no fixed time.\n8 - Recurring meeting with fixed time.",
      optional: true,
    },
    start_time: {
      type: "string",
      description: "Meeting start time. We support two formats for start_time - local time and GMT.\nTo set time as GMT the format should be yyyy-MM-ddTHH:mm:ssZ.\nTo set time using a specific timezone, use yyyy-MM-ddTHH:mm:ss format and specify the timezone ID in the timezone field OR leave it blank and the timezone set on your Zoom account will be used. You can also set the time as UTC as the timezone field.\nThe start_time should only be used for scheduled and / or recurring webinars with fixed time.",
      optional: true,
    },
    duration: {
      type: "integer",
      description: "Meeting duration (minutes). Used for scheduled meetings only.",
      optional: true,
    },
    timezone: {
      type: "string",
      description: "Time zone to format start_time. For example, America/Los_Angeles. For scheduled meetings only. Please reference our time [zone list](https://marketplace.zoom.us/docs/api-reference/other-references/abbreviation-lists#timezones) for supported time zones and their formats.",
      optional: true,
    },
    password: {
      type: "string",
      description: "Password to join the meeting. Password may only contain the following characters: [a-z A-Z 0-9 @ - _ *]. Max of 10 characters.",
      optional: true,
    },
    agenda: {
      type: "string",
      description: "Meeting description.",
      optional: true,
    },
    tracking_fields: {
      type: "any",
      description: "Tracking fields.",
      optional: true,
    },
    recurrence: {
      type: "object",
      description: "Recurrence object",
      optional: true,
    },
    settings: {
      type: "string",
      description: "Meeting settings.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs here: https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingcreate
    const config = {
      method: "post",
      url: "https://api.zoom.us/v2/users/me/meetings",
      data: {
        topic: this.topic,
        type: this.type,
        start_time: this.start_time,
        duration: this.duration,
        timezone: this.timezone,
        password: this.password,
        agenda: this.agenda,
        tracking_fields: typeof this.tracking_fields == "undefined"
          ? this.tracking_fields
          : JSON.parse(this.tracking_fields),
        recurrence: typeof this.recurrence == "undefined"
          ? this.recurrence
          : JSON.parse(this.recurrence),
        settings: typeof this.settings == "undefined"
          ? this.settings
          : JSON.parse(this.settings),
      },
      headers: {
        "Authorization": `Bearer ${this.zoom.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      },
    };
    return await axios($, config);
  },
};
