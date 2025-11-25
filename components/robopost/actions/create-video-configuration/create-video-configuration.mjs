import app from "../../robopost.app.mjs";

export default {
  key: "robopost-create-video-configuration",
  name: "Create Video Configuration",
  description: "Create a new faceless video series configuration for generating multiple videos with consistent settings. [See the documentation](https://robopost.app/docs/robopost-api/#videogenerationendpoints)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    contentType: {
      propDefinition: [
        app,
        "contentType",
      ],
    },
    style: {
      propDefinition: [
        app,
        "style",
      ],
    },
    voice: {
      propDefinition: [
        app,
        "voice",
      ],
    },
    lang: {
      propDefinition: [
        app,
        "lang",
      ],
    },
    maxDuration: {
      propDefinition: [
        app,
        "maxDuration",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createVideoConfiguration({
      $,
      data: {
        name: this.name,
        content_type: this.contentType,
        style: this.style,
        voice: this.voice,
        lang: this.lang,
        max_duration: this.maxDuration,
      },
    });
    $.export("$summary", `Successfully created video series configuration with ID: ${response.id}`);
    return response;
  },
};
