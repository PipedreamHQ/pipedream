import screvi from "../../screvi.app.mjs";

export default {
  key: "screvi-search-highlights",
  name: "Search Highlights",
  description: "Search your highlights. Screvi matches on meaning as well as keywords, so describing an idea finds passages that never contain the words. [See the documentation](https://screvi.com/docs/api/public-api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    screvi,
    query: {
      type: "string",
      label: "Query",
      description: "What to look for, as words or as a description of the idea",
    },
    source: {
      type: "string",
      label: "Source",
      description: "Only highlights whose source name or author matches this",
      optional: true,
    },
    tag: {
      propDefinition: [
        screvi,
        "tag",
      ],
      optional: true,
    },
    favorite: {
      type: "boolean",
      label: "Favorites Only",
      description: "Only highlights you have favorited",
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
    const results = [];

    for await (const highlight of this.screvi.paginate({
      fn: (opts) => this.screvi.searchHighlights({
        $,
        ...opts,
      }),
      params: {
        q: this.query,
        source: this.source,
        tag: this.tag,
        favorite: this.favorite,
      },
      max: this.maxResults,
      // /search caps per_page at 50 and clamps anything larger.
      perPage: 50,
    })) {
      results.push(highlight);
    }

    $.export("$summary", `Found ${results.length} highlight${results.length === 1
      ? ""
      : "s"} for "${this.query}"`);

    return results;
  },
};
