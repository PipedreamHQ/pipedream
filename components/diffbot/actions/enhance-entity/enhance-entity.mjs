import app from "../../diffbot.app.mjs";

export default {
  key: "diffbot-enhance-entity",
  name: "Enhance Entity",
  description: "Enrich a person or organization record with partial data input [See the documentation] (https://docs.diffbot.com/reference/enhancepost)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    type: {
      propDefinition: [
        app,
        "type",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const {
      app, ...data
    } = this;
    const response = await app.enhanceEntity({
      $,
      data,
    });

    $.export("$summary", "Successfully enhanced entity");

    return response;
  },
};
