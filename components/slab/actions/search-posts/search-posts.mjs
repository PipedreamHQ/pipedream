import slab from "../../slab.app.mjs";
import { SEARCH_POSTS_QUERY } from "../../common/queries.mjs";
import { pickFields } from "../../common/util.mjs";

export default {
  key: "slab-search-posts",
  name: "Search Posts",
  description: "List or search posts in the Slab organization via the GraphQL `search` endpoint. Leave Query empty to list all posts; provide a Query string to full-text search. This is the picker action agents should call to obtain post IDs for **Get Posts**, **Update Post**, **Add Topic To Post**, and **Remove Topic From Post**. Returns `{ posts, pageInfo, edges }` — `posts` is an array of post objects (e.g. `{\"id\": \"abc123\", \"title\": \"Engineering Onboarding Guide\", \"owner\": {\"id\": \"u1\", \"name\": \"Alice\"}, \"topics\": [{\"id\": \"abc12def\", \"name\": \"Engineering\"}]}`). Only forward pagination is supported: when `pageInfo.hasNextPage` is `true`, pass `pageInfo.endCursor` as **After** to retrieve the next page. Pass **Fields** (e.g. `[\"id\",\"title\",\"owner\"]`) to trim large fields like `content` from each post when only metadata is needed. [See the documentation](https://studio.apollographql.com/public/Slab/variant/current/schema/reference/objects/RootQueryType#search).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    slab,
    query: {
      type: "string",
      label: "Query",
      description: "Full-text search string. Leave empty (\"\") to list all posts in the organization.",
      optional: true,
    },
    first: {
      propDefinition: [
        slab,
        "first",
      ],
    },
    after: {
      propDefinition: [
        slab,
        "after",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of top-level post fields to include in each result (e.g. `[\"id\",\"title\",\"owner\"]`). Omit to return the full post object for each result (default), including the potentially large `content` field.",
      optional: true,
    },
  },
  async run({ $ }) {
    const variables = {
      query: this.query || "",
      ...(this.first && {
        first: parseInt(this.first),
      }),
      ...(this.after && {
        after: this.after,
      }),
    };
    const response = await this.slab._makeRequest({
      $,
      data: {
        query: SEARCH_POSTS_QUERY,
        variables,
      },
    });
    const edges = response.search?.edges || [];
    const posts = edges
      .map((edge) => edge.node?.post)
      .filter(Boolean)
      .map((post) => pickFields(post, this.fields));
    const pageInfo = response.search?.pageInfo || {};
    $.export("$summary", `Successfully found ${posts.length} post(s)${this.query
      ? ` matching "${this.query}"`
      : ""}`);
    return {
      posts,
      pageInfo,
      edges,
    };
  },
};
