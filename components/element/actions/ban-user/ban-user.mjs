// x-pd-ai: optimized
import element from "../../element.app.mjs";

export default {
  key: "element-ban-user",
  name: "Ban User",
  description: "Ban a user from a room, also kicking them if they are currently joined. A banned user cannot rejoin or be invited back until the ban is lifted with **Unban User**. The connected account must be in the room with a power level high enough to ban, otherwise the API returns `M_FORBIDDEN`. Use **List Rooms** to find the room ID. [See the documentation](https://spec.matrix.org/latest/client-server-api/#post_matrixclientv3roomsroomidban)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    element,
    roomId: {
      propDefinition: [
        element,
        "roomId",
      ],
      description: "The Matrix room ID to ban the user from, e.g. `!OGEhHVWSdvArJzumhm:matrix.org`. Must be an ID, not a room alias. Use **List Rooms** to find the ID of a room you've already joined.",
    },
    userId: {
      propDefinition: [
        element,
        "userId",
      ],
      description: "The full Matrix ID of the user to ban, e.g. `@alice:matrix.org`.",
    },
    reason: {
      propDefinition: [
        element,
        "reason",
      ],
      description: "Optional reason recorded on the banned user's membership event, e.g. `Telling unfunny jokes`.",
    },
  },
  async run({ $ }) {
    const response = await this.element.banUser({
      $,
      roomId: this.roomId,
      data: {
        user_id: this.userId,
        reason: this.reason,
      },
    });
    $.export("$summary", `Successfully banned \`${this.userId}\` from room \`${this.roomId}\``);
    return {
      roomId: this.roomId,
      userId: this.userId,
      ...response,
    };
  },
};
