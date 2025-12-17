import googleDirectory from "../../google_directory.app.mjs";

export default {
  key: "google_directory-get-user",
  name: "Get User",
  description: "Retrieves information about a user. [See the documentation](https://developers.google.com/admin-sdk/directory/reference/rest/v1/users/get)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleDirectory,
    user: {
      propDefinition: [
        googleDirectory,
        "user",
      ],
    },
  },
  async run({ $ }) {
    const user = await this.googleDirectory.getUser({
      userId: this.user,
      $,
    });

    $.export("$summary", `Successfully retrieved user with ID ${this.user}.`);

    return user;
  },
};
