import element from "../../element.app.mjs";

export default {
  key: "element-resolve-room-alias",
  name: "Resolve Room Alias",
  description: "Look up the room ID that a human-readable room alias points to, e.g. `#engineering:matrix.org`. Every other action in this app takes a room ID (`!OGEhHVWSdvArJzumhm:matrix.org`) and rejects aliases, so use this first whenever you only know the alias. Aliases can be re-pointed to a different room over time, so always trust the returned `room_id` rather than assuming an alias still maps to the room you expect. Returns the room ID and the servers that know the alias. [See the documentation](https://spec.matrix.org/latest/client-server-api/#get_matrixclientv3directoryroomroomalias)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    element,
    roomAlias: {
      type: "string",
      label: "Room Alias",
      description: "The full room alias to resolve, including the leading `#` and the homeserver suffix, e.g. `#engineering:matrix.org`. The homeserver returns `M_NOT_FOUND` if no room is mapped to the alias.",
    },
  },
  async run({ $ }) {
    const response = await this.element.resolveRoomAlias({
      $,
      roomAlias: this.roomAlias,
    });
    $.export("$summary", `Successfully resolved \`${this.roomAlias}\` to room \`${response?.room_id}\``);
    return response;
  },
};
