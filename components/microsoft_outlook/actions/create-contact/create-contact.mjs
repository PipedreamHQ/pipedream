import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  type: "action",
  key: "microsoft_outlook-create-contact",
  version: "0.0.1",
  name: "Create Contact",
  description: "Add a contact to the root Contacts folder, [See the docs](https://docs.microsoft.com/en-us/graph/api/user-post-contacts)",
  props: {
    microsoftOutlook,
    givenName: {
      label: "Given name",
      description: "Given name of the contact",
      type: "string",
      optional: true,
    },
    surname: {
      label: "Surname",
      description: "Surname of the contact",
      type: "string",
      optional: true,
    },
    displayName: {
      label: "Display Name",
      description: "Display name of the contact",
      type: "string",
      optional: true,
    },
    emailAddresses: {
      label: "Email adresses",
      description: "Email addresses",
      type: "string[]",
    },
    businessPhones: {
      label: "Business Phones",
      description: "Array of phone numbers",
      type: "string[]",
      optional: true,
    },
    expand: {
      propDefinition: [
        microsoftOutlook,
        "expand",
      ],
      description: "Additional contact details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/contact)",
    },
  },
  async run({ $ }) {
    const response = await this.microsoftOutlook.createContact({
      $,
      data: {
        givenName: this.givenName,
        surname: this.surname,
        emailAddresses: this.emailAddresses.map((a, i) => ({
          address: a,
          name: `Email #${i + 1}`,
        })),
        businessPhones: this.businessPhones,
        ...this.expand,
      },
    });
    $.export("$summary", "Contact has been created.");
    return response;
  },
};
