import flippingbook from "../../flippingbook.app.mjs";

export default {
  key: "flippingbook-find-flipbook-by-title",
  name: "Find Flipbook by Title",
  description: "Locates a specific flipbook using the provided title. [See the documentation](https://apidocs.flippingbook.com/#list-filtered-and-or-paged-publications-in-the-account)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    flippingbook,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the flipbook. In order to match, the publication name must contain the exact value",
    },
  },
  async run({ $ }) {
    const { publications } = await this.flippingbook.listFlipbooks({
      $,
      params: {
        query: this.title,
      },
    });
    $.export("$summary", `Found ${publications.length} flipbook${publications.length === 1
      ? ""
      : "s"} mathcing the title ${this.title}`);
    return publications;
  },
};
