import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-job-material",
  name: "Get Job Material",
  description: "Get a job material by UUID. [See the documentation](https://developer.servicem8.com/reference/getjobmaterials)",
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
        "jobmaterialUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "jobmaterial",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Job Material ${this.uuid}`);
    return response;
  },
};
