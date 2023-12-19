import cuttLy from "../../cutt_ly.app.mjs";

export default {
  key: "cutt_ly-update-source-url",
  name: "Update Source URL",
  description: "Changes the source URL of a previously shortened URL. [See the documentation](https://cutt.ly/cuttly-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cuttLy,
    shortenedUrl: {
      propDefinition: [
        cuttLy,
        "shortenedUrl",
      ],
    },
    newSourceUrl: {
      propDefinition: [
        cuttLy,
        "newSourceUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cuttLy.changeSourceUrl({
      shortenedUrl: this.shortenedUrl,
      newSourceUrl: this.newSourceUrl,
    });
    $.export("$summary", `Successfully updated source URL for ${this.shortenedUrl}`);
    return response;
  },
};
