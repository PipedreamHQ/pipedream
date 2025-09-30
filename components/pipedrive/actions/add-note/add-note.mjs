import { ConfigurationError } from "@pipedream/platform";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-add-note",
  name: "Add Note",
  description: "Adds a new note. For info on [adding an note in Pipedrive](https://developers.pipedrive.com/docs/api/v1/Notes#addNote)",
  version: "0.0.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedriveApp,
    content: {
      type: "string",
      label: "Content",
      description: "The content of the note in HTML format. Subject to sanitization on the back-end.",
    },
    leadId: {
      propDefinition: [
        pipedriveApp,
        "leadId",
      ],
      description: "The ID of the lead the note will be attached to. This property is required unless one of (deal_id/person_id/org_id) is specified.",
    },
    dealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      description: "The ID of the deal the note will be attached to. This property is required unless one of (lead_id/person_id/org_id) is specified.",
    },
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      description: "The ID of the person this note will be attached to. This property is required unless one of (deal_id/lead_id/org_id) is specified.",
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "The ID of the organization this note will be attached to. This property is required unless one of (deal_id/lead_id/person_id) is specified.",
    },
    userId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      description: "The ID of the user who will be marked as the author of the note. Only an admin can change the author.",
    },
    addTime: {
      propDefinition: [
        pipedriveApp,
        "addTime",
      ],
    },
    pinnedToDealFlag: {
      type: "boolean",
      label: "Pinned To Deal Flag",
      description: "If set, the results are filtered by note to deal pinning state (deal_id is also required)",
      default: false,
      optional: true,
    },
    pinnedToLeadFlag: {
      type: "boolean",
      label: "Pinned To Lead Flag",
      description: "If set, the results are filtered by note to lead pinning state (lead_id is also required)",
      default: false,
      optional: true,
    },
    pinnedToOrgFlag: {
      type: "boolean",
      label: "Pinned To Organization Flag",
      description: "If set, the results are filtered by note to organization pinning state (org_id is also required)",
      default: false,
      optional: true,
    },
    pinnedToPersonFlag: {
      type: "boolean",
      label: "Pinned To Person Flag",
      description: "If set, the results are filtered by note to person pinning state (person_id is also required)",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const resp =
        await this.pipedriveApp.addNote({
          content: this.content,
          lead_id: this.leadId,
          deal_id: this.dealId,
          person_id: this.personId,
          org_id: this.organizationId,
          user_id: this.userId,
          add_time: this.addTime,
          pinned_to_lead_flag: this.pinnedToLeadFlag,
          pinned_to_deal_flag: this.pinnedToDealFlag,
          pinned_to_organization_flag: this.pinnedToOrgFlag,
          pinned_to_person_flag: this.pinnedToPersonFlag,
        });

      $.export("$summary", "Successfully added note");

      return resp;
    } catch ({ error }) {
      throw new ConfigurationError(error);
    }
  },
};
