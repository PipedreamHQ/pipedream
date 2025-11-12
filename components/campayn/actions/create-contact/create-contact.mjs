import campayn from "../../campayn.app.mjs";

export default {
  key: "campayn-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See the docs](https://github.com/nebojsac/Campayn-API/blob/master/endpoints/contacts.md#add-a-contact)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    campayn,
    listId: {
      propDefinition: [
        campayn,
        "listId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the new contact",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the new contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the new contact",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the new contact",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the new contact",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the new contact",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip Code",
      description: "Zip code of the new contact",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country of the new contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      email: this.email,
      first_name: this.firstName,
      last_name: this.lastName,
      address: this.address,
      city: this.city,
      state: this.state,
      zip: this.zip,
      country: this.country,
    };

    const response = await this.campayn.createContact(this.listId, {
      data,
      $,
    });

    $.export("$summary", `Successfully created contact ${this.email}.`);

    return response;
  },
};
