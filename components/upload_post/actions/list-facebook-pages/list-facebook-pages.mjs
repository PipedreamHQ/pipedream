import app from "../../upload_post.app.mjs";

export default {
  key: "upload_post-list-facebook-pages",
  name: "List Facebook Pages",
  description: "List the Facebook Pages the connected Facebook accounts can publish to, with their `id`, `name` and follower counts, optionally only for one profile."
    + " Use the `id` field as `facebookPageId` in **Upload Video**, **Upload Photos**, **Upload Text** and **Get Analytics**. [See the documentation](https://docs.upload-post.com/api/get-facebook-pages)",
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
      description: "Only return the Facebook Pages of the account connected to this profile, e.g. `my_brand`. Use **List Profiles** to find it (the `username` field).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listFacebookPages({
      $,
      params: {
        profile: this.profile,
      },
    });
    const count = response?.pages?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} Facebook Page${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
