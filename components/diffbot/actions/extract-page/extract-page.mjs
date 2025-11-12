import app from "../../diffbot.app.mjs";

export default {
  key: "diffbot-extract-page",
  name: "Extract Page",
  description: "Automatically classify a page and extract data according to its type. [See the documentation](https://docs.diffbot.com/reference/extract-analyze)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.app.extractPage({
      $,
      params: {
        url: this.url,
      },
    });

    $.export("$summary", `Successfully extracted data from ${response.title}`);

    return response;
  },
};
