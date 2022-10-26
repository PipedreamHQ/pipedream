import zoomAdmin from "../../zoom_admin.app.mjs";
import consts from "../../common/consts.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "List Cloud Recordings",
  description: "Search cloud recordings from a meeting or webinar. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/cloud-recording/recordingslist)",
  key: "zoom_admin-list-cloud-recordings",
  version: "0.0.2",
  type: "action",
  props: {
    zoomAdmin,
    pageSize: {
      propDefinition: [
        zoomAdmin,
        "pageSize",
      ],
    },
    nextPageToken: {
      propDefinition: [
        zoomAdmin,
        "nextPageToken",
      ],
    },
    mc: {
      type: "string",
      label: "MC",
      description: "Query Metadata of Recording if an On-Premise Meeting Connector was used for the meeting.",
      optional: true,
    },
    trash: {
      type: "boolean",
      label: "Trash",
      description: "If `true`, list recordings from trash",
      optional: true,
    },
    trashType: {
      type: "string",
      label: "Trash Type",
      description: "Should be used together with `Trash`. The type of Cloud recording that you would like to retrieve from trash",
      optional: true,
      options: consts.CLOUD_RECORD_TRASH_TYPE_OPTIONS,
    },
    from: {
      type: "string",
      label: "From",
      description: "The start date in `yyyy-mm-dd` UTC format for the date range for which you would like to retrieve recordings. The maximum range can be a month. If no value is provided for this field, the default will be current date.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "End date in `yyyy-mm-dd` UTC format.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "GET",
      path: "/users/me/recordings",
      params: {
        page_size: this.pageSize,
        next_page_token: this.nextPageToken,
        mc: this.mc,
        trash: this.trash,
        trash_type: this.trashType,
        from: this.from,
        to: this.to,
      },
    }));

    $.export("$summary", "Cloud records successfully fetched");

    return res;
  },
};
