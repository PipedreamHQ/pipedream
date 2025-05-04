import drift from "../../drift.app.mjs";

export default {
  key: "drift-get-contact",
  name: "Get Contact",
  description: "Retrieves a contact in Drift by ID or email. [See the docs](https://devdocs.drift.com/docs/retrieving-contact)",
  version: "0.0.1",
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

    const warnings = [];

    const { drift } = this;

    const emailOrId = drift.trimIfString(this.emailOrId);

    warnings.push(...drift.checkEmailOrId(emailOrId));

    const response = await drift.getContactByEmailOrId($, emailOrId);

    const contact = response.data[0] || response.data;

    if (!contact) {
      throw new Error("Failed to get contact");
    };

    $.export("$summary", `Contact ${contact.attributes.email} ID "${contact.id}"`
      + " fetched successfully." +  warnings.join("\n- "));

    return contact;
  },
};
