import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import { doubleEncode } from "../../common/utils.mjs";
import consts from "../../consts.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";
import tzs from "../../zoom_tzs.mjs";

const {
  RECURRENCE_TYPE_OPTIONS,
  WEBINAR_TYPE_OPTIONS,
} = consts;

export default {
  name: "Update Webinar",
  description: "Update the details of a webinar. [See the documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarupdate)",
  key: "zoom_admin-update-webinar",
  version: "0.1.9",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zoomAdmin,
    webinar: {
      propDefinition: [
        zoomAdmin,
        "webinar",
      ],
    },
    occurrence: {
      propDefinition: [
        zoomAdmin,
        "occurrence",
        ({ webinar }) => ({
          meeting: webinar,
          isWebinar: true,
        }),
      ],
      description: "If you select a value for this param, only that instance will be updated. Otherwise, the entire webinar series will be updated.",
    },
    recurrenceType: {
      type: "integer",
      label: "Recurrence Type",
      options: RECURRENCE_TYPE_OPTIONS,
    },
    topic: {
      type: "string",
      label: "Name",
      optional: true,
    },
    type: {
      type: "integer",
      label: "Type",
      description: "Defaults to `Webinar`.",
      options: WEBINAR_TYPE_OPTIONS,
      default: 5,
      optional: true,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The webinar start time. We support two formats for this field - local time and GMT. To set time as GMT the format should be `yyyy-MM-ddTHH:mm:ssZ`. To set time using a specific timezone, use `yyyy-MM-ddTHH:mm:ss format and specify the timezone ID in the `timezone` field.",
      optional: true,
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "The webinar’s duration, **in minutes**. This field is only used for scheduled webinars.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The timezome to assign to the `startTime`. This field is only used for scheduled webinars. [Click here for Zoom timezone list documentation](https://marketplace.zoom.us/docs/api-reference/other-references/abbreviation-lists#timezones)",
      options: tzs,
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password required to join the webinar. By default, a password can **only** have a maximum length of `10` characters and only contain alphanumeric characters and the `@`, `-`, `_` and `*` characters.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const data = {
      topic: this.topic,
      type: this.type,
      start_time: this.startTime,
      duration: this.duration,
      password: this.password,
      timezone: this.timezone,
      recurrence: {
        type: this.recurrenceType,
      },
    };
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "PATCH",
      path: `/webinars/${doubleEncode(get(this.webinar, "value", this.webinar))}`,
      data,
      params: {
        occurrence_id: get(this.occurrence, "value", this.occurrence),
      },
    }));

    if (this.occurrence) {
      $.export("$summary", `The occurrence "${get(this.occurrence, "label", this.occurrence)}" of the webinar "${this.topic}" was successfully updated`);
    } else {
      $.export("$summary", `The webinar "${this.topic}" was successfully updated`);
    }

    return res;
  },
};
