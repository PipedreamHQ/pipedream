import common from "../common/common.mjs";
import { getAdditionalFields } from "../common/props.mjs";
import {
  parseObject, parseStringObject,
} from "../../common/utils.mjs";
const docLink = "https://developers.google.com/google-ads/api/reference/rpc/v22/KeywordPlanIdeaService/GenerateKeywordIdeas?transport=rest";

export default {
  key: "google_ads-generate-keyword-ideas",
  name: "Generate Keyword Ideas",
  description: `Generate keyword ideas using the Google Ads API. [See the documentation](${docLink})`,
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ...common.props,
    additionalFields: getAdditionalFields(docLink),
  },
  async run({ $ }) {
    const additionalFields = parseObject(parseStringObject(this.additionalFields));
    const response = await this.googleAds.generateKeywordIdeas({
      $,
      accountId: this.accountId,
      customerClientId: this.customerClientId,
      data: {
        ...additionalFields,
      },
    });
    $.export("$summary", "Successfully generated keyword ideas.");
    return response;
  },
};
