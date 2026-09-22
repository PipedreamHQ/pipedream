import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "circle",
  propDefinitions: {
    body: {
      type: "string",
      label: "Body",
      description: "The body of the post.",
    },
    communityId: {
      type: "string",
      label: "Community ID",
      description: "Select the community you want to interact with.",
      async options() {
        const communities = await this.listCommunities();

        return communities.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    postId: {
      type: "string",
      label: "Post ID",
      description: "Select the post you want to create a comment for.",
      async options({
        communityId, spaceId, page,
      }) {
        const posts = await this.listPosts({
          params: {
            communityId,
            spaceId,
            page: page + 1,
            status: "all",
          },
        });

        return posts.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    spaceId: {
      type: "string",
      label: "Space ID",
      description: "Select the space within the community.",
      async options({
        communityId, page,
      }) {
        const spaces = await this.listSpaces({
          params: {
            communityId,
            page: page + 1,
          },
        });

        return spaces.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userEmail: {
      type: "string",
      label: "User Email",
      description: "Email of the community member to post from. Defaults to admin if empty.",
      async options({ page }) {
        const spaces = await this.listMembers({
          params: {
            page: page + 1,
          },
        });

        return spaces.map(({
          email: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.circle.so/api/v1";
    },
    _headers() {
      return {
        Authorization: `Token ${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listCommunities() {
      return this._makeRequest({
        path: "/communities",
      });
    },
    listMembers() {
      return this._makeRequest({
        path: "/community_members",
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
        path: "/posts",
        ...opts,
      });
    },
    listComments(opts = {}) {
      return this._makeRequest({
        path: "/comments",
        ...opts,
      });
    },
    createPost(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/posts",
        ...opts,
      });
    },
    createComment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/comments",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const data = await fn({
          params,
        }) || [];

        if (!Array.isArray(data) || !data.length) {
          console.log("No items found");
          return;
        }

        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
