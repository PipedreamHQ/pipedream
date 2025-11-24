import base from "../common/base.mjs";

export default {
  ...base,
  key: "exact_mails-search-company-email",
  name: "Search Company Email",
  description: "Search for company email in Exact Mails. [See the documentation](https://dashboard.exactmails.com/documentation)",
  version: "0.0.1",
  type: "action",
  props: {
    ...base.props,
    companyDomain: {
      type: "string",
      label: "Company Domain",
      description: "The company domain of the company to search for.",
    },
  },
  methods: {
    getFn() {
      return this.exactMails.searchCompanyEmail;
    },
    getData() {
      return {
        company_domain: this.companyDomain,
      };
    },
  },
};
