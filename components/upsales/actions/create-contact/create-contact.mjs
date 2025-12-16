import app from "../../upsales.app.mjs";

export default {
  key: "upsales-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Upsales. [See the documentation](https://api.upsales.com/#3e8b5e8d-3f4a-4e8e-8b5e-8d3f4a4e8e8b)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    firstName: {
      propDefinition: [
        app,
        "contactFirstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "contactLastName",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "contactPhone",
      ],
    },
    cellPhone: {
      propDefinition: [
        app,
        "contactCellPhone",
      ],
    },
    email: {
      propDefinition: [
        app,
        "contactEmail",
      ],
    },
    title: {
      propDefinition: [
        app,
        "contactTitle",
      ],
    },
    active: {
      propDefinition: [
        app,
        "contactActive",
      ],
    },
    clientId: {
      propDefinition: [
        app,
        "contactClientId",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      cellPhone: this.cellPhone,
      email: this.email,
      title: this.title,
      active: this.active,
    };

    if (this.clientId) {
      data.client = {
        id: this.clientId,
      };
    }

    const response = await this.app.createContact({
      $,
      data,
    });

    $.export("$summary", `Successfully created contact: ${this.firstName} ${this.lastName}`);
    return response;
  },
};

