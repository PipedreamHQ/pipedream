import browserUse from "../../browser_use.app.mjs";

export default {
  key: "browser_use-delete-profile",
  name: "Delete Profile",
  description: "Delete a Browser Use profile. This removes persisted browser state for that profile. [See the documentation](https://docs.browser-use.com/cloud/api-v3/profiles/delete-browser-profile)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.browserUse.deleteProfile({
      $,
      profileId: this.profileId,
    });

    $.export("$summary", `Deleted profile ${this.profileId}`);
    return response;
  },
};
