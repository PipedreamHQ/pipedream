import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";
import { axios } from "@pipedream/platform";

export default {
  name: "List meeting registrants",
  description: "List all users that have registered for a meeting. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingregistrants)",
  key: "zoom_admin-action-list-meeting-registrants",
  version: "0.0.2",
  type: "action",
  props: {
    zoomAdmin,
    meeting: {
      propDefinition: [
        zoomAdmin,
        "meeting",
      ],
    },
    occurrenceId: {
      propDefinition: [
        zoomAdmin,
        "occurrenceId",
        ({ meeting }) => ({
          meeting,
        }),
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "The registrant status. Defaults to `approved`",
      optional: true,
      options: [
        "pending",
        "approved",
        "denied",
      ],
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
      description: "**Deprecated** - This field has been deprecated and will have the support completely stopped in a future release. Please use `Next Page Token` for pagination instead of this field. The page number of the current page in the returned records",
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
      path: `/meetings/${get(this.meeting, "value", this.meeting)}/registrants`,
      params: {
        occurrence_id: this.occurrenceId,
        status: this.status,
        page_size: this.pageSize,
        page_number: this.pageNumber,
        next_page_token: this.nextPageToken,
      },
    }));

    $.export("$summary", `Registrants for the meeting "${get(this.meeting, "label", this.meeting)}" successfully fetched`);

    return res;
  },
};
