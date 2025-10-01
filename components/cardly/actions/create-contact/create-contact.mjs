import cardly from "../../cardly.app.mjs";

export default {
  key: "cardly-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Cardly. [See the documentation](https://api.card.ly/v2/docs#endpoint-create-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cardly,
    listId: {
      propDefinition: [
        cardly,
        "listId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of a contact.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of a contact, if known / applicable.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "An email address for this contact, if supplied, which can be used to uniquely identify this contact for subsequent actions.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company a contact belongs to, if required.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The primary address line, including street number, name and type.",
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "A secondary address line, typically containing a unit, apartment, suite number etc.",
      optional: true,
    },
    locality: {
      type: "string",
      label: "Locality",
      description: "A suburb or city for the contact.",
    },
    region: {
      type: "string",
      label: "Region",
      description: "The state or province for this address.",
    },
    country: {
      type: "string",
      label: "Country",
      description: "A 2-character ISO code identifying the contact's country.",
    },
    postcode: {
      type: "string",
      label: "Postcode",
      description: "A postal code or ZIP code for this contact, where required by local addressing formats.",
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "Any external identifier you have supplied for this contact which can be used to update this contact in future calls.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.cardly.createContact({
      listId: this.listId,
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        company: this.company,
        address: this.address,
        address2: this.address2,
        locality: this.locality,
        region: this.region,
        country: this.country,
        postcode: this.postcode,
        externalId: this.externalId,
      },
      $,
    });

    if (data?.id) {
      $.export("summary", `Successully created contact with ID ${data.id}.`);
    }

    return data;
  },
};
