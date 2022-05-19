import { removeNullEntries } from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-get-campaign",
  name: "Get Campaign",
  description: "Gets metadata of a specific campaign. [See docs here](https://mailchimp.com/developer/marketing/api/campaigns/get-campaign-info/)",
  version: "0.0.1",
  type: "action",
  props: {
    mailchimp,
    campaignId: {
      type: "string",
      label: "Campaign Id",
      description: "The unique id for the campaign",
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "A string list of fields to return. Reference parameters of sub-objects with dot notation.",
      optional: true,
    },
    excludeFields: {
      type: "string[]",
      label: "Exclude Fields",
      description: "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation.",
    },
  },
  async run({ $ }) {
    const {
      fields,
      excludeFields,
      campaignId,
    } = this;
    const payload =  removeNullEntries({
      fields: fields.join(","),
      exclude_fields: excludeFields.join(","),
      campaignId,
    });
    const response = await this.mailchimp.getCampaign($, payload);
    response && $.export("$summary", "Successfully retrieved campaign");
    return response;
  },
};
