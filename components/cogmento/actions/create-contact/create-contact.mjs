import cogmento from "../../cogmento.app.mjs";

export default {
  key: "cogmento-create-contact",
  name: "Create Contact",
  description: "Create a new contact in Cogmento CRM. [See the documentation](https://api.cogmento.com/static/swagger/index.html#/Contacts/post_contacts_)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cogmento,
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
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the contact",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Array of tags associated with the contact",
      optional: true,
    },
    doNotCall: {
      type: "boolean",
      label: "Do Not Call",
      description: "Set to `true` to mark the contact as Do Not Call",
      optional: true,
    },
    doNotText: {
      type: "boolean",
      label: "Do Not Text",
      description: "Set to `true` to mark the contact as Do Not Text",
      optional: true,
    },
    doNotEmail: {
      type: "boolean",
      label: "Do Not Email",
      description: "Set to `true` to mark the contact as Do Not Email",
      optional: true,
    },
  },
  async run({ $ }) {
    const channels = [];
    if (this.email) {
      channels.push({
        channel_type: "Email",
        value: this.email,
      });
    }
    if (this.phone) {
      channels.push({
        channel_type: "Phone",
        value: this.phone,
      });
    }

    const response = await this.cogmento.createContact({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        channels,
        description: this.description,
        tags: this.tags,
        do_not_call: this.doNotCall,
        do_not_text: this.doNotText,
        do_not_email: this.doNotEmail,
      },
    });
    $.export("$summary", `Successfully created contact: ${this.firstName} ${this.lastName}`);
    return response;
  },
};
