import shopify from "../../shopify.app.mjs";
import common from "../common/metaobjects.mjs";
import { MAX_LIMIT } from "../../common/constants.mjs";

export default {
  ...common,
  key: "shopify-create-metaobject",
  name: "Create Metaobject",
  description: "Creates a metaobject. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metaobjectCreate)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shopify,
    type: {
      propDefinition: [
        shopify,
        "metaobjectType",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.type) {
      return props;
    }
    const { metaobjectDefinitions: { nodes } } = await this.shopify.listMetaobjectDefinitions({
      first: MAX_LIMIT,
    });
    const { fieldDefinitions } = nodes.find(({ id }) => id === this.type);
    for (const def of fieldDefinitions) {
      props[def.key] = {
        type: "string",
        label: def.name,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const { metaobjectDefinitions: { nodes } } = await this.shopify.listMetaobjectDefinitions({
      first: MAX_LIMIT,
    });
    const {
      fieldDefinitions, type,
    } = nodes.find(({ id }) => id === this.type);

    const fields = [];
    for (const def of fieldDefinitions) {
      if (this[def.key]) {
        fields.push({
          key: def.key,
          value: this[def.key],
        });
      }
    }

    const response = await this.createMetaobject({
      type,
      fields,
    });

    if (response.metaobjectCreate.userErrors.length > 0) {
      throw new Error(response.metaobjectCreate.userErrors[0].message);
    }

    if (response?.metaobjectCreate?.metaobject?.id) {
      $.export("$summary", `Successfully created metaobject with ID ${response.metaobjectCreate.metaobject.id}`);
    }

    return response;
  },
};
