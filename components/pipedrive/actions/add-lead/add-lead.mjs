import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import pipedrive from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-add-lead",
  name: "Add Lead",
  description: "Create a new lead in Pipedrive. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Leads#addLead)",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedrive,
    title: {
      type: "string",
      label: "Title",
      description: "The name of the lead",
    },
    personId: {
      propDefinition: [
        pipedrive,
        "personId",
      ],
      description: "The ID of a person which this lead will be linked to. If the person does not exist yet, it needs to be created first. This property is required unless organization_id is specified.",
    },
    organizationId: {
      propDefinition: [
        pipedrive,
        "organizationId",
      ],
      description: "The ID of an organization which this lead will be linked to. If the organization does not exist yet, it needs to be created first. This property is required unless person_id is specified.",
    },
    ownerId: {
      propDefinition: [
        pipedrive,
        "userId",
      ],
      description: "The ID of the user which will be the owner of the created lead. If not provided, the user making the request will be used.",
    },
    leadLabelIds: {
      propDefinition: [
        pipedrive,
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
    note: {
      type: "string",
      label: "Note",
      description: "A note to add to the lead",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.organizationId && !this.personId) {
      throw new ConfigurationError("Either organizationId or personId is required");
    }

    const response = await this.pipedrive.addLead({
      title: this.title,
      person_id: this.personId,
      organization_id: this.organizationId,
      owner_id: this.ownerId,
      label_ids: this.leadLabelIds,
      value: parseObject(this.value),
      expected_close_date: this.expectedCloseDate,
      visible_to: this.visibleTo,
      was_seen: this.wasSeen,
    });

    if (this.note) {
      await this.pipedrive.addNote({
        content: this.note,
        lead_id: response.data?.id,
      });
    }

    $.export("$summary", `Successfully created lead: ${response.data?.title || response.data?.id}`);
    return response;
  },
};
