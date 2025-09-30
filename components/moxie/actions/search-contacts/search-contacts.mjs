import moxie from "../../moxie.app.mjs";

export default {
  key: "moxie-search-contacts",
  name: "Search Contacts",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Searches contacts in your workspace. [See the documentation](https://help.withmoxie.com/en/articles/8259974-search-contacts)",
  type: "action",
  props: {
    moxie,
    query: {
      type: "string",
      label: "Query",
      description: "Search string that can match first name, last name, or email",
    },
  },
  async run({ $ }) {
    const response = await this.moxie.listContacts({
      params: {
        query: this.query,
      },
      $,
    });

    if (response?.length) {
      $.export("$summary", `Found ${response.length} contact${response.length === 1
        ? ""
        : "s"} matching query.`);
    }

    return response;
  },
};
