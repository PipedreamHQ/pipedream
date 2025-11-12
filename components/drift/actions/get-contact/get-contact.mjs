import drift from "../../drift.app.mjs";

export default {
  key: "drift-get-contact",
  name: "Get Contact",
  description: "Retrieves a contact in Drift by ID or email. [See the documentation](https://devdocs.drift.com/docs/retrieving-contact)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    drift,
    emailOrId: {
      type: "string",
      label: "Email or Id",
      description: "The contact's email address or ID",
    },
  },

  async run({ $ }) {

    const {
      drift, emailOrId,
    } = this;

    const response = await drift.getContactByEmailOrId($, emailOrId);

    const contact = response.data[0] || response.data;

    if (!contact) {
      throw new Error("Failed to get contact");
    };

    $.export("$summary", `Contact ${contact.attributes.email} ID "${contact.id}"`
      + " has been fetched successfully.");

    return contact;
  },
};
