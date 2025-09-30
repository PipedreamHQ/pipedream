import { ConfigurationError } from "@pipedream/platform";
import samsara from "../../samsara.app.mjs";

export default {
  key: "samsara-create-contact",
  name: "Create Contact",
  description: "Adds a new contact to the organization. [See the documentation](https://developers.samsara.com/reference/createcontact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    samsara,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the contact.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.email && !this.phone) {
      throw new ConfigurationError("Either Email or Phone Number must be provided.");
    }

    const response = await this.samsara.createContact({
      $,
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
      },
    });
    $.export("$summary", `Successfully created contact ${this.firstName} ${this.lastName}`);
    return response;
  },
};
