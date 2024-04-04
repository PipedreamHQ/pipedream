import dex from "../../dex.app.mjs";

export default {
  key: "dex-create-update-contact",
  name: "Create or Update Contact",
  description: "Adds a new contact or updates an existing one in the Dex system.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dex,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the contact",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name of the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const contactData = {
      first_name: this.name,
      contact_emails: {
        data: {
          email: this.email,
        },
      },
      contact_phone_numbers: {
        data: {
          phone_number: this.phoneNumber,
        },
      },
    };
    if (this.address) contactData.address = this.address;
    if (this.companyName) contactData.company_name = this.companyName;

    const response = await this.dex.createOrUpdateContact({
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      address: this.address,
      companyName: this.companyName,
    });

    $.export("$summary", `Successfully created or updated contact ${this.name}`);
    return response;
  },
};
