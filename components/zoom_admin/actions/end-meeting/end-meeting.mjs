import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "End meeting",
  description: "End a meeting for a user. [See the documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingstatus)",
  key: "zoom_admin-end-meeting",
  version: "0.1.7",
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
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "PUT",
      path: `/meetings/${get(this.meeting, "value", this.meeting)}/status`,
      data: {
        action: "end",
      },
    }));

    $.export("$summary", `The meeting "${get(this.meeting, "label", this.meeting)}" was successfully ended`);

    return res;
  },
};
