import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "confluence",
  propDefinitions: {
    spaceKey: {
      type: "string",
      label: "Space Key",
      description: "The key of the space",
    },
    blogPostKey: {
      type: "string",
      label: "Blog Post Key",
      description: "The key of the specific blog post for filtering",
      optional: true,
    },
    pageKey: {
      type: "string",
      label: "Page Key",
      description: "The key of the specific page for filtering",
      optional: true,
    },
    postType: {
      type: "string",
      label: "Post Type",
      description: "The type of the post (page or blog post)",
      options: [
        "page",
        "blog",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the post",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the post",
    },
    parentPage: {
      type: "string",
      label: "Parent Page",
      description: "The parent page of the post",
      optional: true,
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "The labels of the post",
      optional: true,
    },
    postId: {
      type: "string",
      label: "Post ID",
      description: "The ID of the post",
    },
    newContent: {
      type: "string",
      label: "New Content",
      description: "The new content of the post",
    },
    newTitle: {
      type: "string",
      label: "New Title",
      description: "The new title of the post",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.atlassian.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createPost({
      postType, title, content, space, parentPage, labels,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/wiki/rest/api/content",
        data: {
          type: postType,
          title: title,
          space: {
            key: space,
          },
          ancestors: [
            {
              id: parentPage,
            },
          ],
          body: {
            storage: {
              value: content,
              representation: "storage",
            },
          },
          version: {
            number: 1,
          },
          metadata: {
            labels: labels.map((label) => ({
              prefix: "global",
              name: label,
            })),
          },
        },
      });
    },
    async deletePost({
      postType, postId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/wiki/rest/api/content/${postId}`,
      });
    },
    async updatePost({
      postType, postId, newContent, newTitle, space, parentPage,
    }) {
      const currentPost = await this._makeRequest({
        path: `/wiki/rest/api/content/${postId}`,
      });
      return this._makeRequest({
        method: "PUT",
        path: `/wiki/rest/api/content/${postId}`,
        data: {
          version: {
            number: currentPost.version.number + 1,
          },
          title: newTitle || currentPost.title,
          type: postType,
          space: {
            key: space || currentPost.space.key,
          },
          ancestors: [
            {
              id: parentPage || (currentPost.ancestors.length > 0
                ? currentPost.ancestors[0].id
                : null),
            },
          ],
          body: {
            storage: {
              value: newContent || currentPost.body.storage.value,
              representation: "storage",
            },
          },
        },
      });
    },
  },
};
