import rex from "../../rex.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "rex-create-lead",
  name: "Create Lead",
  description: "Creates a new lead in Rex. [See the documentation](https://api-docs.rexsoftware.com/service/leads#operation/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rex,
    leadType: {
      type: "string",
      label: "Lead Type",
      description: "The type of lead",
      options: constants.LEAD_TYPE_OPTIONS,
    },
    contactId: {
      propDefinition: [
        rex,
        "contactId",
      ],
    },
    sourceId: {
      propDefinition: [
        rex,
        "sourceId",
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "Message filled in by the user about the reason for contact",
    },
    listingId: {
      propDefinition: [
        rex,
        "listingId",
      ],
    },
    propertyId: {
      propDefinition: [
        rex,
        "propertyId",
      ],
    },
    projectId: {
      propDefinition: [
        rex,
        "projectId",
      ],
    },
    projectStageId: {
      propDefinition: [
        rex,
        "projectStageId",
      ],
    },
    assigneeId: {
      propDefinition: [
        rex,
        "userId",
      ],
      label: "Assignee",
      description: "Identifier of the account/agent that will manage the lead",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      data: {
        note: this.note,
        lead_type: {
          id: this.leadType,
        },
        contact: {
          id: this.contactId,
        },
        lead_source: {
          id: this.sourceId,
        },
        listing: this.listingId
          ? {
            id: this.listingId,
          }
          : undefined,
        property: this.propertyId
          ? {
            id: this.propertyId,
          }
          : undefined,
        project: this.projectId
          ? {
            id: this.projectId,
          }
          : undefined,
        project_stage: this.projectStageId
          ? {
            id: this.projectStageId,
          }
          : undefined,
        assignee: this.assigneeId
          ? {
            id: this.assigneeId,
          }
          : undefined,
      },
    };

    const { result } = await this.rex.createLead({
      data,
      $,
    });

    if (result?.id) {
      $.export("$summary", `Successfully created lead with ID ${result.id}.`);
    }

    return result;
  },
};
