import app from "../../livekit.app.mjs";

export default {
  key: "livekit-list-rooms",
  name: "List Rooms",
  description: "List all rooms with LiveKit. [See the documentation](https://docs.livekit.io/home/server/managing-rooms/#list-rooms).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const rooms = await this.app.listRooms();
    $.export("$summary", `Successfully listed \`${rooms.length}\` room(s).`);
    return rooms;
  },
};
