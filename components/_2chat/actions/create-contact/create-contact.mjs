import twoChat from "../../_2chat.app.mjs";

export default {
  key: "_2chat-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in 2Chat. [See the documentation](https://developers.2chat.co/docs/API/Contacts/create-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    twoChat,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact",
    },
    phoneNumber: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact. Example: `+12121112222`",
    },
  },
  async run({ $ }) {
    const response = await this.twoChat.createContact({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        contact_detail: [
          {
            type: "E",
            value: this.email,
          },
          {
            type: "PH",
            value: this.phoneNumber,
          },
        ],
      },
    });
    $.export("$summary", `Successfully created contact ${this.firstName} ${this.lastName}`);
    return response;
  },
};
