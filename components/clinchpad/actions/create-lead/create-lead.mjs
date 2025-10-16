import clinchpad from "../../clinchpad.app.mjs";

export default {
  name: "Create Lead",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "clinchpad-create-lead",
  description: "Creates a lead. [See docs here (Go to `Create a lead`)](https://clinchpad.com/api/docs/leads)",
  type: "action",
  props: {
    clinchpad,
    name: {
      label: "Name",
      description: "Name of the lead",
      type: "string",
    },
    pipelineId: {
      description: "The pipeline ID of the pipeline to which the lead is to be added",
      propDefinition: [
        clinchpad,
        "pipelineId",
      ],
    },
    userId: {
      description: "The user ID of the user you want to assign the lead to",
      propDefinition: [
        clinchpad,
        "userId",
      ],
      optional: true,
    },
    size: {
      label: "Size",
      description: "Value of the lead (numeric only). E.g. `1500`",
      type: "integer",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.clinchpad.createLead({
      $,
      data: {
        name: this.name,
        pipeline_id: this.pipelineId,
        user_id: this.userId,
        size: this.size,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created lead with id ${response.id}`);
    }

    return response;
  },
};
