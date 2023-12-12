import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "circle",
  propDefinitions: {
    community_id: {
      type: "string",
      label: "Community ID",
      description: "Select the community you want to interact with",
      async options() {
        const communities = await this.listCommunities();
        return communities.map((community) => ({
          label: community.name,
          value: community.id,
        }));
      },
    },
    space_id: {
      type: "string",
      label: "Space ID",
      description: "Select the space within the community",
      async options({ community_id }) {
        if (!community_id) {
          return [];
        }
        const spaces = await this.listSpaces(community_id);
        return spaces.map((space) => ({
          label: space.name,
          value: space.id,
        }));
      },
    },
    post_id: {
      type: "string",
      label: "Post ID",
      description: "Select the post you want to create a comment for",
      async options({
        community_id, space_id,
      }) {
        if (!community_id || !space_id) {
          return [];
        }
        const posts = await this.listPosts(community_id, space_id);
        return posts.map((post) => ({
          label: post.title,
          value: post.id,
        }));
      },
    },
    postData: {
      type: "object",
      label: "Post Data",
      description: "The data for creating a new post",
    },
    commentData: {
      type: "object",
      label: "Comment Data",
      description: "The data for creating a new comment",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.circle.so/api/v1";
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
          Authorization: `Token ${this.$auth.api_token}`,
        },
      });
    },
    async listCommunities() {
      return this._makeRequest({
        path: "/communities",
      });
    },
    async listSpaces(communityId) {
      return this._makeRequest({
        path: `/communities/${communityId}/spaces`,
      });
    },
    async listPosts(communityId, spaceId) {
      return this._makeRequest({
        path: `/communities/${communityId}/spaces/${spaceId}/posts`,
      });
    },
    async createPost({
      community_id, space_id, ...postData
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/communities/${community_id}/spaces/${space_id}/posts`,
        data: postData,
      });
    },
    async createComment({
      community_id, space_id, post_id, ...commentData
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/communities/${community_id}/spaces/${space_id}/posts/${post_id}/comments`,
        data: commentData,
      });
    },
  },
};
