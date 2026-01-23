import { axios } from "@pipedream/platform";
import consts from "../../consts.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";
import tzs from "../../zoom_tzs.mjs";

const { RECURRENCE_TYPE_OPTIONS } = consts;

export default {
  name: "Create Webinar",
  description: "Create a webinar for an user. [See the documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarcreate)",
  key: "zoom_admin-create-webinar",
  version: "0.1.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zoomAdmin,
    topic: {
      type: "string",
      label: "Name",
      description: "The Webinar's topic.",
      optional: true,
    },
    recurrenceType: {
      type: "integer",
      label: "Recurrence Type",
      description: "Recurrence webinar types",
      options: RECURRENCE_TYPE_OPTIONS,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The webinar start time. We support two formats for this field - local time and GMT. To set time as GMT the format should be `yyyy-MM-ddTHH:mm:ssZ`. To set time using a specific timezone, use `yyyy-MM-ddTHH:mm:ss` format and specify the timezone ID in the `timezone` field.",
      optional: true,
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "The webinar’s duration, in minutes. This field is only used for scheduled webinars.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The timezome to assign to the `startTime`. This field is only used for scheduled webinars.",
      options: tzs,
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password required to join the webinar. By default, a password can only have a maximum length of `10` characters and only contain alphanumeric characters and the `@`, `-`, `_` and `*` characters.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const data = {
      topic: this.topic,
      start_time: this.startTime,
      duration: this.duration,
      password: this.password,
      timezone: this.timezone,
      recurrence: {
        type: this.recurrenceType,
      },
    };
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "POST",
      path: "/users/me/webinars",
      data,
    }));

    $.export("$summary", `The webinar, "${this.topic}," was successfully created`);

    return res;
  },
};
