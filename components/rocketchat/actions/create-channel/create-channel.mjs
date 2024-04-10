import rocketchat from "../../rocketchat.app.mjs";

export default {
  key: "rocketchat-create-channel",
  name: "Create Channel",
  description: "Creates a new room based on the props: room name (required), members (optional, list of usernames), and type (optional, public or private).",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    rocketchat,
    roomName: {
      type: "string",
      label: "Room Name",
      description: "The name of the new room",
    },
    members: {
      type: "string[]",
      label: "Members",
      description: "The list of usernames to be added to the new room",
      optional: true,
    },
    roomType: {
      type: "string",
      label: "Room Type",
      description: "The type of the new room",
      options: [
        "public",
        "private",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    // Fetch existing rooms
    const existingRooms = await this.rocketchat.getChannels();

    // Check if the room already exists
    const roomExists = existingRooms.channels.find(
      (room) => room.name === this.roomName,
    );

    if (roomExists) {
      throw new Error("Room with this name already exists.");
    }

    // Create the room
    const response = await this.rocketchat.createRoom({
      roomName: this.roomName,
      members: this.members,
      roomType: this.roomType,
    });

    $.export("$summary", `Successfully created room ${this.roomName}`);
    return response;
  },
};
