import app from "../../upload_post.app.mjs";

export default {
  key: "upload_post-list-pinterest-boards",
  name: "List Pinterest Boards",
  description: "List the boards (public and secret) of a connected Pinterest account, with their `id` and `name`. Without a profile, the first connected Pinterest account is used."
    + " Use the `id` field as `pinterestBoardId` in **Upload Video** and **Upload Photos**. Secret boards cannot be posted to. [See the documentation](https://docs.upload-post.com/api/get-pinterest-boards)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    profile: {
      propDefinition: [
        app,
        "user",
      ],
      description: "Only return the boards of the account connected to this profile, e.g. `my_brand`. Use **List Profiles** to find it (the `username` field).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listPinterestBoards({
      $,
      params: {
        profile: this.profile,
      },
    });
    const count = response?.boards?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} Pinterest board${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
