import metafieldActions from "../common/metafield-actions.mjs";
import common from "@pipedream/shopify/actions/update-metafield/update-metafield.mjs";
import shopify from "../../shopify_developer_app.app.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-update-metafield",
  version: "0.0.6",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
    ...common.props,
  },
  async additionalProps() {
    const props = await this.getOwnerIdProp(this.ownerResource);

    props.metafieldId = {
      type: "string",
      label: "Metafield ID",
      description: "The metafield to update",
    };
    props.value = {
      type: "string",
      label: "Value",
      description: "The data to store in the metafield",
    };

    return props;
  },
  methods: {
    ...metafieldActions.methods,
    ...common.methods,
    async getOwnerIdProp(ownerResource) {
      const resources = {
        product: shopify.propDefinitions.productId,
        variants: shopify.propDefinitions.productVariantId,
        customer: shopify.propDefinitions.customerId,
        collection: {
          ...shopify.propDefinitions.collectionId,
          optional: false,
        },
        blog: shopify.propDefinitions.blogId,
        article: shopify.propDefinitions.articleId,
        page: shopify.propDefinitions.pageId,
        order: shopify.propDefinitions.orderId,
        draftOrder: {
          type: "string",
          label: "Draft Order ID",
          description: "The identifier of a draft order",
        },
      };

      const props = {};

      if (ownerResource === "variants" || ownerResource === "product_image") {
        props.productId = resources.product;
      }
      if (ownerResource === "article") {
        props.blogId = resources.blog;
      }

      Object.values(resources).forEach((resource) => {
        delete resource.options;
      });
      Object.values(props).forEach((prop) => {
        delete prop.options;
      });

      return {
        ...props,
        ownerId: resources[ownerResource],
      };
    },
  },
};
