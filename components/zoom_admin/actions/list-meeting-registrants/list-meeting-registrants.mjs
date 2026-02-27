import get from "lodash/get.js";
import { paginate } from "../../common/pagination.mjs";
import consts from "../../consts.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "List meeting registrants",
  description: "List all users who have registered for a meeting. [See the documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingregistrants)",
  key: "zoom_admin-list-meeting-registrants",
  version: "0.2.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
  },
  async run ({ $ }) {
    const params = {
      occurrence_id: this.occurrence?.value ?? this.occurrence,
      status: this.status,
    };

    const data = await paginate(
      this.zoomAdmin.listMeetingRegistrants,
      "registrants",
      this.meeting?.value ?? this.meeting,
      params,
    );

    if (this.occurrence) {
      $.export("$summary", `Registrants for the occurrence "${get(this.occurrence, "label", this.occurrence)}" of the meeting "${get(this.meeting, "label", this.meeting)}" successfully fetched`);
    } else {
      $.export("$summary", `Registrants for the meeting "${get(this.meeting, "label", this.meeting)}" successfully fetched`);
    }

    return data;
  },
};
