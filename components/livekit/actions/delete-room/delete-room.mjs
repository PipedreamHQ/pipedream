import app from "../../livekit.app.mjs";

export default {
  key: "livekit-delete-room",
  name: "Delete Room",
  description: "Delete a room in LiveKit. [See the documentation](https://docs.livekit.io/home/server/managing-rooms/#delete-a-room)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    room: {
      propDefinition: [
        app,
        "room",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      room,
    } = this;

    await app.deleteRoom(room);

    $.export("$summary", "Successfully deleted room.");

    return {
      success: true,
    };
  },
};
