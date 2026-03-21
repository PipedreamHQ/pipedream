import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-job-material",
  name: "Delete Job Material",
  description: "Delete a Job Material by UUID. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
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
        "jobmaterialUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.deleteResource({
      $,
      resource: "jobmaterial",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Job Material ${this.uuid}`);
    return response;
  },
};
