import changesPage from "../../changes_page.app.mjs";

export default {
  key: "changes_page-list-posts",
  name: "List Posts",
  description: "Retrieve a list of posts from Changes Page. [See the documentation](https://docs.changes.page/docs/api/page#get-all-posts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    changesPage,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of posts to retrieve",
      default: 100,
    },
  },
  async run({ $ }) {
    const posts = await this.changesPage.getPaginatedResources({
      fn: this.changesPage.listPosts,
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${posts.length} posts`);
    return posts;
  },
};
