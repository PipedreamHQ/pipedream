import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-profile",
  name: "Get Profile",
  description: "Get your Pubrio account profile information. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/profile/profile)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
    profileId: {
      type: "integer",
      label: "Profile ID",
      description: "An identifier for the user profile (workspace). This is optional as the API key already includes your workspace information.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.profileId) data.profile_id = this.profileId;
    const response = await this.pubrio.getProfile({
      $,
      ...(Object.keys(data).length && {
        data,
      }),
    });
    $.export("$summary", "Successfully retrieved profile");
    return response;
  },
};
