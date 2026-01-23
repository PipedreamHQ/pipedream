import get from "lodash/get.js";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "Get meeting recordings",
  description:
    "Get all recordings of a meeting. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/GET/meetings/{meetingId}/recordings)",
  key: "zoom_admin-get-meeting-recordings",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    downloadAccessToken: {
      type: "boolean",
      label: "Download Access Token",
      description: "Whether to include the download access token in the response",
      optional: true,
    },
    ttl: {
      type: "integer",
      label: "TTL (seconds)",
      description: "Time to live (TTL) of the download_access_token in seconds. Range: 0-604800 (7 days). Only valid when Download Access Token is enabled.",
      optional: true,
      min: 0,
      max: 604800,
    },
  },
  async run({ $ }) {
    const params = {};

    if (this.downloadAccessToken) {
      params.include_fields = "download_access_token";
      if (this.ttl !== undefined) {
        params.ttl = this.ttl;
      }
    }

    const res = await this.zoomAdmin.listMeetingRecordings(get(this.meeting, "value", this.meeting), params);

    $.export("$summary", `"${get(this.meeting, "label", this.meeting)}" meeting recordings successfully fetched`);

    return res;
  },
};
