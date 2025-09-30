import app from "../../phoneburner.app.mjs";

export default {
  name: "Get Contacts",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "phoneburner-get-contacts",
  description: "Get a list of contacts. [See the documentation](https://www.phoneburner.com/developer/route_list#contacts)",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getContacts({
      $,
    });

    if (response) {
      $.export("$summary", "Successfully retrieved a list of contacts");
    }

    return response;
  },
};
