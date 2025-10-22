import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-create-contact",
  name: "Create Contact",
  description: "Creates a contact in your help desk portal. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Contacts#Contacts_CreateContact)",
  type: "action",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zohoDesk,
    orgId: {
      propDefinition: [
        zohoDesk,
        "orgId",
      ],
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email ID of the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "Mobile number of the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      orgId,
      lastName,
      firstName,
      email,
      phone,
      mobile,
    } = this;

    const response = await this.zohoDesk.createContact({
      headers: {
        orgId,
      },
      data: {
        lastName,
        firstName,
        email,
        phone,
        mobile,
      },
    });

    $.export("$summary", `Successfully created a new contact with ID ${response.id}`);

    return response;
  },
};
