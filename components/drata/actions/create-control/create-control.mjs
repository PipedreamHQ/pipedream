import drata from "../../drata.app.mjs";

const docsLink = "https://developers.drata.com/docs/openapi/reference/operation/GRCPublicController_createControl/";

export default {
  key: "drata-create-control",
  name: "Create Control",
  description: `Create a new Control. [See the documentation](${docsLink}).`,
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    drata,
    workspaceId: {
      propDefinition: [
        drata,
        "workspaceId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the control.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the control.",
    },
    code: {
      type: "string",
      label: "Code",
      description: "The control code.",
    },
    activity: {
      type: "string",
      label: "Activity",
      description: "The activity of the control.",
      optional: true,
    },
    question: {
      type: "string",
      label: "Question",
      description: "The question of the control.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.drata.createControl({
      $,
      workspaceId: this.workspaceId,
      data: {
        name: this.name,
        description: this.description,
        code: this.code,
        activity: this.activity,
        question: this.question,
      },
    });
    $.export("$summary", "Succesfully created control");
    return response;
  },
};
