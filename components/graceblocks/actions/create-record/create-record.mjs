import graceblocks from "../../graceblocks.app.mjs";

export default {
  key: "graceblocks-create-record",
  name: "Create Record",
  description: "Create a new record in GraceBlocks.",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    graceblocks,
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
    const response = await this.graceblocks.createRecord({
      $,
      data: {
        Name: this.name,
        Description: this.description,
        Attachment: this.attachments,
        Status: this.status,
        Priority: this.priority,
      },
    });
    $.export("$summary", `Created record with ID: ${response.id}`);
    return response;
  },
};
