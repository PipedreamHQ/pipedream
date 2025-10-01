import moxie from "../../moxie.app.mjs";
import currency from "currency-codes/data.js";

export default {
  key: "moxie-create-client",
  name: "Create Client",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new client. [See the documentation](https://help.withmoxie.com/en/articles/8160175-create-client)",
  type: "action",
  props: {
    moxie,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the client",
    },
    clientType: {
      type: "string",
      label: "Type",
      description: "The type of client",
      options: [
        "Client",
        "Prospect",
      ],
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Valid [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code",
      default: "USD",
      async options() {
        return currency.map(({
          code: value, currency: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the client's primary contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the client's primary contact",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the client's primary contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the client's primary contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      clientType: this.clientType,
      currency: this.currency,
      contacts: [
        {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phone: this.phone,
          defaultContact: true,
        },
      ],
    };

    const response = await this.moxie.createClient({
      data,
      $,
    });

    if (response.id) {
      $.export("$summary", `Successfully created client with ID ${response.id}.`);
    }
    return response;
  },
};
