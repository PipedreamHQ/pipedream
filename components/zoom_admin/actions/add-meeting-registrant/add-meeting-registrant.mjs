import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import isArray from "lodash/isArray.js";
import { doubleEncode } from "../../common/utils.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "Add meeting registrant",
  description: "Register a participant for a meeting. [See the documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingregistrantcreate)",
  key: "zoom_admin-add-meeting-registrant",
  version: "0.1.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
      type: "string[]",
      description: "The [meeting occurrence ID](https://support.zoom.us/hc/en-us/articles/214973206-Scheduling-Recurring-Meetings).",
    },
    email: {
      type: "string",
      label: "Email",
      description: "A valid email address of the registrant",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Registrant's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Registrant's last name",
      optional: true,
    },
    autoApprove: {
      type: "boolean",
      label: "Auto Approve",
      description: "Registrant's auto-approve.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "POST",
      path: `/meetings/${doubleEncode(get(this.meeting, "value", this.meeting))}/registrants`,
      params: {
        occurrence_ids: isArray(this.occurrence)
          ? this.occurrence.map((occurrence) => get(occurrence, "value", occurrence)).join(",")
          : this.occurrence,
      },
      data: {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        auto_approve: this.autoApprove,
      },
    }));

    if (this.occurrence) {
      const occurrences = this.occurrence.map((occurrence) => get(occurrence, "label", occurrence)).join(",");
      $.export("$summary", `"${this.firstName} ${this.lastName}" was successfully added to the occurrence(s) "${occurrences}" of the meeting "${get(this.meeting, "label", this.meeting)}"`);
    } else {
      $.export("$summary", `"${this.firstName} ${this.lastName}" was successfully added to the meeting "${get(this.meeting, "label", this.meeting)}"`);
    }

    return res;
  },
};
