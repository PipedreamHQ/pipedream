import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-company-contact",
  name: "Delete Company Contact",
  description: "Delete a company contact by UUID. [See the documentation](https://developer.servicem8.com/reference/deletecompanycontacts)",
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
        "companycontactUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.deleteResource({
      $,
      resource: "companycontact",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Company Contact ${this.uuid}`);
    return response;
  },
};
