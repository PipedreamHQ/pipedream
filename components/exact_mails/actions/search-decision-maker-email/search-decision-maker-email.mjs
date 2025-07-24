import base from "../common/base.mjs";

export default {
  ...base,
  key: "exact_mails-search-decision-maker-email",
  name: "Search Decision Maker Email",
  description: "Search for decision maker email in Exact Mails. [See the documentation](https://dashboard.exactmails.com/documentation)",
  version: "0.0.1",
  type: "action",
  props: {
    ...base.props,
    companyDomain: {
      type: "string",
      label: "Company Domain",
      description: "The company domain of the decision maker to search for.",
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role of the decision maker to search for.",
      optional: true,
    },
  },
  methods: {
    getFn() {
      return this.exactMails.searchDecisionMakerEmail;
    },
    getData() {
      return {
        company_domain: this.companyDomain,
        role: this.role,
      };
    },
  },
};
