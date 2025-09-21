import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  type: "action",
  key: "microsoft_outlook-update-contact",
  version: "0.0.17",
  name: "Update Contact",
  description: "Update an existing contact, [See the docs](https://docs.microsoft.com/en-us/graph/api/user-post-contacts)",
  props: {
    microsoftOutlook,
    contact: {
      propDefinition: [
        microsoftOutlook,
        "contact",
      ],
    },
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
    const emailAddresses = this.emailAddresses && this.emailAddresses.length ?
      this.emailAddresses.map((a, i) => ({
        address: a,
        name: `Email #${i + 1}`,
      })) :
      undefined;
    const response = await this.microsoftOutlook.updateContact({
      $,
      contactId: this.contact,
      data: {
        givenName: this.givenName,
        surname: this.surname,
        emailAddresses,
        businessPhones: this.businessPhones,
        ...this.expand,
      },
    });
    $.export("$summary", "Contact has been updated.");
    return response;
  },
};
