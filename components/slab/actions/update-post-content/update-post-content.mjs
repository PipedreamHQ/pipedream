import { ConfigurationError } from "@pipedream/platform";
import slab from "../../slab.app.mjs";
import { UPDATE_POST_CONTENT_MUTATION } from "../../common/queries.mjs";
import { parseJson } from "../../common/util.mjs";

export default {
  key: "slab-update-post-content",
  name: "Update Post Content",
  description: "Replace or edit a post's body via the `updatePostContent` GraphQL mutation. Content must be supplied as a Quill delta (see https://quilljs.com/docs/delta/) wrapped in an `{\"ops\":[...]}` object, passed as a JSON string — the API rejects a native/unwrapped delta object at the GraphQL layer. IMPORTANT: Slab derives the post's displayed title from the first line of its content — there is no independent title field after creation. An op with `{\"retain\":0}` (or no leading retain) inserts at the very start and overwrites the title; to append body text while preserving the title, first read the post's current `content` (via **Search Posts** or **Get Posts**) and lead with a `retain` count covering the existing title line's length. This is a distinct endpoint from **Update Post** (which handles metadata/access only, and cannot change title). Run **Search Posts** first to obtain the post ID. Example (append after a 20-character title line): postId `abc123`, delta `{\"ops\":[{\"retain\":20},{\"insert\":\"Additional body text.\\n\"}]}` — a non-error response confirms the edit was accepted. CRITICAL: this mutation applies your delta positionally against whatever the post's content actually is at the moment the call runs — there is no version check, and the response reflects the pre-edit snapshot, not the result. Always re-read the post's current `content` (**Search Posts** or **Get Posts**) immediately before computing a delta, and if you need to make a second edit to the same post, re-read again first — never compute a new delta from an earlier read or from this action's own response. Offsets computed against a stale snapshot land in the wrong place and silently corrupt the document instead of erroring; they do not queue safely. [See the documentation](https://studio.apollographql.com/public/Slab/variant/current/schema/reference/objects/RootMutationType#updatePostContent).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    slab,
    postId: {
      propDefinition: [
        slab,
        "postId",
      ],
      description: "ID of the post whose content to update. Run **Search Posts** first to obtain the ID.",
    },
    delta: {
      type: "string",
      label: "Delta",
      description: "Quill delta describing the content change, as a JSON string wrapped in `{\"ops\":[...]}`. To preserve the post's title (its first content line), lead with `{\"retain\":N}` where N is that line's length in characters before your `insert`. Example (append after a 20-character title line): `{\"ops\":[{\"retain\":20},{\"insert\":\"\\nThis guide covers setup.\"}]}`. Example (replace a range, not touching the title): `{\"ops\":[{\"retain\":25},{\"delete\":3},{\"insert\":\"new\"}]}`. Compute N and any retain/delete counts from a `content` you just read for this specific call — a value carried over from an earlier read or a prior call to this action will target the wrong position. Validated as JSON with an `ops` array in run(), then sent to the API as a JSON string.",
    },
  },
  async run({ $ }) {
    const parsed = parseJson(this.delta, "Delta");
    if (!Array.isArray(parsed?.ops)) {
      throw new ConfigurationError("Delta must be a JSON string shaped like {\"ops\":[...]}, e.g. {\"ops\":[{\"retain\":20},{\"insert\":\"Body text\\n\"}]}");
    }
    // The API rejects a native object for this Json! argument, so it is sent as a JSON string.
    const delta = JSON.stringify(parsed);
    const response = await this.slab._makeRequest({
      $,
      data: {
        query: UPDATE_POST_CONTENT_MUTATION,
        variables: {
          id: this.postId,
          delta,
        },
      },
    });
    const post = response.updatePostContent;
    // The mutation response reflects the pre-edit snapshot (see description), so the
    // summary/return value intentionally doesn't claim the new content/title as confirmed.
    $.export("$summary", `Successfully submitted content update for post ${post.id}`);
    return post;
  },
};
