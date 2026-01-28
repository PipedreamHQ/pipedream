import { parseObject } from "../../common/utils.mjs";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-update-lead",
  name: "Update Lead",
  description: "Updates a lead in Pipedrive. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Leads#updateLead)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedriveApp,
    leadId: {
      propDefinition: [
        pipedriveApp,
        "leadId",
      ],
      optional: false,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the lead",
      optional: true,
    },
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      description: "The ID of the person this lead will be linked to. If the person does not exist yet, it needs to be created first.",
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "ID of the organization this lead will belong to",
    },
    ownerId: {
      label: "Owner ID",
      description: "ID of the user who will be marked as the owner of this lead",
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
    },
    labelIds: {
      propDefinition: [
        pipedriveApp,
        "leadLabelIds",
      ],
    },
    value: {
      type: "object",
      label: "Value",
      description: "Potential value of the lead, e.g. `{ \"amount\": 200, \"currency\": \"EUR\" }`",
      optional: true,
    },
    expectedCloseDate: {
      type: "string",
      label: "Expected Close Date",
      description: "The date of when the deal which will be created from the lead is expected to be closed. In ISO 8601 format: YYYY-MM-DD.",
      optional: true,
    },
    visibleTo: {
      type: "string",
      label: "Visible To",
      description: "The visibility of the lead. If omitted, the visibility will be set to the default visibility setting of this item type for the authorized user. Read more about visibility groups [here](https://support.pipedrive.com/en/article/visibility-groups).",
      options: [
        {
          label: "Essential / Advanced plan - Owner & followers, Professional / Enterprise plan - Owner only",
          value: "1",
        },
        {
          label: "Essential / Advanced plan - Entire company, Professional / Enterprise plan - Owner's visibility group",
          value: "3",
        },
        {
          label: "Professional / Enterprise plan - Owner's visibility group and sub-groups",
          value: "5",
        },
        {
          label: "Professional / Enterprise plan - Entire company",
          value: "7",
        },
      ],
      optional: true,
    },
    wasSeen: {
      type: "boolean",
      label: "Was Seen",
      description: "A flag indicating whether the lead was seen by someone in the Pipedrive UI",
      optional: true,
    },
    isArchived: {
      type: "boolean",
      label: "Is Archived",
      description: "A flag indicating whether the lead is archived or not",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.updateLead({
      leadId: this.leadId,
      title: this.title,
      person_id: this.personId,
      organization_id: this.organizationId,
      owner_id: this.ownerId,
      label_ids: this.labelIds,
      value: parseObject(this.value),
      expected_close_date: this.expectedCloseDate,
      visible_to: this.visibleTo,
      was_seen: this.wasSeen,
      is_archived: this.isArchived,
    });
    $.export("$summary", `Successfully updated lead: ${response.data?.title || response.data?.id}`);
    return response;
  },
};
