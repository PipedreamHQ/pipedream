import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-job",
  name: "Get Job",
  description: "Retrieve a Job by UUID. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
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
        "jobUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "job",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Job ${this.uuid}`);
    return response;
  },
};
