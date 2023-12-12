import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chatwork",
  propDefinitions: {
    room: {
      type: "string",
      label: "Room",
      description: "Identifier of a room",
      async options() {
        const rooms = await this.listRooms();
        return rooms?.map(({
          room_id: id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    member: {
      type: "string",
      label: "Member",
      description: "Account ID of the person responsible for completing the task",
      async options({ roomId }) {
        const members = await this.listMembers({
          roomId,
        });
        return members?.map(({
          account_id: id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.chatwork.com/v2";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getUser(args = {}) {
      return this._makeRequest({
        path: "/me",
        ...args,
      });
    },
    listRooms(args = {}) {
      return this._makeRequest({
        path: "/rooms",
        ...args,
      });
    },
    listMessages({
      roomId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/rooms/${roomId}/messages`,
        ...args,
      });
    },
    listTasks({
      roomId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/rooms/${roomId}/tasks`,
        ...args,
      });
    },
    listMembers({
      roomId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/rooms/${roomId}/members`,
        ...args,
      });
    },
    createMessage({
      roomId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/rooms/${roomId}/messages`,
        method: "POST",
        ...args,
      });
    },
    createTask({
      roomId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/rooms/${roomId}/tasks`,
        method: "POST",
        ...args,
      });
    },
    createRoom(args = {}) {
      return this._makeRequest({
        path: "/rooms",
        method: "POST",
        ...args,
      });
    },
  },
};
