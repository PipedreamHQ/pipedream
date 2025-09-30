import offorte from "../../offorte.app.mjs";

export default {
  key: "offorte-search-contact-people",
  name: "Search Contact People",
  description: "Search for a contact person in Offorte. [See the documentation](https://www.offorte.com/api-docs/api#tag/Contacts/operation/contactsPeopleList)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    offorte,
    query: {
      type: "string",
      label: "Query",
      description: "The query to search by name or email",
    },
  },
  async run({ $ }) {
    const response = await this.offorte.listContacts({
      $,
      params: {
        query: this.query,
      },
    });

    $.export("$summary", `Successfully found ${response.length} contact(s)`);
    return response;
  },
};
