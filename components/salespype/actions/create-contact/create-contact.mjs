import salespype from "../../salespype.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "salespype-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Salespype. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    salespype: {
      type: "app",
      app: "salespype",
    },
    firstName: {
      propDefinition: [
        salespype,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        salespype,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        salespype,
        "email",
      ],
    },
    address: {
      propDefinition: [
        salespype,
        "address",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        salespype,
        "city",
      ],
      optional: true,
    },
    state: {
      propDefinition: [
        salespype,
        "state",
      ],
      optional: true,
    },
    zip: {
      propDefinition: [
        salespype,
        "zip",
      ],
      optional: true,
    },
    country: {
      propDefinition: [
        salespype,
        "country",
      ],
      optional: true,
    },
    companyName: {
      propDefinition: [
        salespype,
        "companyName",
      ],
      optional: true,
    },
    birthDate: {
      propDefinition: [
        salespype,
        "birthDate",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const contact = await this.salespype.createContact({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      address: this.address,
      city: this.city,
      state: this.state,
      zip: this.zip,
      country: this.country,
      companyName: this.companyName,
      birthDate: this.birthDate,
    });
    $.export("$summary", `Created contact ${contact.first_name} ${contact.last_name} (${contact.email})`);
    return contact;
  },
};
