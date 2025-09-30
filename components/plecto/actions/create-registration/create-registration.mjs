import app from "../../plecto.app.mjs";

export default {
  key: "plecto-create-registration",
  name: "Create Registration",
  description: "Creates a new registration in Plecto. [See the documentation](https://docs.plecto.com/kb/guide/en/overview-of-plecto-api-endpoints-Qvm3c3ucy1/Steps/3879885,3896454)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    dataSource: {
      propDefinition: [
        app,
        "dataSource",
      ],
    },
    member: {
      propDefinition: [
        app,
        "member",
      ],
    },
    externalId: {
      propDefinition: [
        app,
        "externalId",
      ],
    },
    date: {
      propDefinition: [
        app,
        "date",
      ],
    },
    customFields: {
      propDefinition: [
        app,
        "customFields",
      ],
    },
  },
  async run({ $ }) {
    const customFields = typeof this.customFields === "string"
      ? JSON.parse(this.customFields)
      : this.customFields;

    const response = await this.app.createRegistration({
      $,
      data: {
        "data_source": this.dataSource,
        "member": this.member,
        "external_id": this.externalId,
        "date": this.date,
        ...customFields,
      },
    });
    $.export("$summary", "Successfully created registration with ID: " + response.id);
    return response;
  },
};
