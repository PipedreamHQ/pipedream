import {
  RoomServiceClient,
  IngressClient,
} from "livekit-server-sdk";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "livekit",
  propDefinitions: {
    room: {
      type: "string",
      label: "Room Name",
      description: "The name of the room",
      async options() {
        const rooms = await this.listRooms();
        return rooms.map(({ name }) => name);
      },
    },
  },
  methods: {
    getHost() {
      const { project_url: projectUrl } = this.$auth;

      return projectUrl.startsWith(constants.HTTPS_PREFIX)
        ? projectUrl
        : projectUrl.startsWith(constants.HTTP_PREFIX)
          ? projectUrl.replace(constants.HTTP_PREFIX, constants.HTTPS_PREFIX)
          : `${constants.HTTPS_PREFIX}${projectUrl}`;
    },
    getKeys() {
      const {
        api_key: apiKey,
        secret_key: secretKey,
      } = this.$auth;
      return [
        apiKey,
        secretKey,
      ];
    },
    getRoomClient() {
      return new RoomServiceClient(this.getHost(), ...this.getKeys());
    },
    getIngressClient() {
      return new IngressClient(this.getHost(), ...this.getKeys());
    },
    createRoom(args) {
      return this.getRoomClient().createRoom(args);
    },
    listRooms(names) {
      return this.getRoomClient().listRooms(names);
    },
    deleteRoom(room) {
      return this.getRoomClient().deleteRoom(room);
    },
    createIngress({
      inputType, ...args
    } = {}) {
      return this.getIngressClient().createIngress(inputType, args);
    },
  },
};
