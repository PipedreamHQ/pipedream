import workday from "../../workday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "workday-close-mentorship",
  name: "Close Mentorship",
  description: "End a mentorship for a given ID. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#talentManagement/v2/post-/mentorships/-ID-/close)",
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
      description: "Last event comment (optional). Example: `Lorem ipsum dolor sit amet, ...`",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date for the mentorship (ISO 8601). Example: `2025-10-18T07:00:00.000Z`",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date for the mentorship (ISO 8601). Example: `2025-10-18T07:00:00.000Z`",
    },
    closeMentorshipReason: {
      type: "object",
      label: "Close Mentorship Reason",
      description: "Example: `{ \"id\": \"00000000000000000000000000000000\" }`",
    },
    descriptor: {
      type: "string",
      label: "Descriptor",
      description: "Display name. Example: `Lorem ipsum dolor sit ame`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (
      !this.closeMentorshipReason ||
      typeof this.closeMentorshipReason !== "object" ||
      !this.closeMentorshipReason.id ||
      !this.closeMentorshipReason.id.trim()
    ) {
      throw new ConfigurationError("closeMentorshipReason is required and must be an object with a non-empty id property.");
    }

    const data = {
      closeMentorshipReason: this.closeMentorshipReason,
      startDate: this.startDate,
      endDate: this.endDate,
    };
    if (this.comment) data.comment = this.comment;
    if (this.descriptor) data.descriptor = this.descriptor;

    const response = await this.workday.closeMentorship({
      id: this.mentorshipId,
      data,
      $,
    });
    $.export("$summary", `Mentorship ${this.mentorshipId} closed`);
    return response;
  },
};
