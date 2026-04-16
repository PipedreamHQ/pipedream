import newSloth from "../../new_sloth.app.mjs";

export default {
  key: "new_sloth-delete-source",
  name: "Delete Source",
  description: "Delete a source in New Sloth. [See the documentation](https://app.newsloth.com/api-reference#deletesource)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    newSloth,
    feedRssUrl: {
      propDefinition: [
        newSloth,
        "feedRssUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.newSloth.deleteSource({
      $,
      params: {
        feedRssUrl: this.feedRssUrl,
      },
    });
    $.export("$summary", `Successfully deleted source: "${this.feedRssUrl}"`);
    return response;
  },
};
