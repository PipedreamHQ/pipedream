import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-update-company",
  name: "Update Company",
  description: "Update an existing Company. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
  version: "0.0.1",
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
        "companyUuid",
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
      resource: "company",
      uuid: this.uuid,
      data: this.record,
    });
    $.export("$summary", `Updated Company ${this.uuid}`);
    return response;
  },
};
