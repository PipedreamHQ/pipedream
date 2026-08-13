import mural from "../../mural.app.mjs";

export default {
  key: "mural-create-room",
  name: "Create Room",
  description: "Create a new room to group related murals within a workspace. Choose an `open` room to let any workspace member join, or a `private` room to restrict access to invited members only. Confidential rooms add a further layer of security but are Enterprise-only and cannot have share links. Requires the `rooms:write` OAuth scope. [See the documentation](https://developers.mural.co/public/reference/createroom)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    name: {
      type: "string",
      label: "Name",
      description: "The name of the room",
    },
    type: {
      type: "string",
      label: "Type",
      description: "When set to `open`, any member of a workspace may join the room. When set to `private`, only members that are invited may join the room.",
      options: [
        "open",
        "private",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the room",
      optional: true,
    },
    confidential: {
      type: "boolean",
      label: "Confidential",
      description: "When `true`, the room will be marked as confidential. Confidential rooms are for enterprise customers only.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mural.createRoom({
      $,
      data: {
        workspaceId: this.workspaceId,
        name: this.name,
        type: this.type,
        description: this.description,
        confidential: this.confidential,
      },
    });
    $.export("$summary", `Successfully created room "${this.name}"`);
    return response;
  },
};
