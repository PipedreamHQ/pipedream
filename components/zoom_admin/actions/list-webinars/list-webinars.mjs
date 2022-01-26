import zoomAdmin from "../../zoom_admin.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "List Webinars",
  description: "List all webinars for a user. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinars)",
  key: "zoom_admin-action-list-webinars",
  version: "0.0.1",
  type: "action",
  props: {
    zoomAdmin,
    pageSize: {
      propDefinition: [
        zoomAdmin,
        "pageSize",
      ],
    },
    pageNumber: {
      propDefinition: [
        zoomAdmin,
        "pageNumber",
      ],
    },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "GET",
      path: "/users/me/webinars",
      params: {
        page_size: this.pageSize,
        page_number: this.pageNumber,
      },
    }));

    $.export("$summary", "Webinars successfully fetched");

    return res;
  },
};
