import app from "../../habitica.app.mjs";

export default {
  key: "habitica-create-challenge",
  name: "Create Challenge",
  description: "Creates a challenge. [See the documentation](https://habitica.com/apidoc/#api-Challenge-CreateChallenge)",
  version: "0.0.2",
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
    group: {
      propDefinition: [
        app,
        "group",
        (c) => ({
          type: c.type,
        }),
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    shortName: {
      propDefinition: [
        app,
        "shortName",
      ],
    },
    summary: {
      propDefinition: [
        app,
        "summary",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    official: {
      propDefinition: [
        app,
        "official",
      ],
    },
    prize: {
      propDefinition: [
        app,
        "prize",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createChallenge({
      $,
      data: {
        group: this.group,
        name: this.name,
        shortName: this.shortName,
        summary: this.summary,
        description: this.description,
        official: this.official,
        prize: this.prize,
      },
    });
    $.export("$summary", "Successfully created challenge with ID: " + response.data._id);
    return response;
  },
};
