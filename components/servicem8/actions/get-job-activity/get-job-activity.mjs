import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-job-activity",
  name: "Get Job Activity",
  description: "Retrieve a Job Activity by UUID. [See the documentation](https://developer.servicem8.com/reference/listjobactivities)",
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
        "jobactivityUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "jobactivity",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Job Activity ${this.uuid}`);
    return response;
  },
};
