import chatwork from "../../chatwork.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "chatwork-create-room",
  name: "Create Room",
  description: "Create a new group chat. [See the documentation](https://download.chatwork.com/ChatWork_API_Documentation.pdf)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chatwork,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new group chat",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the new group chat",
      optional: true,
    },
    iconType: {
      type: "string",
      label: "Icon Type",
      description: "Type of the group chat icon",
      options: constants.ICON_TYPES,
      optional: true,
    },
  },
  async run({ $ }) {
    const { account_id: id } = await this.chatwork.getUser({
      $,
    });

    const response = await this.chatwork.createRoom({
      params: {
        name: this.name,
        description: this.description,
        icon_preset: this.iconType,
        members_admin_ids: id,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created room with ID ${response.room_id}`);
    }

    return response;
  },
};
