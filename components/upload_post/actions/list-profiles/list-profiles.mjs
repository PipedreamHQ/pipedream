import app from "../../upload_post.app.mjs";

export default {
  key: "upload_post-list-profiles",
  name: "List Profiles",
  description: "List the Upload-Post profiles of the account with their connected social accounts (`social_accounts`, keyed by platform)."
    + " Use the `username` field as the profile in **Upload Video**, **Upload Photos**, **Upload Text** and **Get Analytics**. [See the documentation](https://docs.upload-post.com/api/user-profiles)",
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
  },
  async run({ $ }) {
    const response = await this.app.listProfiles({
      $,
    });
    const count = response?.profiles?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} profile${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
