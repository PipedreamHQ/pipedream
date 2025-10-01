import app from "../../ayrshare.app.mjs";

export default {
  key: "ayrshare-delete-user",
  name: "Delete User",
  description: "Delete a user profile you are the owner of. [See the documentation](https://www.ayrshare.com/docs/apis/profiles/delete-profile)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    profileToDelete: {
      propDefinition: [
        app,
        "profileToDelete",
      ],
    },
    profileKey: {
      propDefinition: [
        app,
        "profileKey",
      ],
      description: "Unique key returned after profile creation. Must be informed only if `title` is not provided",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteUser({
      $,
      data: {
        title: this.profileToDelete,
        profileKey: this.profileKey,
      },
    });
    $.export("$summary", "Successfully sent the request to delete the user profile. Status: " + response.status);
    return response;
  },
};
