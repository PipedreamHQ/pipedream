import app from "../../livekit.app.mjs";

export default {
  key: "livekit-generate-access-token",
  name: "Generate Access Token",
  description: "Generate an access token for a participant to join a LiveKit room. [See the documentation](https://github.com/livekit/node-sdks/tree/main/packages/livekit-server-sdk).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    room: {
      description: "The name of the room to join",
      optional: true,
      propDefinition: [
        app,
        "room",
      ],
    },
    ttl: {
      type: "integer",
      label: "Token TTL (seconds)",
      description: "How long the access token should be valid for (in seconds)",
      optional: true,
    },
    name: {
      type: "string",
      label: "Participant Name",
      description: "Display name for the participant",
      optional: true,
    },
    identity: {
      type: "string",
      label: "Participant Identity",
      description: "Unique identity for the participant joining the call",
    },
    metadata: {
      type: "string",
      label: "Participant Metadata",
      description: "Optional metadata to attach to the participant",
      optional: true,
    },
    canPublish: {
      type: "boolean",
      label: "Can Publish",
      description: "Whether the participant can publish audio/video tracks",
      optional: true,
    },
    canSubscribe: {
      type: "boolean",
      label: "Can Subscribe",
      description: "Whether the participant can subscribe to other participants' tracks",
      optional: true,
    },
    canPublishData: {
      type: "boolean",
      label: "Can Publish Data",
      description: "Whether the participant can publish data messages",
      optional: true,
    },
    hidden: {
      type: "boolean",
      label: "Hidden Participant",
      description: "Whether the participant should be hidden from other participants",
      optional: true,
    },
    roomCreate: {
      type: "boolean",
      label: "Room Create Permission",
      description: "Permission to create rooms",
      optional: true,
    },
    roomList: {
      type: "boolean",
      label: "Room List Permission",
      description: "Permission to list rooms",
      optional: true,
    },
    roomRecord: {
      type: "boolean",
      label: "Room Record Permission",
      description: "Permission to start a recording",
      optional: true,
    },
    roomAdmin: {
      type: "boolean",
      label: "Room Admin Permission",
      description: "Permission to control the specific room",
      optional: true,
    },
    ingressAdmin: {
      type: "boolean",
      label: "Ingress Admin Permission",
      description: "Permission to control ingress, not specific to any room or ingress",
      optional: true,
    },
    canUpdateOwnMetadata: {
      type: "boolean",
      label: "Can Update Own Metadata",
      description: "Allow participant to update its own metadata",
      optional: true,
    },
    recorder: {
      type: "boolean",
      label: "Recorder",
      description: "Participant is recording the room, allows room to indicate it's being recorded",
      optional: true,
    },
    agent: {
      type: "boolean",
      label: "Agent",
      description: "Participant allowed to connect to LiveKit as Agent Framework worker",
      optional: true,
    },
    canSubscribeMetrics: {
      type: "boolean",
      label: "Can Subscribe Metrics",
      description: "Allow participant to subscribe to metrics",
      optional: true,
    },
    destinationRoom: {
      type: "string",
      label: "Destination Room",
      description: "Destination room which this participant can forward to",
      optional: true,
    },
    createRoomIfNotExists: {
      type: "boolean",
      label: "Create Room If Not Exists",
      description: "Whether to create the room if it doesn't exist",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      ttl,
      identity,
      name,
      metadata,
      room,
      createRoomIfNotExists,
      canPublish,
      canSubscribe,
      canPublishData,
      hidden,
      roomCreate,
      roomList,
      roomRecord,
      roomAdmin,
      ingressAdmin,
      canUpdateOwnMetadata,
      recorder,
      agent,
      canSubscribeMetrics,
      destinationRoom,
    } = this;

    // Create room if it doesn't exist and option is enabled
    if (createRoomIfNotExists) {
      await app.createRoom({
        name: room,
      });
    }

    // Create access token for the participant
    const response = await app.createAccessToken({
      identity,
      name,
      metadata,
      ttl,
      grant: {
        roomJoin: true,
        room,
        roomCreate,
        roomList,
        roomRecord,
        roomAdmin,
        ingressAdmin,
        canPublish,
        canSubscribe,
        canPublishData,
        canUpdateOwnMetadata,
        hidden,
        recorder,
        agent,
        canSubscribeMetrics,
        destinationRoom,
      },
    });

    $.export("$summary", "Successfully generated access token for participant to join the call.");

    return response;
  },
};
