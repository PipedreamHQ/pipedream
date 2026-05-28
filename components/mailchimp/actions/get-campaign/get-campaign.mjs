import {
  removeNullEntries, commaSeparateArray,
} from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-get-campaign",
  name: "Get Campaign",
  description: "Gets metadata of a specific campaign. [See docs here](https://mailchimp.com/developer/marketing/api/campaigns/get-campaign-info/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mailchimp,
    campaignId: {
      propDefinition: [
        mailchimp,
        "campaignId",
      ],
    },
    fields: {
      propDefinition: [
        mailchimp,
        "fields",
      ],
    },
    excludeFields: {
      propDefinition: [
        mailchimp,
        "excludeFields",
      ],
    },
  },
  async run({ $ }) {
    const {
      fields,
      excludeFields,
      campaignId,
    } = this;
    const payload = removeNullEntries({
      fields: commaSeparateArray(fields),
      exclude_fields: commaSeparateArray(excludeFields),
      campaignId,
    });
    const response = await this.mailchimp.getCampaign($, payload);
    response && $.export("$summary", "Successfully retrieved campaign");
    return response;
  },
};
