import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-update-job-material",
  name: "Update Job Material",
  description: "Update an existing Job Material. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    record: {
      propDefinition: [
        app,
        "record",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.updateResource({
      $,
      resource: "jobmaterial",
      uuid: this.uuid,
      data: this.record,
    });
    $.export("$summary", `Updated Job Material ${this.uuid}`);
    return response;
  },
};
