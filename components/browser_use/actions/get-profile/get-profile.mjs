import browserUse from "../../browser_use.app.mjs";

export default {
  key: "browser_use-get-profile",
  name: "Get Profile",
  description: "Get a Browser Use profile by ID. [See the documentation](https://docs.browser-use.com/cloud/api-v3/profiles/get-profile)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    browserUse,
    profileId: {
      propDefinition: [
        browserUse,
        "profileId",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.getProfile({
      $,
      profileId: this.profileId,
    });

    $.export("$summary", `Retrieved profile ${response.id}`);
    return response;
  },
};
