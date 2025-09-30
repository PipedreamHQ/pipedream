import app from "../../lessonspace.app.mjs";

export default {
  key: "lessonspace-launch-space",
  name: "Launch Space",
  description: "Launch a unified space on Lessonspace. [See the documentation](https://api.thelessonspace.com/v2/docs/#tag/Spaces-greater-Launch)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    spaceId: {
      propDefinition: [
        app,
        "spaceId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    allowGuests: {
      propDefinition: [
        app,
        "allowGuests",
      ],
    },
    recordContent: {
      propDefinition: [
        app,
        "recordContent",
      ],
    },
    transcribe: {
      propDefinition: [
        app,
        "transcribe",
      ],
    },
    recordAv: {
      propDefinition: [
        app,
        "recordAv",
      ],
    },
    userName: {
      propDefinition: [
        app,
        "userName",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.launchSpace({
      $,
      data: {
        id: this.spaceId,
        name: this.name,
        allow_guests: this.allowGuests,
        record_content: this.recordContent,
        transcribe: this.transcribe,
        record_av: this.recordAv,
        user: {
          name: this.userName,
        },
      },
    });
    $.export("$summary", `Successfully launched space named ${this.name}`);
    return response;
  },
};
