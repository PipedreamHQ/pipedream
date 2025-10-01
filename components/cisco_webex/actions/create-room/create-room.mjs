import ciscoWebex from "../../cisco_webex.app.mjs";

export default {
  key: "cisco_webex-create-room",
  name: "Create a Room",
  description: "Creates a room. The authenticated user is automatically added as a member of the room. [See the docs here](https://developer.webex.com/docs/api/v1/rooms/create-a-room)",
  type: "action",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ciscoWebex,
    title: {
      type: "string",
      label: "Title",
      description: "A user-friendly name for the room.",
    },
    teamId: {
      propDefinition: [
        ciscoWebex,
        "teamId",
      ],
    },
    isLocked: {
      type: "boolean",
      label: "Is Locked",
      description: "Set the space as locked/moderated and the creator becomes a moderator.",
      optional: true,
    },
    isAnnouncementOnly: {
      type: "boolean",
      label: "Is Announcement Only",
      description: "Sets the space into Announcement Mode.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      title,
      teamId,
      isLocked,
      isAnnouncementOnly,
    } = this;

    const response =
      await this.ciscoWebex.createRoom({
        data: {
          title,
          teamId,
          isLocked,
          isAnnouncementOnly,
        },
      });

    $.export("$summary", `Successfully created room with ID ${response.id}`);

    return response;
  },
};
