import shopify from "../../shopify.app.mjs";

export default {
  name: "Add Tags",
  version: "0.0.11",
  key: "shopify-add-tags",
  description:
    "Add tags. [See the docs](https://shopify.dev/api/admin-graphql/2022-07/mutations/tagsadd)",
  props: {
    shopify,
    resource: {
      label: "Resource Type",
      type: "string",
      description: "The Shopify Admin API resource type.",
      options: [
        "Product",
        "Customer",
        "Order",
        "DraftOrder",
        "OnlineStoreArticle",
      ],
    },
    id: {
      label: "Resource ID",
      type: "string",
      description:
        "The Shopify Admin Resource ID. For example, the ID of a Product, Customer, Order, DraftOrder, or OnlineStoreArticle. Can be found at the end of the URL in Shopify Admin.",
    },
    tags: {
      label: "Tags",
      type: "string",
      description: "Separate tags with a comma to add multiple tags.",
    },
  },
  type: "action",
  async run({ $ }) {
    const { resource, id } = this;
    const gid = `gid://shopify/${resource}/${id}`;
    let tags = [this.tags];

    if (tags.includes(",")) {
      tags = tags.split(",").map((item) => item.trim());
    }

    const mutation = `
      mutation tagsAdd($id: ID!, $tags: [String!]!) {
        tagsAdd(id: $id, tags: $tags) {
          node {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      id: gid,
      tags: tags,
    };

    const res = await this.shopify
      .getShopifyInstance()
      .graphql(mutation, variables);

    if (res.tagsAdd.userErrors.length > 0) {
      throw new Error(res.tagsAdd.userErrors[0].message);
    }

    $.export(
      "$summary",
      `Added tag(s) \`${tags.join(", ")}\` with id \`${res.tagsAdd.node.id}\``
    );
    return res;
  },
};
