import common from "../common/metaobjects.mjs";
import consts from "../common/consts.mjs";

export default {
  ...common,
  key: "shopify-update-metaobject",
  name: "Update Metaobject",
  description: "Updates a metaobject. [See the documentation](https://shopify.dev/docs/api/admin-graphql/2023-04/mutations/metaobjectUpdate)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    metaobject: {
      type: "string",
      label: "Metaobject",
      description: "The metaobject to update",
      async options() {
        if (!this.type) {
          return [];
        }
        const { data: { metaobjects: { nodes } } } = await this.listMetaobjects({
          type: this.type,
        });
        return nodes?.map(({
          id, displayName,
        }) => ({
          label: displayName,
          value: id,
        })) || [];
      },
      reloadProps: true,
    },
  },
  async additionalProps() {
    let props = {};
    if (!this.metaobject) {
      return props;
    }
    const { data: { metaobject: { fields } } } = await this.getMetaobject({
      id: this.metaobject,
    });
    for (const field of fields) {
      props[field.key] = {
        type: consts.METAFIELD_TYPES[field.type],
        label: field.definition.name,
        default: field.value,
      };
    }
    return props;
  },
  async run({ $ }) {
    const { data: { metaobject: { fields } } } = await this.getMetaobject({
      id: this.metaobject,
    });

    const newFields = [];
    for (const field of fields) {
      newFields.push({
        key: field.key,
        value: this[field.key],
      });
    }

    const response = await this.updateMetaobject({
      id: this.metaobject,
      fields: newFields,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated metaobject with ID ${this.metaobject}`);
    }

    return response;
  },
};
