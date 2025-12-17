import app from "../../encodian.app.mjs";

export default {
  key: "encodian-compare-text",
  name: "Compare Text",
  description: "Compares two texts answering if they are equal or not. [See the documentation](https://api.apps-encodian.com/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    primaryText: {
      propDefinition: [
        app,
        "primaryText",
      ],
    },
    secondaryText: {
      propDefinition: [
        app,
        "secondaryText",
      ],
    },
    ignoreCase: {
      propDefinition: [
        app,
        "ignoreCase",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.compareTexts({
      $,
      data: {
        primaryText: this.primaryText,
        secondaryText: this.secondaryText,
        ignoreCase: this.ignoreCase,
      },
    });

    $.export("$summary", `The text comparison returned: '${response.result}'`);

    return response;
  },
};
