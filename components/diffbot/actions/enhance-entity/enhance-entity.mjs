import app from "../../diffbot.app.mjs";

export default {
  key: "diffbot-enhance-entity",
  name: "Enhance Entity",
  description: "Enrich a person or organization record with partial data input [See the documentation] (https://docs.diffbot.com/reference/enhancepost)",
  version: "0.0.1",
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
    const response = await this.app.enhanceEntity({
      $,
      data: {
        type: this.type,
        name: this.name,
        location: this.location,
        url: this.url,
      },
    });

    $.export("$summary", "Successfully enhanced entity");

    return response;
  },
};
