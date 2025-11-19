import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-create-contact",
  name: "Create Contact",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new contact in Sendoso. [See the documentation](https://sendoso.docs.apiary.io/#reference/contact-management)",
  type: "action",
  props: {
    sendoso,
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact's last name.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Contact's email address.",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Contact's phone number.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Contact's company name.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Contact's job title.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Contact's street address.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Contact's city.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Contact's state/province.",
      optional: true,
    },
    zip: {
      type: "string",
      label: "ZIP Code",
      description: "Contact's postal code.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Contact's country.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      title,
      address,
      city,
      state,
      zip,
      country,
    } = this;

    const data = {
      first_name: firstName,
      last_name: lastName,
      email,
      ...(phone && { mobile_no: phone }),
      ...(company && { company_name: company }),
      ...(title && { title }),
      ...(address && { address }),
      ...(city && { city }),
      ...(state && { state }),
      ...(zip && { zip }),
      ...(country && { country }),
    };

    const response = await this.sendoso.createContact({
      $,
      ...data,
    });

    $.export("$summary", `Successfully created contact: ${firstName} ${lastName}`);
    return response;
  },
};

