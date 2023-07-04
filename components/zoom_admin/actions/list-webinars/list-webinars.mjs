import { paginate } from "../../common/pagination.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "List Webinars",
  description: "List all webinars for a user. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinars)",
  key: "zoom_admin-list-webinars",
  version: "0.2.0",
  type: "action",
  props: {
    zoomAdmin,
  },
  async run ({ $ }) {
    const data = await paginate(
      this.zoomAdmin.listWebinars,
      "webinars",
    );

    $.export("$summary", `${data.length} Webinar(s) successfully fetched`);

    return data;
  },
};
