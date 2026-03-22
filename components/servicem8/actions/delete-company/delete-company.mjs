import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-company",
  name: "Delete Company",
  description: "Delete a Company by UUID. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
  version: "0.0.2",
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
        "companyUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.deleteResource({
      $,
      resource: "company",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Company ${this.uuid}`);
    return response;
  },
};
