import app from "../../onlyoffice_docspace.app.mjs";

export default {
  key: "onlyoffice_docspace-create-room",
  name: "Create Room",
  description: "Creates a new room. [See the documentation](https://api.onlyoffice.com/docspace/method/files/post/api/2.0/files/rooms)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "The name of the room to be created.",
    },
    roomType: {
      type: "integer",
      label: "Room Type",
      description: "The type of the room.",
      options: [
        {
          label: "Editing Room",
          value: 2,
        },
        {
          label: "Custom Room",
          value: 5,
        },
        {
          label: "Public Room",
          value: 6,
        },
      ],
    },
    notify: {
      type: "boolean",
      label: "Notify",
      description: "Whether to notify the user about the room creation.",
      optional: true,
    },
    sharingMessage: {
      type: "string",
      label: "Sharing Message",
      description: "Message to send when notifying about the shared room",
      optional: true,
    },
  },
  methods: {
    createRoom(args = {}) {
      return this.app.post({
        path: "/files/rooms",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createRoom,
      title,
      roomType,
      notify,
      sharingMessage,
    } = this;

    const response = await createRoom({
      $,
      data: {
        Title: title,
        RoomType: roomType,
        Notify: notify,
        SharingMessage: sharingMessage,
      },
    });
    $.export("$summary", `Successfully created room with ID \`${response.response.id}\`.`);
    return response;
  },
};
