import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "invision_community",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new member.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the new member.",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password of the new member.",
    },
    groupId: {
      type: "integer",
      label: "Group ID",
      description: "The group ID of the new member.",
      async options({ page }) {
        const { results: data } = await this.listGroups({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    validated: {
      type: "boolean",
      label: "Validated",
      description: "Whether the new member is validated.",
    },
    memberId: {
      type: "integer",
      label: "Member ID",
      description: "The ID of the member to update.",
      async options({ page }) {
        const { results: data } = await this.listMembers({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    forumId: {
      type: "integer",
      label: "Forum ID",
      description: "The ID of the forum to create the topic in.",
      async options({ page }) {
        const { results: data } = await this.listForums({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the new topic.",
    },
    postContent: {
      type: "string",
      label: "Post Content",
      description: "The content of the first post in the new topic.",
    },
    authorId: {
      type: "integer",
      label: "Author Id",
      description: "The ID of the author of the new topic.",
      default: 0,
      async options({ page }) {
        const { results: data } = await this.listMembers({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags for the new topic.",
    },
    openTime: {
      type: "string",
      label: "Open Time",
      description: "The open time of the new topic Format: YYYY-MM-DDTHH:MM:SS.",
    },
    closeTime: {
      type: "string",
      label: "Close Time",
      description: "The close time of the new topic. Format: YYYY-MM-DDTHH:MM:SS.",
    },
    hidden: {
      type: "boolean",
      label: "Hidden",
      description: "Whether the new topic is hidden.",
    },
    pinned: {
      type: "boolean",
      label: "Pinned",
      description: "Whether the new topic is pinned.",
    },
    featured: {
      type: "boolean",
      label: "Featured",
      description: "Whether the new topic is featured.",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.url}/api`;
    },
    _auth() {
      return {
        username: `${this.$auth.api_key}`,
        password: "",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/core/webhooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/core/webhooks/${webhookId}`,
      });
    },
    createMember(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/core/members",
        ...opts,
      });
    },
    listForums(opts = {}) {
      return this._makeRequest({
        path: "/forums/forums",
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/core/groups",
        ...opts,
      });
    },
    listMembers(opts = {}) {
      return this._makeRequest({
        path: "/core/members",
        ...opts,
      });
    },
    updateMember({
      memberId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/core/members/${memberId}`,
        ...opts,
      });
    },
    createForumTopic(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/forums/topics",
        ...opts,
      });
    },
  },
};

