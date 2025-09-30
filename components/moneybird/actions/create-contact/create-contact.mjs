import moneybird from "../../moneybird.app.mjs";

export default {
  key: "moneybird-create-contact",
  name: "Create Contact",
  description: "Create a new contact. [See docs here](https://developer.moneybird.com/api/contacts/#post_contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    moneybird,
    firstName: {
      label: "First Name",
      description: "First name of contact",
      type: "string",
    },
    lastName: {
      label: "Last Name",
      description: "Last name of contact",
      type: "string",
    },
    companyName: {
      label: "Company Name",
      description: "Company name of contact",
      type: "string",
    },
    country: {
      label: "Country",
      description: "Country of contact",
      type: "string",
      optional: true,
    },
    city: {
      label: "City",
      description: "City of contact",
      type: "string",
      optional: true,
    },
    sendInvoicesToEmail: {
      label: "Send Invoices To Email",
      description: "The email to send the invoices",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.moneybird.createContact({
      $,
      data: {
        contact: {
          firstname: this.firstName,
          lastname: this.lastName,
          company_name: this.companyName,
          send_invoices_to_email: this.sendInvoicesToEmail,
          country: this.country,
          city: this.city,
        },
      },
    });

    $.export("$summary", "Successfully created contact.");

    return response;
  },
};
