import workday from "../../workday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "workday-create-mentorship-for-me",
  name: "Create Mentorship For Current User",
  description: "Creates a mentorship for the current user. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#talentManagement/v2/post-/createMentorshipForMe)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    workday,
    endDate: {
      type: "string",
      label: "End Date",
      description: "Proposed end date (ISO 8601 format). Example: '2025-10-18T07:00:00.000Z'",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Proposed start date (ISO 8601 format). Example: '2025-10-18T07:00:00.000Z'",
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "Purpose of the mentorship.",
    },
    mentor: {
      propDefinition: [
        workday,
        "workerId",
      ],
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Optional. Comment field for notes or special requests.",
      optional: true,
    },
    mentorType: {
      type: "object",
      label: "Mentor Type",
      description: `Object containing at least an \`id\` property. Example: \`{"id": "00000000000000000000000000000000"}\`.
   
**Note:** These values are configured within your Workday tenant and can typically be retrieved using a **Workday Report-as-a-Service (RaaS)** or **SOAP API** integration. Please contact your Workday administrator to obtain the valid mentor type IDs available in your environment.`,
    },
    descriptor: {
      type: "string",
      label: "Descriptor",
      description: "Optional. Display name of the mentorship.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.endDate || !this.endDate.trim()) throw new ConfigurationError("End Date is required and cannot be empty.");
    if (!this.startDate || !this.startDate.trim()) throw new ConfigurationError("Start Date is required and cannot be empty.");
    if (!this.purpose || !this.purpose.trim()) throw new ConfigurationError("Purpose is required and cannot be empty.");
    if (this.mentorType !== undefined) {
      if (typeof this.mentorType !== "object" || !this.mentorType.id || !this.mentorType.id.trim()) {
        throw new ConfigurationError("mentorType must be an object with a non-empty id property.");
      }
    }

    const data = {
      endDate: this.endDate,
      startDate: this.startDate,
      purpose: this.purpose,
      mentor: {
        id: this.mentor,
      },
    };
    if (this.comment) data.comment = this.comment;
    if (this.mentorType) data.mentorType = this.mentorType;
    if (this.descriptor) data.descriptor = this.descriptor;

    const response = await this.workday.createMentorshipForMe({
      $,
      data,
    });
    $.export("$summary", "Mentorship created for current user");
    return response;
  },
};
