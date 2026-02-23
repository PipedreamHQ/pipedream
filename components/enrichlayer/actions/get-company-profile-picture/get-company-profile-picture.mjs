import enrichlayer from "../../enrichlayer.app.mjs";

export default {
  key: "enrichlayer-get-company-profile-picture",
  name: "Get Company Profile Picture",
  description: "Get the profile picture of a company from cached profiles. Cost: 0 credits. [See the docs](https://enrichlayer.com/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    companyProfileUrl: {
      propDefinition: [
        enrichlayer,
        "companyProfileUrl",
      ],
      description: "The professional network URL of the company whose profile picture you want to retrieve (e.g., `https://www.linkedin.com/company/apple/`).",
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer._makeRequest({
      $,
      path: "/api/v2/company/profile-picture",
      params: {
        company_profile_url: this.companyProfileUrl,
      },
    });
    $.export("$summary", "Successfully retrieved company profile picture");
    return response;
  },
};
