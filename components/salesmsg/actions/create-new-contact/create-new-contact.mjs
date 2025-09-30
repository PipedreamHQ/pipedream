import salesmsg from "../../salesmsg.app.mjs";

export default {
  key: "salesmsg-create-new-contact",
  name: "Create New Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new contact. [See the documentation](https://documenter.getpostman.com/view/13798866/2s935uHgXp#57f25fd9-2de8-4c9c-97f4-79bf7a6eb255)",
  type: "action",
  props: {
    salesmsg,
    number: {
      type: "string",
      label: "Number",
      description: "The phone number of the contact.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact.",
      optional: true,
    },
    colorIndex: {
      type: "string",
      label: "Color Index",
      description: "The color index of the contact.",
      optional: true,
    },
    contactIntegrationId: {
      type: "string",
      label: "Contact Integration Id",
      description: "The integration id of the contact.",
      optional: true,
    },
    phoneType: {
      type: "string",
      label: "Phone Type",
      description: "The type of the phone number. E.g. **phone, etc**",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      salesmsg,
      firstName,
      lastName,
      colorIndex,
      contactIntegrationId,
      phoneType,
      ...params
    } = this;

    const response = await salesmsg.createContact({
      $,
      params: {
        first_name: firstName,
        last_name: lastName,
        color_index: colorIndex,
        contact_integration_id: contactIntegrationId,
        phone_type: phoneType,
        ...params,
      },
    });

    $.export("$summary", `A new contact with Id: ${response.id} was successfully created!`);
    return response;
  },
};
