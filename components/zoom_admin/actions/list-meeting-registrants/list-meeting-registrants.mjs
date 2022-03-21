import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";
import consts from "../../consts.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "List meeting registrants",
  description: "List all users who have registered for a meeting. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingregistrants)",
  key: "zoom_admin-action-list-meeting-registrants",
  version: "0.0.1",
  type: "action",
  props: {
    zoomAdmin,
    meeting: {
      propDefinition: [
        zoomAdmin,
        "meeting",
      ],
    },
    occurrence: {
      propDefinition: [
        zoomAdmin,
        "occurrence",
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
      options: consts.REGISTRANT_STATUSES_OPTIONS,
    },
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
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "GET",
      path: `/meetings/${get(this.meeting, "value", this.meeting)}/registrants`,
      params: {
        occurrence_id: get(this.occurrence, "value", this.occurrence),
        status: this.status,
        page_size: this.pageSize,
        page_number: this.pageNumber,
        next_page_token: this.nextPageToken,
      },
    }));

    if (this.occurrence) {
      $.export("$summary", `Registrants for the occurrence "${get(this.occurrence, "label", this.occurrence)}" of the meeting "${get(this.meeting, "label", this.meeting)}" successfully fetched`);
    } else {
      $.export("$summary", `Registrants for the meeting "${get(this.meeting, "label", this.meeting)}" successfully fetched`);
    }

    return res;
  },
};
