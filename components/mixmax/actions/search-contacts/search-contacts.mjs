import common from "../common/base.mjs";

export default {
  ...common,
  key: "mixmax-search-contacts",
  name: "Search Contacts",
  description: "Search for matching contacts. This API queries across different sources including mixmax, google directory, and salesforce (contacts, leads, accounts, and opportunities). [See the docs here](https://developer.mixmax.com/reference/contactsquery)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    q: {
      type: "string",
      label: "Q",
      description: "The string to search.",
    },
    includeSalesforceContacts: {
      type: "boolean",
      label: "Include Salesforce Contacts",
      description: "Whether to include Salesforce data in the query results if it exists.",
      optional: true,
    },
    includeSalesforceAccounts: {
      type: "boolean",
      label: "Include Salesforce Accounts",
      description: "Whether to include a list of matching Salesforce Accounts in the query results.",
      optional: true,
    },
    includeSalesforceOpportunities: {
      type: "boolean",
      label: "Include Salesforce Opportunities",
      description: "Whether to include a list of matching Salesforce Opportunities in the results.",
      optional: true,
    },
  },
  methods: {
    async processEvent() {
      const {
        q,
        includeSalesforceContacts,
        includeSalesforceAccounts,
        includeSalesforceOpportunities,
      } = this;

      return this.mixmax.queryContacts({
        params: {
          q,
          includeSalesforceContacts,
          includeSalesforceAccounts,
          includeSalesforceOpportunities,
        },
      });
    },
    getSummary() {
      return "Contact Successfully fetched!";
    },
  },
};
