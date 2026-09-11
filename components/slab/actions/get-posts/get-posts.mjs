import slab from "../../slab.app.mjs";
import { GET_POSTS_QUERY } from "../../common/queries.mjs";
import { MAX_IDS } from "../../common/constants.mjs";
import { pickFields } from "../../common/util.mjs";

export default {
  key: "slab-get-posts",
  name: "Get Posts",
  description: "Get one or more Slab posts by their IDs, returning full post objects including content, owner, and associated topics. Use **Search Posts** first to discover post IDs; this action does not list or search. Accepts up to 100 IDs per call. Example: postIds `[\"abc123\"]` returns `[{\"id\": \"abc123\", \"title\": \"Engineering Onboarding Guide\", \"owner\": {\"id\": \"u1\", \"name\": \"Alice\"}, \"topics\": [{\"id\": \"abc12def\", \"name\": \"Engineering\"}], \"content\": \"...\"}]`. Pass **Fields** (e.g. `[\"id\",\"title\",\"owner\"]`) to trim large fields like `content` from each result when only metadata is needed. [See the documentation](https://studio.apollographql.com/public/Slab/variant/current/schema/reference/objects/RootQueryType#posts).",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slab,
    postIds: {
      type: "string[]",
      label: "Post IDs",
      description: `One or more Slab post IDs to retrieve (max ${MAX_IDS}). Run **Search Posts** first to obtain valid post IDs (e.g. \`abc123\`), then paste them here. Free-form input; no dropdown is provided.`,
    },
    fields: {
      propDefinition: [
        slab,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.slab._makeRequest({
      $,
      data: {
        query: GET_POSTS_QUERY,
        variables: {
          ids: this.postIds,
        },
      },
    });
    const posts = (response.posts || []).map((post) => pickFields(post, this.fields));
    $.export("$summary", `Successfully retrieved ${posts.length} post(s)`);
    return posts;
  },
};
