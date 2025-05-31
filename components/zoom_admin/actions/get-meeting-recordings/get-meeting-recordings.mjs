import get from "lodash/get.js";
import { paginate } from "../../common/pagination.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "Get meeting recordings",
  description:
    "Get all recordings of a meeting. [See the docs here](https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/GET/meetings/{meetingId}/recordings)",
  key: "zoom_admin-get-meeting-recordings",
  version: "0.0.1",
  type: "action",
  props: {
    zoomAdmin,
    meeting: {
      propDefinition: [
        zoomAdmin,
        "meeting",
      ],
    },
    downloadAccessToken: {
      type: "boolean",
      label: "Download Access Token",
      description: "Whether to include the download access token in the response",
      optional: true,
    },
  },
  async run({ $ }) {
    const res = await paginate(
      this.zoomAdmin.listMeetingRecordings,
      "recordings",
      get(this.meeting, "value", this.meeting),
      {
        download_access_token: this.downloadAccessToken,
      },
    );

    $.export("$summary", `"${get(this.meeting, "label", this.meeting)}" meeting recordings successfully fetched`);

    return res;
  },
};
