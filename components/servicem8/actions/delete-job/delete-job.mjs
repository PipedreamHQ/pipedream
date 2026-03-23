import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-job",
  name: "Delete Job",
  description: "Delete a job by UUID. [See the documentation](https://developer.servicem8.com/reference/deletejobs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.servicem8.deleteResource({
      $,
      resource: "job",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Job ${this.uuid}`);
    return response;
  },
};
