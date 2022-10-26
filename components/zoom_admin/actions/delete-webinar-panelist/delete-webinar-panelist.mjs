import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";
import { axios } from "@pipedream/platform";

export default {
  name: "Delete webinar panelist",
  description: "Remove a panelist from a webinar. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarpanelistdelete)",
  key: "zoom_admin-delete-webinar-panelist",
  version: "0.0.2",
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
      path: `/webinars/${get(this.webinar, "value", this.webinar)}/panelists/${get(this.panelist, "value", this.panelist)}`,
    }));

    $.export("$summary", `"${get(this.panelist, "label", this.panelist)}" was successfully removed as a panelist of "${get(this.webinar, "label", this.webinar)}" webinar.`);

    return res;
  },
};
