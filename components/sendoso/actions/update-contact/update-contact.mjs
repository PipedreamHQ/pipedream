import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-update-contact",
  name: "Update Contact",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update an existing contact's information. [See the documentation](https://sendoso.docs.apiary.io/#reference/contact-management)",
  type: "action",
  props: {
    sendoso,
    contactId: {
      propDefinition: [
        sendoso,
        "contactId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Updated first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Updated last name.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Updated email address.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Updated phone number.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Updated company name.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Updated job title.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      contactId,
      firstName,
      lastName,
      email,
      phone,
      company,
      title,
    } = this;

    const data = {};
    const updates = {
      ...(firstName && { first_name: firstName }),
      ...(lastName && { last_name: lastName }),
      ...(email && { email }),
      ...(phone && { mobile_no: phone }),
      ...(company && { company_name: company }),
      ...(title && { title }),
    };

    Object.assign(data, updates);

    const response = await this.sendoso.updateContact({
      $,
      contactId,
      ...data,
    });

    $.export("$summary", `Successfully updated contact ID: ${contactId}`);
    return response;
  },
};

