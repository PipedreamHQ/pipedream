import { axios } from "@pipedream/platform";
import isObject from "lodash/isObject.js";
import consts from "../../consts.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "Delete Cloud Recording",
  description: "Remove a recording from a meeting or webinar. [See the documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/cloud-recording/recordingdeleteone)",
  key: "zoom_admin-delete-cloud-recording",
  version: "0.1.6",
  type: "action",
  props: {
    zoomAdmin,
    cloudRecording: {
      propDefinition: [
        zoomAdmin,
        "cloudRecording",
      ],
    },
    action: {
      type: "string",
      label: "Action",
      description: "The recording delete action",
      optional: true,
      options: consts.CLOUD_RECORD_ACTION_OPTIONS,
    },
  },
  async run ({ $ }) {
    let cloudRecording = isObject(this.cloudRecording)
      ? this.cloudRecording
      : JSON.parse(this.cloudRecording);

    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "DELETE",
      path: `/meetings/${cloudRecording.value.meetingId}/recordings/${cloudRecording.value.id}`,
      params: {
        action: this.action,
      },
    }));

    $.export("$summary", `The cloud recording "${cloudRecording.label}" was successfully deleted`);

    return res;
  },
};
