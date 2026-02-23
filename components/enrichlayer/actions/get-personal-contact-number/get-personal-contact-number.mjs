import enrichlayer from "../../enrichlayer.app.mjs";

export default {
  key: "enrichlayer-get-personal-contact-number",
  name: "Get Personal Contact Number",
  description: "Find personal phone numbers associated with a given social media profile. Cost: 1 credit per contact number returned. [See the docs](https://enrichlayer.com/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    profileUrl: {
      propDefinition: [
        enrichlayer,
        "profileUrl",
      ],
      description: "The professional network profile URL to extract personal contact numbers from. Provide only one of: Profile URL, Twitter/X URL, or Facebook URL.",
    },
    twitterProfileUrl: {
      propDefinition: [
        enrichlayer,
        "twitterProfileUrl",
      ],
    },
    facebookProfileUrl: {
      propDefinition: [
        enrichlayer,
        "facebookProfileUrl",
      ],
    },
    pageSize: {
      propDefinition: [
        enrichlayer,
        "pageSize",
      ],
      description: "Maximum number of contact numbers returned. Default is 0 (no limit). Useful for limiting credit consumption.",
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer._makeRequest({
      $,
      path: "/api/v2/contact-api/personal-contact",
      params: {
        profile_url: this.profileUrl,
        twitter_profile_url: this.twitterProfileUrl,
        facebook_profile_url: this.facebookProfileUrl,
        page_size: this.pageSize,
      },
    });
    $.export("$summary", "Successfully retrieved personal contact numbers");
    return response;
  },
};
