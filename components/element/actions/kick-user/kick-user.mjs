import element from "../../element.app.mjs";

export default {
  key: "element-kick-user",
  name: "Kick User",
  description: "Remove a user from a room without banning them. A kicked user can be invited back with **Invite User**, and can rejoin on their own if the room's join rules allow it — use **Ban User** instead to also block their return. The connected account must be in the room with a power level high enough to kick, otherwise the API returns `M_FORBIDDEN`; the same error is returned if the target user is not currently in the room. Use **List Rooms** to find the room ID. [See the documentation](https://spec.matrix.org/latest/client-server-api/#post_matrixclientv3roomsroomidkick)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
      description: "The Matrix room ID to kick the user from, e.g. `!OGEhHVWSdvArJzumhm:matrix.org`. Must be an ID, not a room alias — use **Resolve Room Alias** to convert one. Use **List Rooms** to find the ID of a room you've already joined.",
    },
    userId: {
      propDefinition: [
        element,
        "userId",
      ],
      description: "The full Matrix ID of the user to kick, e.g. `@alice:matrix.org`.",
    },
    reason: {
      propDefinition: [
        element,
        "reason",
      ],
      description: "Optional reason recorded on the kicked user's membership event, e.g. `Telling unfunny jokes`.",
    },
  },
  async run({ $ }) {
    const response = await this.element.kickUser({
      $,
      roomId: this.roomId,
      data: {
        user_id: this.userId,
        reason: this.reason,
      },
    });
    $.export("$summary", `Successfully kicked \`${this.userId}\` from room \`${this.roomId}\``);
    return {
      roomId: this.roomId,
      userId: this.userId,
      ...response,
    };
  },
};
