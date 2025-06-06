import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";
import { paginate } from "../../common/pagination.mjs";

export default {
  name: "List Past Meeting Participants",
  description:
    "List all participants of a past meeting. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/meetings/GET/past_meetings/{meetingId}/participants)",
  key: "zoom_admin-list-past-meeting-participants",
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
  },
  async run({ $ }) {
    const res = await paginate(
      this.zoomAdmin.listPastMeetingParticipants,
      "participants",
      get(this.meeting, "value", this.meeting),
    );

    $.export("$summary", `"${get(this.meeting, "label", this.meeting)}" past meeting participants successfully fetched`);

    return res;
  },
};
