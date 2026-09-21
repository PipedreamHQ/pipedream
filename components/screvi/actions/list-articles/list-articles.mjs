import screvi from "../../screvi.app.mjs";

export default {
  key: "screvi-list-articles",
  name: "List Articles",
  description: "List your saved articles, optionally filtered to the inbox, Later or the archive. [See the documentation](https://screvi.com/docs/api/public-api)",
  version: "0.0.1",
  type: "action",
  props: {
    screvi,
    homeStatus: {
      propDefinition: [
        screvi,
        "homeStatus",
      ],
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Match the title, author or domain",
      optional: true,
    },
    tag: {
      propDefinition: [
        screvi,
        "tag",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        screvi,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const articles = [];

    for await (const article of this.screvi.paginate({
      fn: (opts) => this.screvi.listArticles({
        $,
        ...opts,
      }),
      params: {
        home_status: this.homeStatus,
        q: this.query,
        tag: this.tag,
      },
      max: this.maxResults,
    })) {
      articles.push(article);
    }

    $.export("$summary", `Found ${articles.length} article${articles.length === 1
      ? ""
      : "s"}`);

    return articles;
  },
};
