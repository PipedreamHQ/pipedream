import smugmug from "../../smugmug.app.mjs";

export default {
  key: "smugmug-get-user-profile",
  name: "Get User Profile",
  description: "Gets a user profile. A user profile is the data provided by a user to establish that user's public presence. This may include social networking links, biographical text, and bio and cover images. [See the docs here](https://api.smugmug.com/api/v2/user/cmac!profile)",
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    smugmug,
    nickname: {
      type: "string",
      label: "Nickname",
      description: "Nickname of the user's profile to retrieve.",
    },
  },
  async run({ $ }) {
    const response = await this.smugmug.getUser(this.nickname, {
      $,
    });
    if (response) {
      $.export("$summary", `Retrieved user with nickname ${this.nickname}`);
    }
    return response;
  },
};
