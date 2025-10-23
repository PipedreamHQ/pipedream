import workday from "../../workday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "workday-update-mentorship",
  name: "Update Mentorship",
  description: "Update a mentorship resource. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#talentManagement/v2/post-/mentorships/-ID-/edit)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },

  type: "action",
  props: {
    workday,
    mentorshipId: {
      propDefinition: [
        workday,
        "mentorshipId",
      ],
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Comment field.",
      optional: true,
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "Updated purpose of mentorship.",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Updated start date. Example: `2025-10-18T07:00:00.000Z`",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Updated end date (ISO 8601). Example: `2025-10-18T07:00:00.000Z`",
      optional: true,
    },
    descriptor: {
      type: "string",
      label: "Descriptor",
      description: "Display name.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.comment) data.comment = this.comment;
    if (this.purpose) data.purpose = this.purpose;
    if (this.endDate) data.endDate = this.endDate;
    if (this.startDate) data.startDate = this.startDate;
    if (this.descriptor) data.descriptor = this.descriptor;

    if (Object.keys(data).length === 0) {
      throw new ConfigurationError("At least one field to update must be provided.");
    }

    const response = await this.workday.updateMentorship({
      id: this.mentorshipId,
      data,
      $,
    });
    $.export("$summary", `Mentorship ${this.mentorshipId} updated`);
    return response;
  },
};
