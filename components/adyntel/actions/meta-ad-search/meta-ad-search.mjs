import adyntel from "../../adyntel.app.mjs";

export default {
  key: "adyntel-meta-ad-search",
  name: "Meta Ad Search",
  description: "Searches the Meta ad library. [See the documentation](https://docs.adyntel.com/ad-libraries/meta-ad-search)",
  version: "0.0.2",
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
    countryCode: {
      propDefinition: [
        adyntel,
        "countryCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.adyntel.metaAdSearch({
      $,
      data: {
        keyword: this.keyword,
        country_code: this.countryCode,
      },
    });
    $.export("$summary", `Successfully performed Meta ad search with keyword: \`${this.keyword}\`${this.countryCode
      ? ` and country code: \`${this.countryCode}\``
      : ""}`);
    return response;
  },
};
