import mural from "../../mural.app.mjs";

export default {
  key: "mural-list-rooms",
  name: "List Rooms",
  description: "List rooms in a workspace. [See the documentation](https://developers.mural.co/public/reference/getworkspacerooms)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mural,
    workspaceId: {
      propDefinition: [
        mural,
        "workspaceId",
      ],
    },
    maxResults: {
      propDefinition: [
        mural,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const rooms = await this.mural.getPaginatedResults({
      fn: this.mural.listRooms,
      args: {
        $,
        workspaceId: this.workspaceId,
      },
      max: this.maxResults,
    });

    $.export("$summary", `Successfully retrieved ${rooms.length} room${rooms.length === 1
      ? ""
      : "s"}`);
    return rooms;
  },
};
