import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-update-contact",
  name: "Update Contact",
  description: "Updates details of an existing contact. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Contacts#Contacts_Updateacontact)",
  type: "action",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
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
    contactId: {
      propDefinition: [
        zohoDesk,
        "contactId",
        ({ orgId }) => ({
          orgId,
        }),
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
      contactId,
      lastName,
      firstName,
      email,
      phone,
      mobile,
    } = this;

    const response = await this.zohoDesk.updateContact({
      contactId,
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

    $.export("$summary", `Successfully updated contact with ID ${response.id}`);

    return response;
  },
};
