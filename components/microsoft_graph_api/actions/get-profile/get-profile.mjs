import microsoftGraphApi from "../../microsoft_graph_api.app.mjs";

export default {
  key: "microsoft_graph_api-get-profile",
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
    microsoftGraphApi,
    userId: {
      propDefinition: [
        microsoftGraphApi,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const profile = await this.microsoftGraphApi.getProfile({
      userId: this.userId || undefined,
    });

    $.export(
      "$summary",
      `Successfully retrieved profile for ${profile.displayName || profile.userPrincipalName || profile.id}`,
    );

    return profile;
  },
};
