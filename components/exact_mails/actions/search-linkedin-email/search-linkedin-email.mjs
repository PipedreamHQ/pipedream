import base from "../common/base.mjs";

export default {
  ...base,
  key: "exact_mails-search-linkedin-email",
  name: "Search LinkedIn Email",
  description: "Search for linkedin email in Exact Mails. [See the documentation](https://dashboard.exactmails.com/documentation)",
  version: "0.0.1",
  type: "action",
  props: {
    ...base.props,
    linkedin: {
      type: "string",
      label: "LinkedIn Profile",
      description: "The linkedin profile of the person to search for.",
    },
  },
  methods: {
    getFn() {
      return this.exactMails.searchLinkedinEmail;
    },
    getData() {
      return {
        linkedin_url: this.linkedin,
      };
    },
  },
};
