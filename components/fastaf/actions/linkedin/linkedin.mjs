import fastaf from "../../fastaf.app.mjs";

export default {
  key: "fastaf-linkedin",
  name: "Get LinkedIn Profile",
  description: "Retrieve a public LinkedIn person profile. Costs 60 credits, including premium mode. [Documentation](https://fastaf.co/docs/#linkedin)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fastaf,
    profileId: {
      type: "string",
      label: "Profile ID",
      description: "Public person-profile slug from the `/in/<id>/` part of a LinkedIn URL, not the full URL. This action does not access private profiles or company pages. [Documentation](https://fastaf.co/docs/#linkedin)",
    },
    premium: {
      propDefinition: [
        fastaf,
        "premium",
      ],
      label: "Premium Profile Retrieval",
      description: "Enable the premium public-profile retrieval option. Default false; both modes cost 60 FastAF credits. [Documentation](https://fastaf.co/docs/#linkedin)",
    },
  },
  async run({ $ }) {
    const { data } = await this.fastaf.linkedin({
      $,
      data: {
        id: this.profileId,
        type: "profile",
        premium: this.premium,
      },
    });
    $.export("$summary", "Successfully retrieved public profile data.");
    return data;
  },
};
