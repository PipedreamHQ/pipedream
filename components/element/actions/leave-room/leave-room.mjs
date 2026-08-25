// x-pd-ai: optimized
import element from "../../element.app.mjs";

export default {
  key: "element-leave-room",
  name: "Leave Room",
  description: "Leave a room the connected account has joined, or reject a pending invite to it. After leaving, the account stops receiving new events in the room; rejoining an invite-only room requires a fresh invite, so treat this as hard to undo. Use **List Rooms** to find the room ID. [See the documentation](https://spec.matrix.org/latest/client-server-api/#post_matrixclientv3roomsroomidleave)",
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
    },
    reason: {
      propDefinition: [
        element,
        "reason",
      ],
      description: "Optional reason recorded on the membership event other room members see, e.g. `Saying farewell - thanks for the support!`.",
    },
  },
  async run({ $ }) {
    const response = await this.element.leaveRoom({
      $,
      roomId: this.roomId,
      data: {
        reason: this.reason,
      },
    });
    $.export("$summary", `Successfully left room \`${this.roomId}\``);
    return {
      roomId: this.roomId,
      ...response,
    };
  },
};
