import common from "../common.mjs";

export default {
  ...common,
  key: "sendgrid-search-contacts",
  name: "Search Contacts",
  description: "Searches contacts with a SGQL query. [See the docs here](https://docs.sendgrid.com/api-reference/contacts/search-contacts)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    query: {
      type: "string",
      label: "Query",
      description: "The query field accepts valid SGQL for searching for a contact. Only the first 50 contacts will be returned. If the query takes longer than 20 seconds a 408 Request Timeout will be returned.",
    },
  },
  async run({ $ }) {
    const resp = await this.sendgrid.searchContacts(this.query);
    $.export("$summary", "Successfully completed search");
    return resp;
  },
};
