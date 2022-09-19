import zoomAdmin from "../../zoom_admin.app.mjs";
import consts from "../../consts.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "List meetings",
  description: "List all meetings. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetings)",
  key: "zoom_admin-action-list-meetings",
  version: "0.0.1",
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
    nextPageToken: {
      propDefinition: [
        zoomAdmin,
        "nextPageToken",
      ],
    },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "GET",
      path: "/users/me/meetings",
      params: {
        type: this.type,
        page_size: this.pageSize,
        page_number: this.pageNumber,
        next_page_token: this.nextPageToken,
      },
    }));

    $.export("$summary", `Successfully fetched ${res.meetings.length} ${res.meetings.length === 1
      ? "meeting"
      : "meetings"}`);

    return res;
  },
};
