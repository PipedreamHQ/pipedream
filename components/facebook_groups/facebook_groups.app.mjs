import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "facebook_groups",
  propDefinitions: {
    group: {
      type: "string",
      label: "Group",
      description: "Identifier of a group",
      async options({ prevContext }) {
        const userId = await this.getUserId();
        const opts = {
          userId,
        };
        if (prevContext?.next) {
          opts.url = prevContext.next;
        }
        const {
          data, paging,
        } = await this.listGroups(opts);
        const options = data?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
        return {
          options,
          context: {
            next: paging?.next,
          },
        };
      },
    },
    post: {
      type: "string",
      label: "Post",
      description: "Identifier of a post",
      async options({
        prevContext, groupId,
      }) {
        const opts = {
          groupId,
        };
        if (prevContext?.next) {
          opts.url = prevContext.next;
        }
        const {
          data, paging,
        } = await this.listPosts(opts);
        const options = data?.map(({
          id, message,
        }) => ({
          label: message,
          value: id,
        })) || [];
        return {
          options,
          context: {
            next: paging?.next,
          },
        };
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return",
      optional: true,
      default: 50,
    },
  },
  methods: {
    _baseUrl() {
      return "https://graph.facebook.com/v17.0";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      url,
      path,
      ...args
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    async getUserId() {
      const { id } = await this._makeRequest({
        path: "/me",
      });
      return id;
    },
    getPost({
      postId, ...args
    }) {
      return this._makeRequest({
        path: `/${postId}`,
        ...args,
      });
    },
    listPostComments({
      postId, ...args
    }) {
      return this._makeRequest({
        path: `/${postId}/comments`,
        ...args,
      });
    },
    listPostReactions({
      postId, ...args
    }) {
      return this._makeRequest({
        path: `/${postId}/reactions`,
        ...args,
      });
    },
    listGroups({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `/${userId}/groups`,
        ...args,
      });
    },
    listPosts({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/${groupId}/feed`,
        ...args,
      });
    },
    listMembers({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/${groupId}/opted_in_members`,
        ...args,
      });
    },
    listEvents({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/${groupId}/events`,
        ...args,
      });
    },
    createPost({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/${groupId}/feed`,
        method: "POST",
        ...args,
      });
    },
    async *paginate({
      fn, args = {},
    }) {
      let next;

      do {
        const {
          data, paging,
        } = await fn(args);
        next = paging?.next || null;
        args.url = next;
        for (const item of data) {
          yield item;
        }
      } while (next);
    },
  },
};
