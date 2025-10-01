import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  type: "action",
  key: "microsoft_outlook-create-contact",
  version: "0.0.18",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Contact",
  description: "Add a contact to the root Contacts folder, [See the documentation](https://docs.microsoft.com/en-us/graph/api/user-post-contacts)",
  props: {
    microsoftOutlook,
    givenName: {
      propDefinition: [
        microsoftOutlook,
        "givenName",
      ],
    },
    surname: {
      propDefinition: [
        microsoftOutlook,
        "surname",
      ],
    },
    emailAddresses: {
      propDefinition: [
        microsoftOutlook,
        "emailAddresses",
      ],
    },
    businessPhones: {
      propDefinition: [
        microsoftOutlook,
        "businessPhones",
      ],
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
