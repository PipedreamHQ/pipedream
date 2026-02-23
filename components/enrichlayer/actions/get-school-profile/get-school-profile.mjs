import enrichlayer from "../../enrichlayer.app.mjs";

export default {
  key: "enrichlayer-get-school-profile",
  name: "Get School Profile",
  description: "Get structured data of a School Profile from a professional network URL. Cost: 1 credit per successful request. [See the docs](https://enrichlayer.com/docs).",
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
      type: "string",
      label: "School Profile URL",
      description: "The professional network URL of the school (e.g., `https://www.linkedin.com/school/national-university-of-singapore`).",
    },
    useCache: {
      propDefinition: [
        enrichlayer,
        "useCache",
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
      path: "/api/v2/school",
      params: {
        url: this.url,
        use_cache: this.useCache,
        live_fetch: this.liveFetch,
      },
    });
    $.export("$summary", `Successfully retrieved school profile for ${this.url}`);
    return response;
  },
};
