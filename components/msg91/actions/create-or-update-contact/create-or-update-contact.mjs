import { parseObject } from "../../common/utils.mjs";
import app from "../../msg91.app.mjs";

export default {
  key: "msg91-create-or-update-contact",
  name: "Create or Update Contact in Segmento",
  description: "Add or update contact information in Segmento (MSG91's contact management system). [See the documentation](https://docs.msg91.com/segmento/createupdate-contact)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    phonebook: {
      type: "string",
      label: "Phonebook",
      description: "The ID of the phonebook where the contact will be added or updated",
    },
    fields: {
      type: "boolean",
      label: "Fields",
      description: "If fields is true or not set, dynamic fields are created; if false, they aren't",
      default: true,
    },
    input: {
      type: "string",
      label: "Contact Data",
      description: "An object containing contact details. Example: `{ \"name\": \"Name\", \"email\": \"email address\", \"contact_id\": \"if exists update or create\", \"new_field\": \"field_type created based on value \", \"date_field\": \"YYYY-MM-DD HH:MM:SS format\", \"details\": { \"qualification\": \"graduate\", \"age\": 30, \"address\": \"random address\" } }`",
    },
  },
  async run({ $ }) {
    const response = await this.app.createOrUpdateContact({
      $,
      phonebook: this.phonebook,
      data: {
        fields: this.fields,
        input: parseObject(this.input),
      },
    });

    $.export("$summary", `Successfully created/updated contact with ID: ${response.data.contact.id} in phonebook: ${this.phonebook}`);
    return response;
  },
};
