import microsoftPeople from "../../microsoft_365_people.app.mjs";

export default {
  key: "microsoft_365_people-create-contact",
  name: "Create Contact",
  description: "Create a new contact in Microsoft 365 People. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-post-contacts?view=graph-rest-1.0&tabs=http)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoftPeople,
    email: {
      propDefinition: [
        microsoftPeople,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        microsoftPeople,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        microsoftPeople,
        "lastName",
      ],
    },
    folderId: {
      propDefinition: [
        microsoftPeople,
        "folderId",
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
    const data = {
      emailAddresses: [
        {
          address: this.email,
        },
      ],
      givenName: this.firstName,
      surname: this.lastName,
      mobilePhone: this.mobilePhone,
      homePhones: this.homePhones,
      homeAddress: {
        street: this.street,
        city: this.city,
        state: this.state,
        postalCode: this.postalCode,
        countryOrRegion: this.countryOrRegion,
      },
    };

    const response = this.folderId
      ? await this.microsoftPeople.createContactInFolder({
        folderId: this.folderId,
        data: {
          ...data,
          parentFolderId: this.folderId,
        },
        $,
      })
      : await this.microsoftPeople.createContact({
        data,
        $,
      });

    if (response.id) {
      $.export("$summary", `Successfully created contact with ID ${response.id}.`);
    }

    return response;
  },
};
