import { ConfigurationError } from "@pipedream/platform";
import app from "../../callingly.app.mjs";

export default {
  key: "callingly-create-client",
  name: "Create Client",
  description: "Creates a new client in Callingly. [See the documentation](https://help.callingly.com/article/38-callingly-api-documentation#create-client)",
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
      type: "string",
      label: "First Name",
      description: "Client's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Client's last name",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Client's company name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Client's email address",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Client's phone number (e.g., 555-555-5555)",
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password for the client account",
      secret: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createClient({
      $,
      data: {
        fname: this.firstName,
        email: this.email,
        phone_number: this.phoneNumber,
        ...(this.lastName && {
          lname: this.lastName,
        }),
        ...(this.company && {
          company: this.company,
        }),
        ...(this.password && {
          password: this.password,
        }),
      },
    });

    if (Object.hasOwn(response, "success") && response.success === false) {
      throw new ConfigurationError(response.message);
    }

    $.export("$summary", `Successfully created client with ID: ${response.id}`);
    return response;
  },
};
