import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-create-contact",
  name: "Create Contact",
  description: "Creates a contact in your help desk portal. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Contacts#Contacts_CreateContact)",
  type: "action",
  version: "0.0.8",
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
    accountId: {
      propDefinition: [
        zohoDesk,
        "accountId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Job title of the contact",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description about the contact",
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
      accountId,
      title,
      description,
    } = this;

    const data = {
      lastName,
    };

    // Add optional fields
    if (firstName) data.firstName = firstName;
    if (email) data.email = email;
    if (phone) data.phone = phone;
    if (mobile) data.mobile = mobile;
    if (accountId) data.accountId = accountId;
    if (title) data.title = title;
    if (description) data.description = description;

    const response = await this.zohoDesk.createContact({
      headers: {
        orgId,
      },
      data,
    });

    $.export("$summary", `Successfully created a new contact with ID ${response.id}`);

    return response;
  },
};
