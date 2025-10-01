import wordpress from "../../wordpress_org.app.mjs";

export default {
  key: "wordpress_org-search-posts",
  name: "Search Posts",
  description: "Searches for specific posts. [See the documentation](https://developer.wordpress.org/rest-api/reference/posts/#list-posts)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    wordpress,
    search: {
      propDefinition: [
        wordpress,
        "search",
      ],
    },
    author: {
      propDefinition: [
        wordpress,
        "author",
      ],
    },
    authorExclude: {
      propDefinition: [
        wordpress,
        "author",
      ],
      label: "Exclude Author",
      description: "Ensure result set excludes posts assigned to specific authors",
    },
    statuses: {
      propDefinition: [
        wordpress,
        "status",
      ],
      type: "string[]",
      description: "Limit result set to posts assigned one or more statuses. Defaults to `publish`",
    },
  },
  async run({ $ }) {
    const params = {
      search: this.search,
      author: this.author,
      authorExclude: this.authorExclude,
      statuses: this.statuses,
    };
    const results = [];
    let next, page = 1;
    do {
      const posts = await this.wordpress.searchPosts(params, page);
      next = posts?._paging?.links?.next;
      delete posts._paging;
      results.push(...posts);
      page++;
    } while (next);

    $.export("$summary", `Found ${results?.length} post(s)`);

    return results;
  },
};
