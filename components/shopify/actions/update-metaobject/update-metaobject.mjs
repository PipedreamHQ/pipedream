import shopify from "../../shopify.app.mjs";
import common from "../common/metaobjects.mjs";
import { MAX_LIMIT } from "../../common/constants.mjs";

export default {
  ...common,
  key: "shopify-update-metaobject",
  name: "Update Metaobject",
  description: "Updates a metaobject. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metaobjectUpdate)",
  version: "0.0.8",
  annotations: {
    destructiveHint: true,
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
    metaobject: {
      propDefinition: [
        shopify,
        "metaobjectId",
        (c) => ({
          type: c.type,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.type) {
      return props;
    }
    try {
      return await this.getMetaobjectFields(props);
    }
    catch {
      return await this.getTypeFields(props);
    }
  },
  methods: {
    ...common.methods,
    async getMetaobjectFields(props) {
      const { metaobject: { fields } } = await this.getMetaobject({
        id: this.metaobject,
      });
      for (const field of fields) {
        props[field.key] = {
          type: "string",
          label: field.definition.name,
          optional: true,
        };
        if (field.value) {
          props[field.key].default = field.value;
        }
      }
      return props;
    },
    async getTypeFields(props) {
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
  },
  async run({ $ }) {
    const { metaobject: { fields } } = await this.getMetaobject({
      id: this.metaobject,
    });

    const newFields = [];
    for (const field of fields) {
      newFields.push({
        key: field.key,
        value: this[field.key]
          ? this[field.key]
          : field.value || "",
      });
    }

    const response = await this.updateMetaobject({
      id: this.metaobject,
      fields: newFields,
    });

    if (response.metaobjectUpdate.userErrors.length > 0) {
      throw new Error(response.metaobjectUpdate.userErrors[0].message);
    }

    $.export("$summary", `Successfully updated metaobject with ID ${this.metaobject}`);
    return response;
  },
};
