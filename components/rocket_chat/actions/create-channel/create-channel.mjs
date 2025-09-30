import rocketchat from "../../rocket_chat.app.mjs";

export default {
  key: "rocket_chat-create-channel",
  name: "Create Channel",
  description: "Creates a new channel. [See the documentation](https://developer.rocket.chat/reference/api/rest-api/endpoints/rooms/channels-endpoints/create-channel)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rocketchat,
    name: {
      type: "string",
      label: "Room Name",
      description: "The name of the new room",
    },
    members: {
      propDefinition: [
        rocketchat,
        "username",
      ],
      type: "string[]",
      label: "Members",
      description: "The list of usernames to be added to the new channel",
      optional: true,
    },
    readOnly: {
      type: "boolean",
      label: "Read Only",
      description: "Set if the channel is read-only or not. The default value is `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rocketchat.createChannel({
      $,
      data: {
        name: this.name,
        members: this.members,
        readOnly: this.readOnly,
      },
    });

    $.export("$summary", `Successfully created channel ${this.name}`);
    return response;
  },
};
