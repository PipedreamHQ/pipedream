import picdefense from "../../picdefense.app.mjs";

export default {
  key: "picdefense-safe-search",
  name: "Safe Search",
  description: "Returns whether the image is safe for work. [See the documentation](https://app.picdefense.io/apidocs/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    picdefense,
    url: {
      propDefinition: [
        picdefense,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.picdefense.safeSearch({
      $,
      data: {
        url: this.url,
      },
    });

    $.export("$summary", `Successfully completed safe search for URL: ${this.url}`);

    return response;
  },
};
