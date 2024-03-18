import outscraper from "../../outscraper.app.mjs";

export default {
  key: "outscraper-scrape-emails-contacts",
  name: "Scrape Emails and Contacts",
  description: "Finds email addresses, social links, and phone numbers from given domains. [See the documentation](https://app.outscraper.com/api-docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    outscraper,
    domain: outscraper.propDefinitions.domain,
  },
  async run({ $ }) {
    const response = await this.outscraper.findDomainData({
      domain: this.domain,
    });
    $.export("$summary", `Successfully retrieved data for domain ${this.domain}`);
    return response;
  },
};
