import element from "../../element.app.mjs";

export default {
  key: "element-unban-user",
  name: "Unban User",
  description: "Lift a ban on a user in a room, reversing **Ban User**. Unbanning does not put the user back in the room — it only allows them to be invited again, and to rejoin if the room's join rules would otherwise let them. The connected account must have a power level high enough to unban, otherwise the API returns `M_FORBIDDEN`. Use **List Rooms** to find the room ID. [See the documentation](https://spec.matrix.org/latest/client-server-api/#post_matrixclientv3roomsroomidunban)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
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
      description: "The Matrix room ID to unban the user from, e.g. `!OGEhHVWSdvArJzumhm:matrix.org`. Must be an ID, not a room alias — use **Resolve Room Alias** to convert one. Use **List Rooms** to find the ID of a room you've already joined.",
    },
    userId: {
      propDefinition: [
        element,
        "userId",
      ],
      description: "The full Matrix ID of the user to unban, e.g. `@alice:matrix.org`.",
    },
    reason: {
      propDefinition: [
        element,
        "reason",
      ],
      description: "Optional reason recorded on the unbanned user's membership event, e.g. `They've been banned long enough`.",
    },
  },
  async run({ $ }) {
    const response = await this.element.unbanUser({
      $,
      roomId: this.roomId,
      data: {
        user_id: this.userId,
        reason: this.reason,
      },
    });
    $.export("$summary", `Successfully unbanned \`${this.userId}\` from room \`${this.roomId}\``);
    return {
      roomId: this.roomId,
      userId: this.userId,
      ...response,
    };
  },
};
