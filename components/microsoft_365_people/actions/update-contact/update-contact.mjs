import microsoftPeople from "../../microsoft_365_people.app.mjs";
import pickBy from "lodash.pickby";

export default {
  key: "microsoft_365_people-update-contact",
  name: "Update Contact",
  description: "Updates an existing contact in Microsoft 365 People. [See the documentation](https://learn.microsoft.com/en-us/graph/api/contact-update?view=graph-rest-1.0&tabs=http)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoftPeople,
    folderId: {
      propDefinition: [
        microsoftPeople,
        "folderId",
      ],
      description: "Folder currently containing the contact to update",
    },
    contactId: {
      propDefinition: [
        microsoftPeople,
        "contactId",
        (c) => ({
          folderId: c.folderId,
        }),
      ],
    },
    email: {
      propDefinition: [
        microsoftPeople,
        "email",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        microsoftPeople,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        microsoftPeople,
        "lastName",
      ],
    },
    mobilePhone: {
      propDefinition: [
        microsoftPeople,
        "mobilePhone",
      ],
    },
    homePhones: {
      propDefinition: [
        microsoftPeople,
        "homePhones",
      ],
    },
    street: {
      propDefinition: [
        microsoftPeople,
        "street",
      ],
    },
    city: {
      propDefinition: [
        microsoftPeople,
        "city",
      ],
    },
    state: {
      propDefinition: [
        microsoftPeople,
        "state",
      ],
    },
    postalCode: {
      propDefinition: [
        microsoftPeople,
        "postalCode",
      ],
    },
    countryOrRegion: {
      propDefinition: [
        microsoftPeople,
        "countryOrRegion",
      ],
    },
  },
  async run({ $ }) {
    const data = pickBy({
      givenName: this.firstName,
      surname: this.lastName,
      mobilePhone: this.mobilePhone,
      homePhones: this.homePhones,
    });

    if (this.email) {
      data.emailAddresses = [
        {
          address: this.email,
        },
      ];
    }

    if (this.street || this.city || this.state || this.postalCode || this.country) {
      data.homeAddress = pickBy({
        street: this.street,
        city: this.city,
        state: this.state,
        postalCode: this.postalCode,
        countryOrRegion: this.countryOrRegion,
      });
    }

    const response = this.folderId
      ? await this.microsoftPeople.updateContactInFolder({
        folderId: this.folderId,
        contactId: this.contactId,
        data,
        $,
      })
      : await this.microsoftPeople.updateContact({
        contactId: this.contactId,
        data,
        $,
      });

    if (response.id) {
      $.export("$summary", `Successfully updated contact with ID ${response.id}.`);
    }

    return response;
  },
};
