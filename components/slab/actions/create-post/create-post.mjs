import slab from "../../slab.app.mjs";
import {
  CREATE_POST_MUTATION,
  UPDATE_POST_CONTENT_MUTATION,
  UPDATE_POST_MUTATION,
} from "../../common/queries.mjs";
import { deltaLength } from "../../common/util.mjs";

export default {
  key: "slab-create-post",
  name: "Create Post",
  description: "Create a new post in Slab via the `createPost` GraphQL mutation, returning the full post object (e.g. `{\"id\":\"abc123\",\"title\":\"Q3 Onboarding Guide\",\"topics\":[{\"id\":\"abc12def\",\"name\":\"Engineering\"}]}`). If **Content** is provided, the body is appended after creation via the `updatePostContent` mutation (the Slab schema does not accept content at creation time). Slab derives the displayed title from the first line of the post's content, so the appended text is inserted after the existing title line rather than replacing it — this preserves **Title** instead of overwriting it. NOTE: the returned `content` field reflects the pre-append snapshot (title line only) even though the append is applied — treat a non-error response as confirmation, not the returned `content`. New posts are published by default (set **Published** to `false` to leave it as an unpublished draft) — unpublished posts do not appear in **Search Posts**/**List Posts** results. Run **List Topics** to obtain a Topic ID to pass at creation. [See the documentation](https://studio.apollographql.com/public/Slab/variant/current/schema/reference/objects/RootMutationType#createPost).",
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
    title: {
      type: "string",
      label: "Title",
      description: "Title for the new post, e.g. `Q3 Engineering Onboarding Guide`.",
      optional: true,
    },
    content: {
      type: "string",
      label: "Content",
      description: "Initial body text for the post, e.g. `# Welcome\\nThis guide covers environment setup, team norms, and key contacts.`. Accepts plain text. If provided, the body is set immediately after creation via the `updatePostContent` mutation as a Quill insert delta.",
      optional: true,
    },
    topicId: {
      propDefinition: [
        slab,
        "topicId",
      ],
      description: "Optional single Topic ID to place the new post under. Run **List Topics** first to obtain a valid ID. The schema accepts only one topicId at creation; use **Add Topic To Post** to add more.",
      optional: true,
    },
    published: {
      type: "boolean",
      label: "Published",
      description: "Whether the new post should be published immediately (default `true`). Set to `false` to leave it as an unpublished draft, which won't appear in **Search Posts**/**List Posts** results until published via **Update Post**.",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    const createResponse = await this.slab._makeRequest({
      $,
      data: {
        query: CREATE_POST_MUTATION,
        variables: {
          title: this.title,
          topicId: this.topicId,
        },
      },
    });
    let post = createResponse.createPost;

    try {
      if (this.content) {
        const retain = deltaLength(post.content);
        const contentResponse = await this.slab._makeRequest({
          $,
          data: {
            query: UPDATE_POST_CONTENT_MUTATION,
            variables: {
              id: post.id,
              delta: JSON.stringify({
                ops: [
                  {
                    retain,
                  },
                  {
                    insert: `${this.content}\n`,
                  },
                ],
              }),
            },
          },
        });
        post = {
          ...post,
          ...contentResponse.updatePostContent,
        };
      }

      if (this.published !== false) {
        const publishResponse = await this.slab._makeRequest({
          $,
          data: {
            query: UPDATE_POST_MUTATION,
            variables: {
              id: post.id,
              published: true,
            },
          },
        });
        post = {
          ...post,
          ...publishResponse.updatePost,
        };
      }
    } catch (err) {
      // Best-effort cleanup so a retry after a partial failure doesn't accumulate
      // duplicate active posts; the archive failing doesn't change the outcome below.
      await this.slab._makeRequest({
        $,
        data: {
          query: UPDATE_POST_MUTATION,
          variables: {
            id: post.id,
            archived: true,
          },
        },
      }).catch(() => {});
      throw err;
    }

    $.export("$summary", `Successfully created post ${post.id}${post.title
      ? `: "${post.title}"`
      : ""}`);
    return post;
  },
};
