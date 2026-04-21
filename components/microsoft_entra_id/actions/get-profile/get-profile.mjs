import microsoftEntraId from "../../microsoft_entra_id.app.mjs";

export default {
  key: "microsoft_entra_id-get-profile",
  name: "Get Profile",
  description: "Get the user's profile information. Returns the signed-in user's profile by default. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-get?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftEntraId,
    userId: {
      propDefinition: [
        microsoftEntraId,
        "userId",
      ],
      optional: true,
      description: "Leave empty to use the signed-in user.",
    },
  },
  async run({ $ }) {
    const profile = await this.microsoftEntraId.getProfile({
      userId: this.userId || undefined,
    });

    $.export(
      "$summary",
      `Successfully retrieved profile for ${profile.displayName || profile.userPrincipalName || profile.id}`,
    );

    return profile;
  },
};
