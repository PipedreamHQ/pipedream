import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-update-company-contact",
  name: "Update Company Contact",
  description: "Update an existing Company Contact. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
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
        "companycontactUuid",
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
      resource: "companycontact",
      uuid: this.uuid,
      data: this.record,
    });
    $.export("$summary", `Updated Company Contact ${this.uuid}`);
    return response;
  },
};
