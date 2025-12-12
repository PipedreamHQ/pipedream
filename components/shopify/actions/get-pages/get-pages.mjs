import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-get-pages",
  name: "Get Pages",
  description: "Retrieve a list of all pages. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/pages)",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shopify,
    maxResults: {
      propDefinition: [
        shopify,
        "maxResults",
      ],
    },
    reverse: {
      propDefinition: [
        shopify,
        "reverse",
      ],
    },
  },
  async run({ $ }) {
    const pages = await this.shopify.getPaginated({
      resourceFn: this.shopify.listPages,
      resourceKeys: [
        "pages",
      ],
      variables: {
        reverse: this.reverse,
      },
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${pages.length} page${pages.length === 1
      ? ""
      : "s"}`);
    return pages;
  },
};
