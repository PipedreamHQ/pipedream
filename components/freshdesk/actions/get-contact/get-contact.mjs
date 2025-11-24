import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-get-contact",
  name: "Get Contact",
  description: "Get a contact from Freshdesk. [See the documentation](https://developers.freshdesk.com/api/#view_contact)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshdesk,
    contactId: {
      propDefinition: [
        freshdesk,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const contact = await this.freshdesk.getContact({
      $,
      contactId: this.contactId,
    });
    $.export("$summary", `Successfully fetched contact: ${contact.name}`);
    return contact;
  },
};
