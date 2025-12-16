import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-contact-list",
  name: "Get Contact List",
  description: "Retrieves a list of contacts from Upsales. [See the documentation](https://api.upsales.com/#a2a0dc79-a473-4ae4-891d-c31333a221d0)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listContacts({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.length || 0} contact(s)`);
    return response;
  },
};

