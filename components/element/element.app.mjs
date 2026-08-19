// x-pd-ai: optimized
import { randomUUID } from "crypto";
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "element",
  propDefinitions: {
    roomId: {
      type: "string",
      label: "Room ID",
      description: "The Matrix room ID, e.g. `!OGEhHVWSdvArJzumhm:matrix.org`. Use **List Rooms** to find the ID of a room you've already joined.",
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.homeserver.replace(/\/$/, "")}/_matrix/client/v3`;
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
    createRoom(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/createRoom",
        ...opts,
      });
    },
  },
};
