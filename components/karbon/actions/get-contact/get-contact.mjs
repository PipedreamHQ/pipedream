import app from "../../karbon.app.mjs";

export default {
  key: "karbon-get-contact",
  name: "Get Contact",
  description: "Get the details of one contact, optionally with their business cards, client team and service types."
    + " Use **List Contacts** to find the contact."
    + " [See the documentation](https://karbonhq.github.io/karbon-api-reference/#get-/v3/Contacts/-Contactkey-)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    contactKey: {
      propDefinition: [
        app,
        "contactKey",
      ],
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description: "Related data to include, e.g. `[\"BusinessCards\", \"ClientTeam\"]`.",
      options: [
        "BusinessCards",
        "ClientTeam",
        "ClientAccess",
        "ServiceTypes",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const contact = await this.app.getContact({
      $,
      contactKey: this.contactKey,
      params: {
        $expand: this.expand?.join(","),
      },
    });
    $.export("$summary", `Retrieved contact ${contact.FirstName} ${contact.LastName}`);
    return contact;
  },
};
