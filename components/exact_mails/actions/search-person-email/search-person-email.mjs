import base from "../common/base.mjs";

export default {
  ...base,
  key: "exact_mails-search-person-email",
  name: "Search Person Email",
  description: "Search for person email in Exact Mails. [See the documentation](https://dashboard.exactmails.com/documentation)",
  version: "0.0.1",
  type: "action",
  props: {
    ...base.props,
    username: {
      type: "string",
      label: "Username",
      description: "The username of the person to search for.",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain of the person to search for.",
      optional: true,
    },
  },
  methods: {
    getFn() {
      return this.exactMails.searchPersonEmails;
    },
    getData() {
      return {
        username: this.username,
        domain: this.domain,
      };
    },
  },
};
