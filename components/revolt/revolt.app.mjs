import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "revolt",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The name of the group",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Group description",
    },
    users: {
      type: "string[]",
      label: "Members",
      description: "IDs of the users",
    },
    nsfw: {
      type: "boolean",
      label: "NSFW",
      description: "Whether this group is age-restricted",
    },
    target: {
      type: "string",
      label: "Target",
      description: "ID of the group",
    },
    member: {
      type: "string",
      label: "Member",
      description: "ID of the member",
    },
    username: {
      type: "string",
      label: "User name",
      description: "Username and discriminator combo separated by #",
    },
  },
  methods: {
    _baseUrl() {
      return "https://revolt.chat/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-session-token": `${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createGroup(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/channels/create",
        ...args,
      });
    },
    async addGroupMember({
      target, member, ...args
    }) {
      return this._makeRequest({
        method: "put",
        path: `/channels/${target}/recipients/${member}`,
        ...args,
      });
    },
    async sendFriendRequest(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/users/friend",
        ...args,
      });
    },
  },
};
