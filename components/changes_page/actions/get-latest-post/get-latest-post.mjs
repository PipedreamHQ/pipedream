import changesPage from "../../changes_page.app.mjs";

export default {
  key: "changes_page-get-latest-post",
  name: "Get Latest Post",
  description: "Get the latest post from Changes Page. [See the documentation](https://docs.changes.page/docs/api/page#get-latest-post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    changesPage,
  },
  async run({ $ }) {
    const post = await this.changesPage.getLatestPost({
      $,
    });
    $.export("$summary", "Successfully retrieved latest post");
    return post;
  },
};
