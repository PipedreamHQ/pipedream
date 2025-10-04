import { parseObject } from "../../common/utils.mjs";
import instantly from "../../instantly.app.mjs";

export default {
  key: "instantly-add-tags-campaign",
  name: "Add Tags to Campaign",
  description: "Adds tags to a specific campaign. [See the documentation](https://developer.instantly.ai/api/v2/customtag/toggletagresource)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    instantly,
    campaignIds: {
      propDefinition: [
        instantly,
        "campaignId",
      ],
      type: "string[]",
      description: "The campaign IDs to assign tags to",
    },
    tagIds: {
      propDefinition: [
        instantly,
        "tagIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.instantly.addTagsToCampaign({
      $,
      data: {
        campaign_id: this.campaignId,
        tag_ids: parseObject(this.tagIds),
        resource_type: 2,
        assign: true,
        resource_ids: parseObject(this.campaignIds),
      },
    });
    $.export("$summary", "Successfully added tags to campaign(s)");
    return response;
  },
};
