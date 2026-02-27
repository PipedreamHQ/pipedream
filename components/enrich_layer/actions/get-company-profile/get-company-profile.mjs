import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-company-profile",
  name: "Get Company Profile",
  description: "Get structured data of a Company Profile from a professional network URL. Cost: 1 credit per successful request. [See the docs](https://enrichlayer.com/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    url: {
      propDefinition: [
        enrichlayer,
        "companyProfileUrl",
      ],
    },
    categories: {
      propDefinition: [
        enrichlayer,
        "includeExclude",
      ],
      label: "Include Categories",
      description: "Append categories data for this company. Costs 1 extra credit when set to `include`.",
    },
    fundingData: {
      propDefinition: [
        enrichlayer,
        "includeExclude",
      ],
      label: "Include Funding Data",
      description: "Returns a list of funding rounds this company has received. Costs 1 extra credit when set to `include`.",
    },
    exitData: {
      propDefinition: [
        enrichlayer,
        "includeExclude",
      ],
      label: "Include Exit Data",
      description: "Returns a list of investment portfolio exits. Costs 1 extra credit when set to `include`.",
    },
    acquisitions: {
      propDefinition: [
        enrichlayer,
        "includeExclude",
      ],
      label: "Include Acquisitions",
      description: "Provides enriched data on acquisitions made by this company. Costs 1 extra credit when set to `include`.",
    },
    extra: {
      propDefinition: [
        enrichlayer,
        "includeExclude",
      ],
      label: "Include Extra Data",
      description: "Enriches the profile with extra details from external sources (Crunchbase ranking, contact email, phone, social accounts, funding, IPO status, etc.). Costs 1 extra credit when set to `include`.",
    },
    useCache: {
      propDefinition: [
        enrichlayer,
        "useCache",
      ],
    },
    fallbackToCache: {
      propDefinition: [
        enrichlayer,
        "fallbackToCache",
      ],
    },
    liveFetch: {
      propDefinition: [
        enrichlayer,
        "liveFetch",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer._makeRequest({
      $,
      path: "/api/v2/company",
      params: {
        url: this.url,
        categories: this.categories,
        funding_data: this.fundingData,
        exit_data: this.exitData,
        acquisitions: this.acquisitions,
        extra: this.extra,
        use_cache: this.useCache,
        fallback_to_cache: this.fallbackToCache,
        live_fetch: this.liveFetch,
      },
    });
    $.export("$summary", `Successfully retrieved company profile for ${this.url}`);
    return response;
  },
};
