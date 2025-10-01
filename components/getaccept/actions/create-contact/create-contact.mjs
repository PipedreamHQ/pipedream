import { ConfigurationError } from "@pipedream/platform";
import getaccept from "../../getaccept.app.mjs";

export default {
  key: "getaccept-create-contact",
  name: "Create Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new contact in the database for the current entity [See the documentation](https://app.getaccept.com/api/#createcontact)",
  type: "action",
  props: {
    getaccept,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact.",
      optional: true,
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "Use to specify full name instead of first/last name.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the contact. e.g. CEO, Sales Manager.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact in international format.",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "Nobile number of the contact in international format.",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Internal note for contact.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Associated company.",
      optional: true,
    },
    companyNumber: {
      type: "string",
      label: "Company Number",
      description: "Associated Company Number.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      getaccept,
      firstName,
      lastName,
      fullName,
      email,
      mobile,
      companyName,
      companyNumber,
      ...data
    } = this;

    if (!email && !mobile) {
      throw new ConfigurationError("You must fill in at least the email or mobile fields.");
    }

    const response = await getaccept.createContact({
      $,
      data: {
        email,
        mobile,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        company_name: companyName,
        company_number: companyNumber,
        ...data,
      },
    });

    $.export("$summary", `A new contact with Id: ${response.contact_id} was successfully created!`);
    return response;
  },
};
