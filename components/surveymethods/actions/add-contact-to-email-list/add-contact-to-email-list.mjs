import surveymethods from "../../surveymethods.app.mjs";

export default {
  name: "Add Contact To Email List",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "surveymethods-add-contact-to-email-list",
  description: "Creates a email list. [See docs here in 8.2](https://app.surveymethods.com/t-help/api/surveymethodsapidocumentv1.pdf)",
  type: "action",
  props: {
    surveymethods,
    email: {
      label: "Email",
      description: "The email to add on email list",
      type: "string",
    },
    emailListCode: {
      propDefinition: [
        surveymethods,
        "emailListCode",
      ],
    },
    customFieldsValues: {
      label: "Custom Fields Values",
      description: "The email list custom fields values. E.g. `123,Joe,Williams,Laptop,HP Pavilion`",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surveymethods.addContactToEmailList({
      $,
      emailListCode: this.emailListCode,
      email: this.email,
      data: {
        custom_fields_values: this.customFieldsValues ?? "",
      },
    });

    if (response) {
      $.export("$summary", `Successfully added email to email list with code ${this.emailListCode}`);
    }

    return response;
  },
};
