import {
  RoomServiceClient,
  IngressClient,
  WebhookReceiver,
  AccessToken,
} from "livekit-server-sdk";

export default {
  type: "app",
  app: "livekit",
  propDefinitions: {
    room: {
      type: "string",
      label: "Room Name",
      description: "The name of the room",
      async options() {
        try {
          const rooms = await this.listRooms();
          return rooms.map(({ name }) => name);
        } catch (error) {
          console.log("Error fetching rooms:", error);
          return [];
        }
      },
    },
    identity: {
      type: "string",
      label: "Participant Identity",
      description: "The identity of the participant to remove from the room",
      async options({ room }) {
        try {
          const participants = await this.listParticipants(room);
          return participants.map(({ identity }) => identity);
        } catch (error) {
          console.log("Error fetching participants:", error);
          return [];
        }
      },
    },
  },
  methods: {
    getHost() {
      return this.$auth.project_url;
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
    getWebhookReceiver() {
      return new WebhookReceiver(...this.getKeys());
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
    verifyWebhook(body, authHeader) {
      const receiver = this.getWebhookReceiver();
      return receiver.receive(body, authHeader);
    },
    removeParticipant(room, identity) {
      return this.getRoomClient().removeParticipant(room, identity);
    },
    listParticipants(room) {
      return this.getRoomClient().listParticipants(room);
    },
    async createAccessToken({
      grant = {},
      ...args
    } = {}) {
      const accessToken = new AccessToken(...this.getKeys(), args);

      accessToken.addGrant(grant);

      const token = await accessToken.toJwt();

      return {
        token,
        host: this.getHost(),
      };
    },
  },
};
