import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 50;

export default {
  type: "app",
  app: "changes_page",
  propDefinitions: {
    postId: {
      type: "string",
      label: "Post ID",
      description: "The ID of the post to retrieve",
      async options({ page }) {
        const posts = await this.listPosts({
          params: {
            offset: page * DEFAULT_LIMIT,
          },
        });
        return posts.map((post) => ({
          label: post.title,
          value: post.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.changes.page`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        ...opts,
      });
    },
    getPost({
      postId, ...opts
    }) {
      return this._makeRequest({
        path: `/changes.json/${postId}`,
        ...opts,
      });
    },
    getLatestPost(opts = {}) {
      return this._makeRequest({
        path: "/latest.json",
        ...opts,
      });
    },
    getPinnedPost(opts = {}) {
      return this._makeRequest({
        path: "/pinned.json",
        ...opts,
      });
    },
    listPosts(opts = {}) {
      return this._makeRequest({
        path: "/changes.json",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, max,
    }) {
      params = {
        ...params,
        offset: 0,
      };
      let total, count = 0;
      do {
        const response = await fn({
          params,
        });
        if (!response || response.length === 0) {
          break;
        }
        for (const item of response) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = response.length;
        params.offset += DEFAULT_LIMIT;
      } while (total === DEFAULT_LIMIT);
    },
    async getPaginatedResources(opts = {}) {
      const resources = this.paginate(opts);
      const items = [];
      for await (const item of resources) {
        items.push(item);
      }
      return items;
    },
  },
};
