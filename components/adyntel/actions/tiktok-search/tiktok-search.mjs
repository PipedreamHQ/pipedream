import adyntel from "../../adyntel.app.mjs";

export default {
  key: "adyntel-tiktok-search",
  name: "Search TikTok Ads",
  description: "Search TikTok ads using a keyword. [See the documentation](https://docs.adyntel.com/ad-libraries/tiktok-search)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    adyntel,
    keyword: {
      propDefinition: [
        adyntel,
        "keyword",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.adyntel.getTiktokAds({
      $,
      data: {
        keyword: this.keyword,
      },
    });
    $.export("$summary", `Successfully retrieved TikTok ads for keyword: \`${this.keyword}\``);
    return response;
  },
};
