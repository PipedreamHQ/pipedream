import aircall from "../../aircall.app.mjs";

export default {
  name: "Create Contact",
  description: "Create a contact in Aircall. [See the documentation](https://developer.aircall.io/api-references/#create-a-contact)",
  key: "aircall-create-contact",
  version: "0.0.1",
  type: "action",
  props: {
    aircall,
    firstName: {
      propDefinition: [
        aircall,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        aircall,
        "lastName",
      ],
    },
    companyName: {
      propDefinition: [
        aircall,
        "companyName",
      ],
    },
    information: {
      propDefinition: [
        aircall,
        "information",
      ],
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "Array of email address objects (max 20). Each should contain `label` and `value`. If a string is provided, it will be used as both the label and value.",
      optional: true,
    },
    phoneNumbers: {
      type: "string[]",
      label: "Phone Numbers",
      description: "Array of phone number objects (max 20). Each should contain `label` and `value`. If a string is provided, it will be used as both the label and value.",
    },
  },
  async run({ $ }) {
    const data = {
      first_name: this.firstName,
      last_name: this.lastName,
      company_name: this.companyName,
      information: this.information,
      emails: this.emails,
      phone_numbers: this.phoneNumbers,
    };
    const response = await this.aircall.createContact({
      $,
      data,
    });

    $.export("$summary", `Successfully created contact (ID: ${response?.contact?.id})`);

    return response;
  },
};
