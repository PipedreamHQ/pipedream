import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rocketchat",
  propDefinitions: {
    targetChannel: {
      type: "string",
      label: "Target Channel",
      description: "The specific public channel where a new message is posted",
      async options() {
        const { channels } = await this.getChannels();
        return channels.map((channel) => ({
          label: channel.name,
          value: channel._id,
        }));
      },
    },
    roomName: {
      type: "string",
      label: "Room Name",
      description: "The name of the new room",
    },
    members: {
      type: "string[]",
      label: "Members",
      description: "The list of usernames to be added to the new room",
      optional: true,
    },
    roomType: {
      type: "string",
      label: "Room Type",
      description: "The type of the new room",
      options: [
        "public",
        "private",
      ],
      optional: true,
    },
    recipientUsername: {
      type: "string",
      label: "Recipient Username",
      description: "The username of the recipient for the direct message",
    },
    text: {
      type: "string",
      label: "Message Text",
      description: "The text of the message to be sent",
    },
    statusText: {
      type: "string",
      label: "Status Text",
      description: "The status text to be set for the user",
    },
    statusType: {
      type: "string",
      label: "Status Type",
      description: "The status type to be set for the user (online, away, busy or offline)",
      options: [
        "online",
        "away",
        "busy",
        "offline",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://your-rocketchat-instance/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "X-Auth-Token": this.$auth.auth_token,
          "X-User-Id": this.$auth.user_id,
        },
      });
    },
    async getChannels() {
      return this._makeRequest({
        path: "/channels.list",
      });
    },
    async getUsers() {
      return this._makeRequest({
        path: "/users.list",
      });
    },
    async createRoom({
      roomName, members, roomType,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/channels.create",
        data: {
          name: roomName,
          members: members,
          type: roomType,
        },
      });
    },
    async sendMessage({
      recipientUsername, text,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/chat.postMessage",
        data: {
          channel: recipientUsername,
          text: text,
        },
      });
    },
    async updateUserStatus({
      statusText, statusType,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/users.setStatus",
        data: {
          message: statusText,
          status: statusType,
        },
      });
    },
  },
};
