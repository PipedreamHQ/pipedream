import common from "../common/metaobjects.mjs";
import consts from "../common/consts.mjs";

export default {
  ...common,
  key: "shopify-create-metaobject",
  name: "Create Metaobject",
  description: "Creates a metaobject. [See the documentation](https://shopify.dev/docs/api/admin-graphql/2023-04/mutations/metaobjectCreate)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    type: {
      ...common.props.type,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.type) {
      return props;
    }
    const { data: { metaobjectDefinitions: { nodes } } } = await this.listMetaobjectDefinitions();
    const { fieldDefinitions } = nodes.find(({ type }) => type === this.type);
    for (const def of fieldDefinitions) {
      props[def.key] = {
        type: consts.METAFIELD_TYPES[def.type.name],
        label: def.name,
      };
    }
    return props;
  },
  async run({ $ }) {
    const { data: { metaobjectDefinitions: { nodes } } } = await this.listMetaobjectDefinitions();
    const { fieldDefinitions } = nodes.find(({ type }) => type === this.type);

    const fields = [];
    for (const def of fieldDefinitions) {
      fields.push({
        key: def.key,
        value: this[def.key],
      });
    }

    const response = await this.createMetaobject({
      type: this.type,
      fields,
      $,
    });

    if (response?.data?.metaobjectCreate?.metaobject?.id) {
      $.export("$summary", `Successfully created metaobject with ID ${response.data.metaobjectCreate.metaobject.id}`);
    }

    return response;
  },
};
