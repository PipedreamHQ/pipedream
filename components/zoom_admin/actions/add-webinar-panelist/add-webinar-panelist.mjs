import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import { doubleEncode } from "../../common/utils.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "Add webinar panelist",
  description: "Register a panelist for a webinar. [See the documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarpanelistcreate)",
  key: "zoom_admin-add-webinar-panelist",
  version: "0.1.10",
  annotations: {
    destructiveHint: false,
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
    name: {
      type: "string",
      label: "Panelist name",
      optional: false,
    },
    email: {
      type: "string",
      label: "Panelist email",
      optional: false,
    },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "POST",
      path: `/webinars/${doubleEncode(get(this.webinar, "value", this.webinar))}/panelists`,
      data: {
        panelists: [
          {
            name: this.name,
            email: this.email,
          },
        ],
      },
    }));

    $.export("$summary", `"${this.name}" was successfully added as a panelist to "${get(this.webinar, "label", this.webinar)}" webinar.`);

    return res;
  },
};
