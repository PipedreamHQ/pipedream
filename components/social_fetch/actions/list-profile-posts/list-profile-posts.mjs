import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-list-profile-posts",
  name: "List Profile Posts",
  description: "Lists recent posts, videos, reels, or tweets for a profile. [See the documentation](https://www.socialfetch.dev/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    platform: {
      propDefinition: [
        app,
        "listPlatform",
      ],
    },
    contentType: {
      propDefinition: [
        app,
        "contentType",
      ],
    },
    handle: {
      propDefinition: [
        app,
        "handle",
      ],
    },
    profileUrl: {
      propDefinition: [
        app,
        "profileUrl",
      ],
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const MAX_POSTS = 10;
    const response = await this.app.listProfilePosts({
      $,
      platform: this.platform,
      contentType: this.contentType,
      handle: this.handle,
      profileUrl: this.profileUrl,
      cursor: this.cursor,
    });
    if (response?.data) {
      for (const key of Object.keys(response.data)) {
        if (Array.isArray(response.data[key])) {
          const total = response.data[key].length;
          const posts = response.data[key].slice(0, MAX_POSTS);
          response.data[key] = posts.map((post) => {
            const rest = {
              ...post,
            };
            delete rest.details;
            return rest;
          });
          if (total > MAX_POSTS) {
            response.data._truncated = `${key} truncated to ${MAX_POSTS} of ${total} items`;
          }
        }
      }
    }
    $.export("$summary", "Successfully listed profile posts");
    return response;
  },
};
