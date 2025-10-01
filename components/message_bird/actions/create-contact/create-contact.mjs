import messagebird from "../../message_bird.app.mjs";

export default {
  key: "message_bird-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See the documentation](https://developers.messagebird.com/api/contacts/#create-a-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    messagebird,
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact. Example: `31612345678`",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.messagebird.createContact({
      $,
      data: {
        msisdn: this.phone,
        firstName: this.firstName,
        lastName: this.lastName,
      },
    });
    $.export("$summary", `Successfully created contact with ID ${response.id}`);
    return response;
  },
};
