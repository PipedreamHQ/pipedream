// x-pd-ai: optimized
import element from "../../element.app.mjs";

export default {
  key: "element-invite-user",
  name: "Invite User",
  description: "Invite a user to an existing room. The connected account must already be joined to the room and have permission to invite. Optionally include a `Reason`, which is stored on the membership event. [See the documentation](https://spec.matrix.org/latest/client-server-api/#post_matrixclientv3roomsroomidinvite)",
  version: "0.0.1",
  type: "action",
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
    },
    userId: {
      propDefinition: [
        element,
        "userId",
      ],
      description: "The full Matrix ID of the user to invite, e.g. `@alice:matrix.org`. Note that some homeservers accept invites for user IDs that are not registered yet, so a successful response does not confirm the user exists.",
    },
    reason: {
      propDefinition: [
        element,
        "reason",
      ],
      description: "Optional reason included on the membership event sent to the invitee, e.g. `Welcome to the team!`.",
    },
  },
  async run({ $ }) {
    const response = await this.element.inviteUser({
      $,
      roomId: this.roomId,
      data: {
        user_id: this.userId,
        reason: this.reason,
      },
    });
    $.export("$summary", `Successfully invited \`${this.userId}\` to room \`${this.roomId}\``);
    return {
      roomId: this.roomId,
      userId: this.userId,
      ...response,
    };
  },
};
