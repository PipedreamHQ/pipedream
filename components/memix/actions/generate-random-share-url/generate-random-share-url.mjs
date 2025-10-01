import app from "../../memix.app.mjs";
export default {
  name: "Caption to Memix URL",
  description:
    "Generate a Memix share URL with a random template using the supplied caption. [See the docs here](https://api.memix.com/docs)",
  key: "memix-generate-random-share-url",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    caption: {
      type: "string",
      label: "Caption",
    },
  },
  async run({ $ }) {
    const template = await this.app.getRandomTemplate({
      $,
    });
    const uri = this.app.gifURIForTemplate(template, this.caption);
    $.export(
      "$summary",
      "Successfully generated a Memix share URL with a random template",
    );
    return uri;
  },
};
