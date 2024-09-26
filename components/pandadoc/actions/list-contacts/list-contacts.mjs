import app from "../../pandadoc.app.mjs";

export default {
  key: "pandadoc-list-contacts",
  name: "List Contacts",
  description: "List all contacts within an account. [See the documentation here](https://developers.pandadoc.com/reference/list-contacts)",
  type: "action",
  version: "0.0.7",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listContacts({
      $,
    });

    $.export("$summary", `Successfully fetched ${response?.results?.length} contact(s).`);
    return response;
  },
};
