import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-create-contact",
  name: "Create Contact",
  description: "Create a new contact. See the docs [here](https://developers.activecampaign.com/reference#create-a-contact-new).",
  type: "action",
  version: "0.0.2",
  props: {
    activecampaign,
    email: {
      propDefinition: [
        activecampaign,
        "contactEmail",
      ],
    },
    firstName: {
      propDefinition: [
        activecampaign,
        "contactFirstName",
      ],
    },
    lastName: {
      propDefinition: [
        activecampaign,
        "contactLastName",
      ],
    },
    phone: {
      propDefinition: [
        activecampaign,
        "contactPhone",
      ],
    },
    fieldValues: {
      propDefinition: [
        activecampaign,
        "contactFieldValues",
      ],
    },
  },
  async run({ $ }) {
    let fieldValues;

    if (Array.isArray(this.fieldValues)) {
      fieldValues =
        this.fieldValues.map(({
          label: value,
          value: field,
        }) => ({
          field,
          value,
        }));
    }

    const response =
      await this.activecampaign.createContact({
        $,
        data: {
          contact: {
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            phone: this.phone,
            fieldValues,
          },
        },
      });

    if (!response.contact) {
      throw new Error(JSON.stringify(response));
    }

    $.export("$summary", `Successfully created contact "${response.contact.email}"`);

    return response;
  },
};
