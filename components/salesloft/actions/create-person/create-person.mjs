import salesloft from "../../salesloft.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "salesloft-create-person",
  name: "Create Person",
  description: "Creates a new person in Salesloft. [See the documentation](https://developers.salesloft.com/docs/api/people-create/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    salesloft,
    info: {
      type: "alert",
      alertType: "info",
      content: "Either `Email Address` or both `Phone` and `Last Name` must be provided.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the person",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the person",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the person",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the person",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The job title of the person",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company name of the person",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.email && !(this.phone && this.lastName)) {
      throw new ConfigurationError("Either `Email Address` or both `Phone` and `Last Name` must be provided");
    }

    const response = await this.salesloft.createPerson({
      $,
      data: {
        email_address: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        phone: this.phone,
        title: this.title,
        company_name: this.company,
      },
    });

    $.export("$summary", `Successfully created person (ID: ${response.id})`);

    return response;
  },
};
