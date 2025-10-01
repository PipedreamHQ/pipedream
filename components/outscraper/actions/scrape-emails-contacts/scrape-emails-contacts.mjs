import outscraper from "../../outscraper.app.mjs";
import preferredContacts from "../../common/constants/preferredContacts.mjs";

export default {
  key: "outscraper-scrape-emails-contacts",
  name: "Scrape Emails and Contacts",
  description: "Finds email addresses, social links, and phone numbers from given domains. [See the documentation](https://app.outscraper.com/api-docs#tag/Email-Related/paths/~1emails-and-contacts/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    outscraper,
    query: {
      type: "string",
      label: "Domain",
      description: "Domain or link, e.g. `pipedream.com`",
    },
    preferredContacts: {
      type: "string[]",
      label: "Preferred Contacts",
      description: "The preferred contacts to find.",
      optional: true,
      options: preferredContacts,
    },
  },
  async run({ $ }) {
    const {
      outscraper, ...params
    } = this;
    const response = await outscraper.findDomainData({
      $,
      params,
      paramsSerializer: {
        indexes: null,
      },
    });
    $.export("$summary", `Successfully retrieved data for domain ${this.domain}`);
    return response;
  },
};
