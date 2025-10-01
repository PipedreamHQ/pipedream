import app from "../../livekit.app.mjs";

export default {
  key: "livekit-create-room",
  name: "Create Room",
  description: "Create a new room in LiveKit. [See the documentation](https://docs.livekit.io/home/server/managing-rooms/#create-a-room).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Room Name",
      description: "The name of the room",
    },
    emptyTimeout: {
      type: "integer",
      label: "Empty Timeout",
      description: "Number of seconds to keep the room open before any participant joins",
      optional: true,
    },
    departureTimeout: {
      type: "integer",
      label: "Departure Timeout",
      description: "Number of seconds to keep the room open after the last participant leaves",
      optional: true,
    },
    maxParticipants: {
      type: "integer",
      label: "Max Participants",
      description: "Limit to the number of participants in a room at a time",
      optional: true,
    },
    metadata: {
      type: "string",
      label: "Metadata",
      description: "Initial room metadata",
      optional: true,
    },
    minPlayoutDelay: {
      type: "integer",
      label: "Min Playout Delay",
      description: "Minimum playout delay in milliseconds",
      optional: true,
    },
    maxPlayoutDelay: {
      type: "integer",
      label: "Max Playout Delay",
      description: "Maximum playout delay in milliseconds",
      optional: true,
    },
    syncStreams: {
      type: "boolean",
      label: "Sync Streams",
      description: "Improves A/V sync when min_playout_delay set to a value larger than 200ms. It will disables transceiver re-use -- this option is not recommended for rooms with frequent subscription changes",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      name,
      emptyTimeout,
      departureTimeout,
      maxParticipants,
      metadata,
      minPlayoutDelay,
      maxPlayoutDelay,
      syncStreams,
    } = this;

    const response = await app.createRoom({
      name,
      emptyTimeout,
      departureTimeout,
      maxParticipants,
      metadata,
      minPlayoutDelay,
      maxPlayoutDelay,
      syncStreams,
    });
    $.export("$summary", `Successfully created room with SID \`${response.sid}\`.`);
    return response;
  },
};
