import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-search-contacts",
  name: "Search Contacts",
  description: "Searches contacts with a SGQL query. [See the docs here](https://docs.sendgrid.com/api-reference/contacts/search-contacts)",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    query: {
      type: "string",
      label: "Query",
      description: "The query field accepts valid SGQL for searching for a contact (.e.g `email LIKE 'hung.v%'` ). Only the first 50 contacts will be returned. [For more information about SGQL](https://docs.sendgrid.com/for-developers/sending-email/segmentation-query-language)",
    },
  },
  async run({ $ }) {
    const resp = await this.sendgrid.searchContacts(this.query);
    $.export("$summary", "Successfully completed search");
    return resp;
  },
};
