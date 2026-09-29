import app from "../../upload_post.app.mjs";

export default {
  key: "upload_post-list-profiles",
  name: "List Profiles",
  description: "List the Upload-Post profiles of your account and their connected social accounts. [See the documentation](https://docs.upload-post.com/api/user-profiles)",
  version: "0.0.1",
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
