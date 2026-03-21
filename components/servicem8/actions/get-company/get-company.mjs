import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-company",
  name: "Get Company",
  description: "Retrieve a Company by UUID.",
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
        "companyUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "company",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Company ${this.uuid}`);
    return response;
  },
};
