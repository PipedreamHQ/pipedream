import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-delete-page",
  name: "Delete Page",
  description: "Delete an existing page. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/pageDelete)",
  version: "0.0.8",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shopify,
    pageId: {
      propDefinition: [
        shopify,
        "pageId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shopify.deletePage({
      id: this.pageId,
    });
    $.export("$summary", `Deleted page with ID ${this.pageId}`);
    return response;
  },
};
