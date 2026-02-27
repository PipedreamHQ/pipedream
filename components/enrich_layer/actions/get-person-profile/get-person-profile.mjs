import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-person-profile",
  name: "Get Person Profile",
  description: "Get structured data of a Person Profile from a professional network URL. Cost: 1 credit per successful request. [See the docs](https://enrichlayer.com/docs).",
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
    extra: {
      propDefinition: [
        enrichlayer,
        "includeExclude",
      ],
      label: "Include Extra Data",
      description: "Enriches the profile with extra details (gender, birth date, industry, interests). Costs 1 extra credit when set to `include`.",
    },
    githubProfileId: {
      propDefinition: [
        enrichlayer,
        "includeExclude",
      ],
      label: "Include GitHub Profile ID",
      description: "Enriches the profile with GitHub ID. Costs 1 extra credit when set to `include`.",
    },
    facebookProfileId: {
      propDefinition: [
        enrichlayer,
        "includeExclude",
      ],
      label: "Include Facebook Profile ID",
      description: "Enriches the profile with Facebook ID. Costs 1 extra credit when set to `include`.",
    },
    twitterProfileId: {
      propDefinition: [
        enrichlayer,
        "includeExclude",
      ],
      label: "Include Twitter Profile ID",
      description: "Enriches the profile with Twitter ID. Costs 1 extra credit when set to `include`.",
    },
    personalContactNumber: {
      propDefinition: [
        enrichlayer,
        "includeExclude",
      ],
      label: "Include Personal Contact Numbers",
      description: "Includes personal phone numbers. Costs 1 extra credit per number when set to `include`.",
    },
    personalEmail: {
      propDefinition: [
        enrichlayer,
        "includeExclude",
      ],
      label: "Include Personal Emails",
      description: "Includes personal emails. Costs 1 extra credit per email when set to `include`.",
    },
    inferredSalary: {
      propDefinition: [
        enrichlayer,
        "includeExclude",
      ],
      label: "Include Inferred Salary (Deprecated)",
      description: "[DEPRECATED] Include inferred salary range. Costs 1 extra credit when set to `include`.",
    },
    skills: {
      type: "string",
      label: "Include Skills",
      description: "Include skills data. No extra credit charged.",
      optional: true,
      options: [
        {
          label: "Exclude (default)",
          value: "exclude",
        },
        {
          label: "Include",
          value: "include",
        },
      ],
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
    if (!this.profileUrl && !this.twitterProfileUrl && !this.facebookProfileUrl) {
      throw new Error("At least one of Profile URL, Twitter/X Profile URL, or Facebook Profile URL must be provided.");
    }
    const response = await this.enrichlayer._makeRequest({
      $,
      path: "/api/v2/profile",
      params: {
        profile_url: this.profileUrl,
        twitter_profile_url: this.twitterProfileUrl,
        facebook_profile_url: this.facebookProfileUrl,
        extra: this.extra,
        github_profile_id: this.githubProfileId,
        facebook_profile_id: this.facebookProfileId,
        twitter_profile_id: this.twitterProfileId,
        personal_contact_number: this.personalContactNumber,
        personal_email: this.personalEmail,
        inferred_salary: this.inferredSalary,
        skills: this.skills,
        use_cache: this.useCache,
        fallback_to_cache: this.fallbackToCache,
        live_fetch: this.liveFetch,
      },
    });
    $.export("$summary", "Successfully retrieved person profile");
    return response;
  },
};
