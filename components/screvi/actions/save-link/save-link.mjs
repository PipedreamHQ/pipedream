import screvi from "../../screvi.app.mjs";

export default {
  key: "screvi-save-link",
  name: "Save Link",
  description: "Save a web page to your Screvi reading list. Screvi fetches and parses the page in the background. [See the documentation](https://screvi.com/docs/api/public-api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    screvi,
    url: {
      type: "string",
      label: "URL",
      description: "The page to save, for example `https://paulgraham.com/greatwork.html`",
    },
    tags: {
      propDefinition: [
        screvi,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.screvi.saveArticle({
      $,
      data: {
        url: this.url,
        tags: this.tags?.length
          ? this.tags
          : undefined,
      },
    });

    $.export("$summary", data.duplicate
      ? `\`${this.url}\` was already in your library`
      : `Saved \`${this.url}\` to Screvi`);

    return data;
  },
};
