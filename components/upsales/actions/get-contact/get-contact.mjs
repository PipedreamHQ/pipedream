import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-contact",
  name: "Get Contact",
  description: "Retrieves a single contact by ID from Upsales. [See the documentation](https://api.upsales.com/#07e5839b-2043-4d89-97c3-61be8b8ffe93)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getContact({
      $,
      contactId: this.contactId,
    });

    $.export("$summary", `Successfully retrieved contact: ${response.name || this.contactId}`);
    return response;
  },
};

