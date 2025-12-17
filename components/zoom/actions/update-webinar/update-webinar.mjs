// legacy_hash_id: a_Q3irlY
import { axios } from "@pipedream/platform";
import utils from "../../common/utils.mjs";

export default {
  key: "zoom-update-webinar",
  name: "Update Webinar",
  description: "Update a webinar's topic, start time, or other settings",
  version: "0.1.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zoom: {
      type: "app",
      app: "zoom",
    },
    webinarID: {
      type: "string",
      label: "Webinar ID",
      description: "The Zoom Webinar ID of the webinar you'd like to update.",
    },
    topic: {
      type: "string",
      description: "Webinar topic",
      optional: true,
    },
    type: {
      type: "integer",
      description: "Webinar type:\n1 - Instant webinar.\n2 - Scheduled webinar.\n3 - Recurring webinar with no fixed time.\n8 - Recurring webinar with fixed time.",
      optional: true,
    },
    start_time: {
      type: "string",
      description: "Webinar start time. We support two formats for start_time - local time and GMT.\nTo set time as GMT the format should be yyyy-MM-ddTHH:mm:ssZ.\nTo set time using a specific timezone, use yyyy-MM-ddTHH:mm:ss format and specify the timezone ID in the timezone field OR leave it blank and the timezone set on your Zoom account will be used. You can also set the time as UTC as the timezone field.\nThe start_time should only be used for scheduled and / or recurring webinars with fixed time.",
      optional: true,
    },
    duration: {
      type: "integer",
      description: "Webinar duration (minutes). Used for scheduled webinars only.",
      optional: true,
    },
    timezone: {
      type: "string",
      description: "Time zone to format start_time. For example, America/Los_Angeles. For scheduled webinars only. Please reference our time [zone list](https://marketplace.zoom.us/docs/api-reference/other-references/abbreviation-lists#timezones) for supported time zones and their formats.",
      optional: true,
    },
    password: {
      type: "string",
      description: "Password to join the webinar. Password may only contain the following characters: [a-z A-Z 0-9 @ - _ *]. Max of 10 characters.",
      optional: true,
    },
    agenda: {
      type: "string",
      description: "Webinar description.",
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
      description: "Webinar settings.",
      optional: true,
    },
  },
  async run({ $ }) {
  // API docs: https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingupdate
    const config = {
      method: "PATCH",
      url: `https://api.zoom.us/v2/webinars/${utils.doubleEncode(this.webinarID)}`,
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
