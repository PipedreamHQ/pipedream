// x-pd-ai: optimized
import element from "../../element.app.mjs";

export default {
  key: "element-create-room",
  name: "Create Room",
  description: "Create a new room, optionally inviting other users to it right away. Returns the new room's ID, which can be passed into **Send Message** or **Invite User**. [See the documentation](https://spec.matrix.org/latest/client-server-api/#post_matrixclientv3createroom)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    element,
    name: {
      type: "string",
      label: "Name",
      description: "The name to display for the room, e.g. `Project Discussion`.",
      optional: true,
    },
    topic: {
      type: "string",
      label: "Topic",
      description: "A short description of the room's purpose.",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Whether the room appears in the homeserver's public room directory. Defaults to `private`.",
      optional: true,
      options: [
        "public",
        "private",
      ],
    },
    preset: {
      type: "string",
      label: "Preset",
      description: "Convenience preset that sets sensible defaults for the room's join rules and permissions. `private_chat` requires an invite to join and gives only the creator elevated permissions; `trusted_private_chat` also requires an invite but gives every invitee the same power level as the creator; `public_chat` lets anyone join without an invite.",
      optional: true,
      options: [
        "private_chat",
        "public_chat",
        "trusted_private_chat",
      ],
    },
    invite: {
      type: "string[]",
      label: "Invite",
      description: "Full Matrix IDs of users to invite to the room, e.g. `[\"@alice:matrix.org\", \"@bob:matrix.org\"]`.",
      optional: true,
    },
    isDirect: {
      type: "boolean",
      label: "Is Direct Message",
      description: "Mark this room as a direct message between the creator and the invited user(s), rather than a group room.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.element.createRoom({
      $,
      data: {
        name: this.name,
        topic: this.topic,
        visibility: this.visibility,
        preset: this.preset,
        invite: this.invite,
        is_direct: this.isDirect,
      },
    });
    $.export("$summary", `Successfully created room \`${response?.room_id}\``);
    return response;
  },
};
