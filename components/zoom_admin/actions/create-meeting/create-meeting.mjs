import { axios } from "@pipedream/platform";
import consts from "../../consts.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";
import tzs from "../../zoom_tzs.mjs";

const { MEETING_TYPE_OPTIONS } = consts;

export default {
  name: "Create a meeting",
  description: "Create a new room in zoom. [See the documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingcreate)",
  key: "zoom_admin-create-meeting",
  version: "0.1.8",
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
      label: "Meeting topic",
      optional: true,
    },
    type: {
      type: "integer",
      label: "Type",
      description: "The type of the meeting you'd like to create",
      options: MEETING_TYPE_OPTIONS,
      default: 2,
      optional: true,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The meeting’s start time. This field is only used for scheduled and/or recurring meetings with a fixed time. This supports local time and GMT formats. Refer to [Zoom's documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingcreate) for example formats.",
      optional: true,
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "The meeting’s scheduled duration, in minutes. This field is only used for scheduled meetings.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The timezone to assign to the `startTime`. This field is only used for scheduled meetings.",
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
      timezone: this.timezone,
      password: this.password,
    };
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "POST",
      path: "/users/me/meetings",
      data,
    }));

    $.export("$summary", `The meeting "${this.topic}" was successfully created`);

    return res;
  },
};
