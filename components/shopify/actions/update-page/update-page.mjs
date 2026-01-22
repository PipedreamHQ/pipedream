import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-update-page",
  name: "Update Page",
  description: "Update an existing page. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/pageUpdate)",
  version: "0.0.10",
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
    title: {
      type: "string",
      label: "Title",
      description: "The title of the page",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "The text content of the page, complete with HTML markup",
      optional: true,
    },
  },
  async run({ $ }) {

    const response = await this.shopify.updatePage({
      id: this.pageId,
      page: {
        title: this.title,
        body: this.body,
      },
    });
    if (response.pageUpdate.userErrors.length > 0) {
      throw new Error(response.pageUpdate.userErrors[0].message);
    }
    $.export("$summary", `Updated page with ID ${response.pageUpdate.page.id}`);
    return response;
  },
};
