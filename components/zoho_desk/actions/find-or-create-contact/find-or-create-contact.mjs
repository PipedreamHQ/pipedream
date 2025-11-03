import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-find-or-create-contact",
  name: "Find or Create Contact",
  description: "Finds or create a contact. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Contacts#Contacts_CreateContact)",
  type: "action",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      description: "Last name of the contact with `wildcard search` strategy",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact with `wildcard search` strategy",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email ID of the contact with `wildcard search` strategy",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      orgId,
      lastName,
      firstName,
      email,
    } = this;

    const { data: contacts = [] } =
      await this.zohoDesk.searchContacts({
        headers: {
          orgId,
        },
        params: {
          lastName: `${lastName}*`,
          firstName: firstName && `${firstName}*`,
          email: email && `${email}*`,
          sortBy: "relevance",
        },
      });

    if (contacts?.length) {
      $.export("$summary", `Successfully found ${contacts.length} contact(s)`);

      return contacts;
    }

    const response = await this.zohoDesk.createContact({
      headers: {
        orgId,
      },
      data: {
        lastName,
        firstName,
        email,
      },
    });

    $.export("$summary", `Successfully created a new contact with ID ${response.id}`);

    return response;
  },
};
