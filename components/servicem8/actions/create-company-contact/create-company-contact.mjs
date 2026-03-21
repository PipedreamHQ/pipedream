import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-create-company-contact",
  name: "Create Company Contact",
  description: "Create a new Company Contact. The new record UUID may be returned in the result field recordUuid when the API sends the x-record-uuid response header. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    record: {
      propDefinition: [
        app,
        "record",
      ],
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "companycontact",
      data: this.record,
    });
    $.export("$summary", `Created Company Contact${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
