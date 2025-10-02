import insertchat from "../../insertchat.app.mjs";

export default {
  key: "insertchat-create-lead",
  name: "Create Lead",
  description: "Creates a new lead within Insertchat. [See the documentation](https://www.postman.com/gold-star-239225/insertchat/request/uiugp1c/create-a-lead)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    insertchat,
    chatbotId: {
      propDefinition: [
        insertchat,
        "chatbotId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the lead",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the lead",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the lead",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the lead",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the lead",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website of the lead",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company of the lead",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.insertchat.createLead({
      $,
      data: {
        widget_uid: this.chatbotId,
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        phone: this.phone,
        address: this.address,
        website: this.website,
        company: this.company,
      },
    });
    $.export("$summary", `Created lead with ID: ${response.uid}`);
    return response;
  },
};
