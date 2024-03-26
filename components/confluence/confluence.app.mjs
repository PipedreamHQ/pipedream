import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "confluence",
  propDefinitions: {
    postId: {
      type: "string",
      label: "Post ID",
      description: "The ID of the post",
      async options({ prevContext }) {
        const params = prevContext?.cursor
          ? {
            cursor: prevContext.cursor,
          }
          : {};
        const cloudId = await this.getCloudId();
        const {
          results, _links: links,
        } = await this.listPosts({
          cloudId,
          params,
        });
        const options = results?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            cursor: links?.next,
          },
        };
      },
    },
    spaceId: {
      type: "string",
      label: "Space Id",
      description: "The Id of the space",
      async options({ prevContext }) {
        const params = prevContext?.cursor
          ? {
            cursor: prevContext.cursor,
          }
          : {};
        const cloudId = await this.getCloudId();
        const {
          results, _links: links,
        } = await this.listSpaces({
          cloudId,
          params,
        });
        const options = results?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            cursor: links?.next,
          },
        };
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the blog post, specifies if the blog post will be created as a new blog post or a draft.",
      optional: true,
      options: [
        "current",
        "draft",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the blog post, required if creating non-draft.",
    },
    body: {
      type: "string",
      label: "Body",
      description: "Body of the blog post",
    },
  },
  methods: {
    _baseUrl(cloudId) {
      return `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        cloudId,
        ...otherOpts
      } = opts;
      return axios($, {
        url: `${this._baseUrl(cloudId)}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
    async getCloudId(opts = {}) {
      const response = await this._makeRequest({
        url: "https://api.atlassian.com/oauth/token/accessible-resources",
        ...opts,
      });
      if (!response?.length) {
        throw new Error("Unable to locate Confluence project site. Please verify that your site is setup correctly. https://www.atlassian.com/software/confluence/resources/guides/get-started/set-up");
      }
      return response[0].id;
    },
    getPost({
      postId, ...opts
    }) {
      return this._makeRequest({
        path: `/blogposts/${postId}`,
        ...opts,
      });
    },
    listSpaces(opts = {}) {
      return this._makeRequest({
        path: "/spaces",
        ...opts,
      });
    },
    listPosts(opts = {}) {
      return this._makeRequest({
        path: "/blogposts",
        ...opts,
      });
    },
    listPostsInSpace({
      spaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/spaces/${spaceId}/blogposts`,
        ...opts,
      });
    },
    listPages(opts = {}) {
      return this._makeRequest({
        path: "/pages",
        ...opts,
      });
    },
    listPagesInSpace({
      spaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/spaces/${spaceId}/pages`,
        ...opts,
      });
    },
    createPost(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/blogposts",
        ...opts,
      });
    },
    deletePost({
      postId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/blogposts/${postId}`,
        ...opts,
      });
    },
    updatePost({
      postId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/blogposts/${postId}`,
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      args,
      max,
    }) {
      args.params = {
        ...args.params,
      };
      let hasMore, count = 0;
      do {
        const {
          results, _links: links,
        } = await resourceFn(args);
        for (const item of results) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        hasMore = links?.next;
        args.params.cursor = hasMore;
      } while (hasMore);
    },
  },
};
