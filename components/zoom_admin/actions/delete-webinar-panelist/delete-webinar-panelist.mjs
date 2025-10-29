import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import { doubleEncode } from "../../utils.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "Delete webinar panelist",
  description: "Remove a panelist from a webinar. [See the documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarpanelistdelete)",
  key: "zoom_admin-delete-webinar-panelist",
  version: "0.1.8",
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
    panelist: {
      propDefinition: [
        zoomAdmin,
        "panelist",
        ({ webinar }) => ({
          webinar,
        }),
      ],
    },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "DELETE",
      path: `/webinars/${doubleEncode(get(this.webinar, "value", this.webinar))}/panelists/${get(this.panelist, "value", this.panelist)}`,
    }));

    $.export("$summary", `"${get(this.panelist, "label", this.panelist)}" was successfully removed as a panelist of "${get(this.webinar, "label", this.webinar)}" webinar.`);

    return res;
  },
};
