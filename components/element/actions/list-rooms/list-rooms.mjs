// x-pd-ai: optimized
import element from "../../element.app.mjs";

export default {
  key: "element-list-rooms",
  name: "List Rooms",
  description: "List the Matrix rooms the connected account has joined. The Matrix API only returns room IDs from this endpoint (no name or topic) — pass a returned ID directly into **Send Message** or **Invite User**. [See the documentation](https://spec.matrix.org/latest/client-server-api/#get_matrixclientv3joined_rooms)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    element,
  },
  async run({ $ }) {
    const { joined_rooms: joinedRooms } = await this.element.listJoinedRooms({
      $,
    });
    $.export("$summary", `Successfully found ${joinedRooms?.length || 0} joined room(s)`);
    return joinedRooms;
  },
};
