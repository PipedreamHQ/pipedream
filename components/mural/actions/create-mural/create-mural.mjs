import mural from "../../mural.app.mjs";

export default {
  key: "mural-create-mural",
  name: "Create Mural",
  description: "Create a new mural within a specified workspace. [See the documentation](https://developers.mural.co/public/reference/createmural)",
  version: "0.0.2",
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
    roomId: {
      propDefinition: [
        mural,
        "roomId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the Mural.",
    },
    backgroundColor: {
      type: "string",
      label: "Background Color",
      description: "The background color of the mural. Example: `#FAFAFAFF`",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The height of the mural in px",
      optional: true,
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The width of the mural in px",
      optional: true,
    },
    infinite: {
      type: "boolean",
      label: "Infinite",
      description: "When `true`, this indicates that the mural canvas is borderless and grows as you add widgets to it.",
      optional: true,
    },
    timerSoundTheme: {
      type: "string",
      label: "Timer Sound Theme",
      description: "The timer sound theme for the mural",
      options: [
        "airplane",
        "cello",
        "cuckoo",
      ],
      optional: true,
    },
    visitorAvatarTheme: {
      type: "string",
      label: "Visitor Avatar Theme",
      description: "The visitor avatar theme for the mural",
      options: [
        "animals",
        "music",
        "travel",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mural.createMural({
      $,
      data: {
        roomId: this.roomId,
        title: this.title,
        backgroundColor: this.backgroundColor,
        height: this.height,
        width: this.width,
        infinite: this.infinite,
        timerSoundTheme: this.timerSoundTheme,
        visitorAvatarTheme: this.visitorAvatarTheme,
      },
    });
    $.export("$summary", `Successfully created mural "${this.title}"`);
    return response;
  },
};
