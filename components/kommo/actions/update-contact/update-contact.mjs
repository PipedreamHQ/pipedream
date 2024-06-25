import kommo from "../../kommo.app.mjs";

export default {
  key: "kommo-update-contact",
  name: "Update Contact",
  description: "Updates the details of an existing contact in the Kommo app. [See the documentation](https://www.kommo.com/developers/content/api_v4/contacts-api/#contacts-edit)",
  version: "0.0.1",
  type: "action",
  props: {
    kommo,
    contactId: {
      propDefinition: [
        kommo,
        "contactId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Contact fullname.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact last name.",
      optional: true,
    },
    responsibleUserId: {
      propDefinition: [
        kommo,
        "userId",
      ],
      optional: true,
    },
    customFieldsValues: {
      propDefinition: [
        kommo,
        "customFieldsValues",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.kommo.updateContact({
      $,
      contactId: this.contactId,
      data: {
        name: this.name,
        first_name: this.firstName,
        last_name: this.lastName,
        responsible_user_id: this.responsibleUserId,
        custom_fields_values: this.customFieldsValues,
      },
    });

    $.export("$summary", `Successfully updated contact with Id: ${this.contactId}`);
    return response;
  },
};
