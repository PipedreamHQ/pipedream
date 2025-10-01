import app from "../../encodian.app.mjs";

export default {
  key: "encodian-validate-url",
  name: "Validate URL",
  description: "Validate the availability of the URL. [See the documentation](https://api.apps-encodian.com/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.validateUrl({
      $,
      data: {
        url: this.url,
        validateURL: true,
      },
    });

    $.export("$summary", `The validation of the URL availability returned: '${response.result}'`);

    return response;
  },
};
