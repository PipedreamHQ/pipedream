import slab from "../../slab.app.mjs";
import { UPDATE_POST_MUTATION } from "../../common/queries.mjs";
import { LINK_ACCESS_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "slab-update-post",
  name: "Update Post",
  description: "Update a post's metadata and access settings via the `updatePost` GraphQL mutation, returning the updated post object. Manages link access (sharing), owner, archived/published state, and banner. NOTE: this mutation does NOT change title or content; use **Update Post Content** for the body (there is no title-update field in the schema). Run **Search Posts** first to obtain the post ID. Example: postId `abc123`, archived `true` returns `{\"id\":\"abc123\",\"title\":\"Q3 Onboarding Guide\",\"archivedAt\":\"2026-01-01T00:00:00Z\",\"linkAccess\":\"INTERNAL\"}`. [See the documentation](https://studio.apollographql.com/public/Slab/variant/current/schema/reference/objects/RootMutationType#updatePost).",
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
    },
    linkAccess: {
      type: "string",
      label: "Link Access",
      description: "Share-link access level (PostLinkAccess enum). One of: `DISABLED`, `INTERNAL`, `INTERNAL_VIEW`, `PUBLIC`, `PUBLIC_EDIT`.",
      options: LINK_ACCESS_OPTIONS,
      optional: true,
    },
    ownerId: {
      type: "string",
      label: "Owner ID",
      description: "ID of the user to set as the post owner. There is no dedicated user-listing action — to discover a user's ID, call **Get Posts** or **Search Posts** on any post they own and read the `owner.id` field from the response (e.g. `u1`).",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Set to `true` to archive the post, `false` to unarchive. Reversible.",
      optional: true,
    },
    published: {
      type: "boolean",
      label: "Published",
      description: "Set to `true` to publish the post, `false` to unpublish.",
      optional: true,
    },
    bannerUrl: {
      type: "string",
      label: "Banner URL",
      description: "URL of a banner image to set on the post.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.slab._makeRequest({
      $,
      data: {
        query: UPDATE_POST_MUTATION,
        variables: {
          id: this.postId,
          linkAccess: this.linkAccess,
          ownerId: this.ownerId,
          archived: this.archived,
          published: this.published,
          bannerUrl: this.bannerUrl,
        },
      },
    });
    const post = response.updatePost;
    $.export("$summary", `Successfully updated post ${post.id}: "${post.title}"`);
    return post;
  },
};
