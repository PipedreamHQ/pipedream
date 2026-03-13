import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_chat",
  propDefinitions: {
    spaceId: {
      type: "string",
      label: "Space ID",
      description: "The ID of the space",
      async options() {
        const response = await this.listSpaces({
          params: {
            filter: "spaceType = \"SPACE\"",
          },
        });
        return response.spaces?.map((space) => ({
          label: `${space.displayName} (${space.type})`,
          value: space.name.replace("spaces/", ""),
        })) || [];
      },
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The ID of the message",
      async options({ spaceId }) {
        const response = await this.listMessages({
          spaceId,
        });
        return response.messages?.map((message) => ({
          label: `${message.text} (${message.createTime})`,
          value: message.name.split("/").pop(),
        })) || [];
      },
    },
    memberId: {
      type: "string",
      label: "Member ID",
      description: "The ID of the member",
      async options({ spaceId }) {
        const response = await this.listMembers({
          spaceId,
        });
        return response.memberships?.map((membership) => ({
          label: `${membership.member.name} (${membership.role})`,
          value: membership.name.split("/").pop(),
        })) || [];
      },
    },
  },
  methods: {
    getUrl(endpoint) {
      return `https://chat.googleapis.com/v1${endpoint}`;
    },
    getHeaders(headers) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    makeRequest({
      $ = this, url, path, headers, ...args
    } = {}) {
      const config = {
        headers: this.getHeaders(headers),
        url: url || this.getUrl(path),
        ...args,
      };

      return axios($, config);
    },
    createMessage({
      spaceId, ...opts
    }) {
      return this.makeRequest({
        method: "POST",
        path: `/spaces/${spaceId}/messages`,
        ...opts,
      });
    },
    listMessages({
      $ = this,
      spaceId,
      params,
    }) {
      return this.makeRequest({
        $,
        method: "GET",
        path: `/spaces/${spaceId}/messages`,
        params,
      });
    },
    listMembers({
      $ = this,
      spaceId,
      params,
    }) {
      return this.makeRequest({
        $,
        method: "GET",
        path: `/spaces/${spaceId}/members`,
        params,
      });
    },
    getMessage({
      $ = this,
      spaceId,
      messageId,
    }) {
      return this.makeRequest({
        $,
        method: "GET",
        path: `/spaces/${spaceId}/messages/${messageId}`,
      });
    },
    getSpace({
      $ = this,
      spaceId,
    }) {
      return this.makeRequest({
        $,
        method: "GET",
        path: `/spaces/${spaceId}`,
      });
    },
    getMember({
      $ = this,
      spaceId,
      memberId,
    }) {
      return this.makeRequest({
        $,
        method: "GET",
        path: `/spaces/${spaceId}/members/${memberId}`,
      });
    },
    listSpaces({
      $ = this,
      params,
    }) {
      return this.makeRequest({
        $,
        method: "GET",
        path: "/spaces",
        params,
      });
    },
    uploadFile({
      spaceId, ...opts
    }) {
      return this.makeRequest({
        method: "POST",
        url: `https://chat.googleapis.com/upload/v1/spaces/${spaceId}/attachments:upload`,
        ...opts,
      });
    },
  },
};
