import slab from "../../slab.app.mjs";
import { SEARCH_POSTS_QUERY } from "../../common/queries.mjs";
import { pickFields } from "../../common/util.mjs";

export default {
  key: "slab-list-posts",
  name: "List Posts",
  description: "List all posts in the Slab organization (no filter). This action is superseded by **Search Posts**, which accepts an optional Query string and can list all posts when Query is empty. Prefer **Search Posts** for new workflows. Returns `{ posts, pageInfo, edges }` — `posts` is an array of post objects (e.g. `{\"id\": \"abc123\", \"title\": \"Engineering Onboarding Guide\", \"owner\": {\"id\": \"u1\", \"name\": \"Alice\"}, \"topics\": [{\"id\": \"abc12def\", \"name\": \"Engineering\"}]}`). Only forward pagination is supported: when `pageInfo.hasNextPage` is `true`, pass `pageInfo.endCursor` as **After** to retrieve the next page. Pass **Fields** (e.g. `[\"id\",\"title\",\"owner\"]`) to trim large fields like `content` from each post when only metadata is needed. [See the documentation](https://studio.apollographql.com/public/Slab/variant/current/schema/reference/objects/RootQueryType#search).",
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
      query: "",
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
    $.export("$summary", `Successfully retrieved ${posts.length} post(s)`);
    return {
      posts,
      pageInfo,
      edges,
    };
  },
};
