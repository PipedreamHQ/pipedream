import zoomAdmin from "../../zoom_admin.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "List meetings",
  description: "List all meetings. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetings)",
  key: "zoom-admin-action-list-meetings",
  version: "0.0.1",
  type: "action",
  props: {
    zoomAdmin,
    type: {
      type: "string",
      label: "Type",
      description: "The meeting type. Defaults to `live`",
      optional: true,
      options: [
        "scheduled",
        "live",
        "upcoming",
      ],
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of records returned within a single API call. Defaults to `30`",
      optional: true,
      min: 1,
      max: 300,
    },
    pageNumber: {
      type: "integer",
      label: "Page Number",
      description: "The page number of the current page in the returned records.",
      optional: true,
      min: 1,
    },
    nextPageToken: {
      type: "string",
      label: "Next Page Token",
      description: "The next page token is used to paginate through large result sets. A next page token will be returned whenever the set of available results exceeds the current page size. The expiration period for this token is 15 minutes.",
      optional: true,
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

    $.export("$summary", "Meetings successfully fetched");

    return res;
  },
};
