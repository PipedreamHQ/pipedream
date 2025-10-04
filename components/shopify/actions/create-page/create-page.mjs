import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-create-page",
  name: "Create Page",
  description: "Create a new page. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/pageCreate)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shopify,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the page.",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The text content of the page, complete with HTML markup",
    },
  },
  async run({ $ }) {
    const response = await this.shopify.createPage({
      page: {
        title: this.title,
        body: this.body,
      },
    });
    if (response.pageCreate.userErrors.length > 0) {
      throw new Error(response.pageCreate.userErrors[0].message);
    }
    $.export("$summary", `Created new page with ID ${response.pageCreate.page.id}`);
    return response;
  },
};
