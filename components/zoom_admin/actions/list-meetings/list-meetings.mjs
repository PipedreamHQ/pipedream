import zoomAdmin from "../../zoom_admin.app.mjs";
import consts from "../../consts.mjs";
import { paginate } from "../../common/pagination.mjs";

export default {
  name: "List meetings",
  description: "List all meetings. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetings)",
  key: "zoom_admin-list-meetings",
  version: "0.2.0",
  type: "action",
  props: {
    zoomAdmin,
    type: {
      type: "string",
      label: "Type",
      description: "The meeting type. Defaults to `live`",
      optional: true,
      options: consts.LIST_MEETINGS_TYPE_OPTIONS,
    },
  },
  async run ({ $ }) {
    const params = {
      type: this.type,
    };

    const data = await paginate(
      this.zoomAdmin.listMeetings,
      "meetings",
      params,
    );

    $.export("$summary", `Successfully fetched ${data.length} meeting(s)`);

    return data;
  },
};
