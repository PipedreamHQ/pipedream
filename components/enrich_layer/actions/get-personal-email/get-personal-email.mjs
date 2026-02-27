import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-personal-email",
  name: "Get Personal Email",
  description: "Find personal email addresses associated with a given social media profile. Cost: 1 credit per email returned. [See the documentation](https://enrichlayer.com/docs/api/v2/contact-api/personal-email-lookup).",
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
      description: "The professional network profile URL to extract personal emails from. Provide only one of: Profile URL, Twitter/X URL, or Facebook URL.",
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
    emailValidation: {
      type: "string",
      label: "Email Validation",
      description: "How to validate each email found.",
      optional: true,
      options: [
        {
          label: "None (default)",
          value: "none",
        },
        {
          label: "Fast (no extra credit)",
          value: "fast",
        },
        {
          label: "Precise (+1 credit/email)",
          value: "precise",
        },
      ],
    },
    pageSize: {
      propDefinition: [
        enrichlayer,
        "pageSize",
      ],
      description: "Maximum number of emails returned. Default is 0 (no limit). Useful for limiting credit consumption.",
    },
  },
  async run({ $ }) {
    const inputs = [
      this.profileUrl,
      this.twitterProfileUrl,
      this.facebookProfileUrl,
    ].filter(Boolean);
    if (inputs.length !== 1) {
      throw new Error("Provide exactly one of Profile URL, Twitter/X Profile URL, or Facebook Profile URL.");
    }
    const response = await this.enrichlayer.getPersonalEmail({
      $,
      params: {
        profile_url: this.profileUrl,
        twitter_profile_url: this.twitterProfileUrl,
        facebook_profile_url: this.facebookProfileUrl,
        email_validation: this.emailValidation,
        page_size: this.pageSize,
      },
    });
    $.export("$summary", `Successfully retrieved personal emails for ${this.profileUrl || this.twitterProfileUrl || this.facebookProfileUrl}`);
    return response;
  },
};
