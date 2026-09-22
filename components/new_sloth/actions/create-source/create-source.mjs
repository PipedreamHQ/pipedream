import newSloth from "../../new_sloth.app.mjs";

export default {
  key: "new_sloth-create-source",
  name: "Create Source",
  description: "Create a new source in New Sloth. [See the documentation](https://app.newsloth.com/api-reference#createsource)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    newSloth,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the source",
    },
    sourceUrl: {
      type: "string",
      label: "Source URL",
      description: "URL of the source data feed or webpage",
    },
    detectAll: {
      type: "boolean",
      label: "Detect All",
      description: "For a webpage source, set to 'true' if all possible item elements (title, link, summary/description, image and publication date) should be auto-detected by the feed parser, if your current plan permits. Else set to 'false' (default) to only detect title and link for feed items.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.newSloth.createSource({
      $,
      data: {
        title: this.title,
        sourceUrl: this.sourceUrl,
        detectAll: this.detectAll,
      },
    });
    $.export("$summary", `Successfully created source: "${this.title}"`);
    return response;
  },
};
