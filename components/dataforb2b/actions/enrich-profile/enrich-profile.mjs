import dataforb2b from "../../dataforb2b.app.mjs";

export default {
  key: "dataforb2b-enrich-profile",
  name: "Enrich Profile",
  description: "Enrich a person's profile with verified work email, personal email, phone number, and GitHub data. [See the documentation](https://docs.dataforb2b.ai/api-reference/enrich-profile)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    dataforb2b,
    profileIdentifier: {
      propDefinition: [
        dataforb2b,
        "profileIdentifier",
      ],
    },
    enrichProfile: {
      propDefinition: [
        dataforb2b,
        "enrichProfile",
      ],
    },
    enrichWorkEmail: {
      propDefinition: [
        dataforb2b,
        "enrichWorkEmail",
      ],
    },
    enrichPersonalEmail: {
      propDefinition: [
        dataforb2b,
        "enrichPersonalEmail",
      ],
    },
    enrichPhone: {
      propDefinition: [
        dataforb2b,
        "enrichPhone",
      ],
    },
    enrichGithub: {
      propDefinition: [
        dataforb2b,
        "enrichGithub",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataforb2b.enrichProfile({
      $,
      data: {
        profile_identifier: this.profileIdentifier,
        enrich_profile: this.enrichProfile,
        enrich_work_email: this.enrichWorkEmail,
        enrich_personal_email: this.enrichPersonalEmail,
        enrich_phone: this.enrichPhone,
        enrich_github: this.enrichGithub,
      },
    });

    const name = response.profile?.name || this.profileIdentifier;
    $.export("$summary", `Successfully enriched profile for ${name}`);
    return response;
  },
};
