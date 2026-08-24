// x-pd-ai: optimized
import { randomUUID } from "crypto";
import { axios } from "@pipedream/platform";

const API_PATH = "/_matrix/client/v3";

export default {
  type: "app",
  app: "element",
  propDefinitions: {
    roomId: {
      type: "string",
      label: "Room ID",
      description: "The Matrix room ID, e.g. `!OGEhHVWSdvArJzumhm:matrix.org`. Use **List Rooms** to find the ID of a room you've already joined.",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The full Matrix ID of the user, e.g. `@alice:matrix.org`.",
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "Optional reason recorded on the resulting membership event, e.g. `Welcome to the team!`.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      const host = this.$auth.homeserver.replace(/\/+$/, "");
      const origin = /^https?:\/\//.test(host)
        ? host
        : `https://${host}`;
      return `${origin}${API_PATH}`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.access_token}`,
        },
        ...opts,
      });
    },
    listJoinedRooms(opts = {}) {
      return this._makeRequest({
        path: "/joined_rooms",
        ...opts,
      });
    },
    sendMessage({
      roomId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/rooms/${encodeURIComponent(roomId)}/send/m.room.message/${randomUUID()}`,
        ...opts,
      });
    },
    inviteUser({
      roomId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/rooms/${encodeURIComponent(roomId)}/invite`,
        ...opts,
      });
    },
    banUser({
      roomId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/rooms/${encodeURIComponent(roomId)}/ban`,
        ...opts,
      });
    },
    unbanUser({
      roomId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/rooms/${encodeURIComponent(roomId)}/unban`,
        ...opts,
      });
    },
    leaveRoom({
      roomId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/rooms/${encodeURIComponent(roomId)}/leave`,
        ...opts,
      });
    },
    createRoom(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/createRoom",
        ...opts,
      });
    },
  },
};
