import graceblocks from "../../graceblocks.app.mjs";

export default {
  key: "graceblocks-update-record",
  name: "Update Record",
  description: "Update an existing record in GraceBlocks.",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    graceblocks,
    recordId: {
      propDefinition: [
        graceblocks,
        "recordId",
      ],
    },
    name: {
      propDefinition: [
        graceblocks,
        "name",
      ],
    },
    description: {
      propDefinition: [
        graceblocks,
        "description",
      ],
    },
    attachments: {
      propDefinition: [
        graceblocks,
        "attachments",
      ],
    },
    status: {
      propDefinition: [
        graceblocks,
        "status",
      ],
    },
    priority: {
      propDefinition: [
        graceblocks,
        "priority",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.graceblocks.updateRecord({
      $,
      data: {
        id: this.recordId,
        Name: this.name,
        Description: this.description,
        Attachment: this.attachments,
        Status: this.status,
        Priority: this.priority,
      },
    });
    $.export("$summary", `Updated record with ID: ${response.id}`);
    return response;
  },
};
