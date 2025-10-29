import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import { doubleEncode } from "../../common/utils.mjs";
import consts from "../../consts.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";
import tzs from "../../zoom_tzs.mjs";

const { MEETING_TYPE_OPTIONS } = consts;

export default {
  name: "Update a meeting",
  description: "Update the details of a meeting. [See the documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingupdate)",
  key: "zoom_admin-update-meeting",
  version: "0.1.8",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zoomAdmin,
    meeting: {
      propDefinition: [
        zoomAdmin,
        "meeting",
      ],
    },
    topic: {
      type: "string",
      label: "Name",
    },
    occurrence: {
      propDefinition: [
        zoomAdmin,
        "occurrence",
        ({ meeting }) => ({
          meeting,
        }),
      ],
      description: "The [meeting occurrence ID](https://support.zoom.us/hc/en-us/articles/214973206-Scheduling-Recurring-Meetings). If you select a specific occurrence, just that occurrence will be updated. Otherwise, the entire meeting series will be updated.",
    },
    type: {
      type: "integer",
      label: "Type",
      description: "Default to `A scheduled meeting`. The type of the meeting",
      options: MEETING_TYPE_OPTIONS,
      default: 8,
      optional: true,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The meeting’s start time. This field is only used for scheduled and/or recurring meetings with a fixed time. This supports local time and GMT formats.",
      optional: true,
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "The meeting’s scheduled duration, **in minutes**. This field is only used for scheduled meetings.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The timezome to assign to the `startTime`. This field is only used for scheduled meetings. [Click here for Zoom timezone list documentation](https://marketplace.zoom.us/docs/api-reference/other-references/abbreviation-lists#timezones)",
      options: tzs,
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password required to join the meeting. By default, a password can **only** have a maximum length of `10` characters and only contain alphanumeric characters and the `@`, `-`, `_` and `*` characters.",
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
    };
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "PATCH",
      path: `/meetings/${doubleEncode(get(this.meeting, "value", this.meeting))}`,
      params: {
        occurrence_id: get(this.occurrence, "value", this.occurrence),
      },
      data,
    }));

    if (this.occurrence) {
      $.export("$summary", `The meeting occurrence "${get(this.occurrence, "label", this.occurrence)}" of meeting "${this.topic}" was successfully updated`);
    } else {
      $.export("$summary", `The meeting "${this.topic}" was successfully updated`);
    }

    return res;
  },
};
