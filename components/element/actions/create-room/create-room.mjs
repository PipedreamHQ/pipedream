import element from "../../element.app.mjs";

export default {
  key: "element-create-room",
  name: "Create Room",
  description: "Create a new room, optionally inviting other users to it right away. Returns the new room's ID, which can be passed into **Send Message** or **Invite User**. Set `Room Alias Name` to give the room a memorable local alias (e.g. `thepub` becomes `#thepub:matrix.org` on matrix.org). If you omit `Preset`, `Visibility` also picks join rules — `public` creates an openly-joinable room. [See the documentation](https://spec.matrix.org/latest/client-server-api/#post_matrixclientv3createroom)",
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
    roomAliasName: {
      type: "string",
      label: "Room Alias Name",
      description: "Local part of the room alias to create on this homeserver, e.g. `thepub` becomes `#thepub:matrix.org` if you are on matrix.org. The alias becomes the room's canonical alias. Do not include the leading `#` or the `:homeserver` suffix.",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Whether the room is published (`public`) to the homeserver's room directory or kept unlisted (`private`). Defaults to `private`. If `preset` is omitted, the server also uses this to pick join rules: `public` maps to `public_chat` (anyone can join) and `private` maps to `private_chat` (invite required). When `preset` is set, visibility only affects directory listing.",
      optional: true,
      options: [
        "public",
        "private",
      ],
    },
    preset: {
      type: "string",
      label: "Preset",
      description: "Convenience preset that sets sensible defaults for the room's join rules and permissions. `private_chat` requires an invite to join and gives only the creator elevated permissions; `trusted_private_chat` also requires an invite but gives every invitee the same power level as the creator; `public_chat` lets anyone join without an invite. If omitted, the server infers this from `visibility`.",
      optional: true,
      options: [
        "private_chat",
        "public_chat",
        "trusted_private_chat",
      ],
    },
    roomVersion: {
      type: "string",
      label: "Room Version",
      description: "The Matrix room version to create, e.g. `12`. Omit to use the homeserver's default. The server returns `M_UNSUPPORTED_ROOM_VERSION` if it does not support the requested version.",
      optional: true,
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
        room_alias_name: this.roomAliasName,
        visibility: this.visibility,
        preset: this.preset,
        room_version: this.roomVersion,
        invite: this.invite,
        is_direct: this.isDirect,
      },
    });
    $.export("$summary", `Successfully created room \`${response?.room_id}\``);
    return response;
  },
};
