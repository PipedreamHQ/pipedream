import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "confluence",
  propDefinitions: {
    postId: {
      type: "string",
      label: "Post ID",
      description: "Select a post or provide its ID",
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
            cursor: this._extractCursorFromLink(links?.next),
          },
        };
      },
    },
    spaceId: {
      type: "string",
      label: "Space ID",
      description: "Select a space or provide its ID",
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
            cursor: this._extractCursorFromLink(links?.next),
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
    parentId: {
      type: "string",
      label: "Parent Page ID",
      description: "Select a parent page or provide its ID",
      async options({
        prevContext, spaceId,
      }) {
        if (!spaceId) {
          return [];
        }
        const params = prevContext?.cursor
          ? {
            cursor: prevContext.cursor,
          }
          : {};
        const cloudId = await this.getCloudId();
        const {
          results, _links: links,
        } = await this.listPagesInSpace({
          cloudId,
          spaceId,
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
            cursor: this._extractCursorFromLink(links?.next),
          },
        };
      },
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
    _extractCursorFromLink(link) {
      if (!link) return null;
      try {
        // Handle cases where link might be just a path or relative URL
        let url;
        if (link.startsWith("http")) {
          url = new URL(link);
        } else {
          // If it's a path or relative URL, construct a full URL
          const baseUrl = "https://api.atlassian.com";
          url = new URL(link, baseUrl);
        }
        return url.searchParams.get("cursor");
      } catch (e) {
        console.log("Error extracting cursor from link:", e);
        return null;
      }
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
    createPage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/pages",
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
        const cursor = this._extractCursorFromLink(links?.next);
        hasMore = cursor;
        args.params.cursor = cursor;
      } while (hasMore);
    },
  },
};
