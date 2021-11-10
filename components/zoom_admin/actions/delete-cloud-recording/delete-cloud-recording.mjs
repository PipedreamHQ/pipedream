import zoomAdmin from "../../zoom_admin.app.mjs";
import isObject from "lodash/isObject.js";
import { axios } from "@pipedream/platform";

export default {
  name: "Delete Cloud Recording",
  description: "Remove a recording from a meeting or webinar. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/cloud-recording/recordingdeleteone)",
  key: "zoom_admin-action-delete-cloud-recording",
  version: "0.0.1",
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
      options: [
        {
          label: "Move recording to trash",
          value: "trash",
        },
        {
          label: "Delete recording permanently",
          value: "delete",
        },
      ],
    },
  },
  async run ({ $ }) {
    const cloudRecording = isObject(this.cloudRecording)
      ? this.cloudRecording
      : JSON.parse(this.cloudRecording);

    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "DELETE",
      path: `/meetings/${cloudRecording.meetingId}/recordings/${cloudRecording.value}`,
      params: {
        action: this.action,
      },
    }));

    $.export("$summary", "Cloud recording successfully deleted");

    return res;
  },
};
