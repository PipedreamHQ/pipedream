import app from "../../pandadoc.app.mjs";

export default {
  key: "pandadoc-create-or-update-contact",
  name: "Create or Update Contact",
  description: "This method adds or updates a contact using the email as index. [See the documentation here](https://developers.pandadoc.com/reference/create-contact)",
  type: "action",
  version: "0.0.8",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Contact's email address.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact's last name.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Contact's company name.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Contact's job title.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Contact's phone number.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Contact's country name.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Contact's state name.",
      optional: true,
    },
    streetAddress: {
      type: "string",
      label: "Street Address",
      description: "Contact's street address.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Contact's city name.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Contact's postal code.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      email,
      firstName,
      lastName,
      company,
      jobTitle,
      phone,
      country,
      state,
      streetAddress,
      city,
      postalCode,
    } = this;

    const response = await this.app.createOrUpdateContact({
      $,
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        company,
        job_title: jobTitle,
        phone,
        country,
        state,
        street_address: streetAddress,
        city,
        postal_code: postalCode,
      },
    });

    $.export("$summary", `Successfully created or updated a contact with email: ${email}`);
    return response;
  },
};
