// x-pd-ai: optimized
import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_contacts-search-contacts",
  name: "Search Contacts",
  description:
    "Searches the authenticated user's contacts by name, email address, phone number, organization, or other contact fields. [See the documentation](https://developers.google.com/people/api/rest/v1/people/searchContacts)",
  version: "0.0.1",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": true,
  },
  type: "action",
  props: {
    ...common.props,
    query: {
      type: "string",
      label: "Query",
      description:
        "The search query used to match contacts by fields such as name, email address, phone number, or organization.",
    },
    fields: {
      propDefinition: [
        common.props.googleContacts,
        "fields",
      ],
    },
  },
  methods: {
    async processResults(client) {
      const params = {
        readMask: this.fields.join(),
      };

      await this.googleContacts.searchContacts(client, {
        ...params,
        query: "",
      });

      const { results = [] } = await this.googleContacts.searchContacts(client, {
        ...params,
        query: this.query,
      });

      return results;
    },
    emitSummary($, results) {
      $.export("$summary", `Successfully found ${results.length} contacts`);
    },
  },
};
