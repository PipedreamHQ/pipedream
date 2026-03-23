import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-feedback",
  name: "Get Feedback",
  description: "Get feedback by UUID. [See the documentation](https://developer.servicem8.com/reference/getfeedback)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    servicem8: app,
    uuid: {
      propDefinition: [
        app,
        "feedbackUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "feedback",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Feedback ${this.uuid}`);
    return response;
  },
};
