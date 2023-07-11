import app from "../../facebook_lead_ads.app.mjs";

export default {
  type: "action",
  key: "facebook_lead_ads-get_lead",
  name: "Get Lead",
  description: "Get Lead Information by Id. [See the documentation](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving#reading-store-locator-question-value)",
  version: "0.0.1",
  props: {
    app,
    id: {
      type: "string",
      label: "Lead Id",
      description: "The ID of the lead to retrieve.",
    },
  },
  async run({ $ }) {
    const lead = await this.app.getLeadById(this.id);
    $.export("summary", `Lead ${this.id} successfully retrieved`);
    return lead;
  },
};
