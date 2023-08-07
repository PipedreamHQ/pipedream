import consts from "../common/consts.mjs";

export default {
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
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const { data: { metaobjectDefinitions: { nodes } } } = await this.listMetaobjectDefinitions();
    const { fieldDefinitions } = nodes.find(({ type }) => type === this.type);

    const fields = [];
    for (const def of fieldDefinitions) {
      if (this[def.key]) {
        fields.push({
          key: def.key,
          value: typeof this[def.key] === "string"
            ? this[def.key]
            : JSON.stringify(this[def.key]),
        });
      }
    }

    const response = await this.createMetaobject({
      type: this.type,
      fields,
      $,
    });

    let errorMessage;
    if (response?.errors?.length) {
      errorMessage = response.errors[0].message;
    }
    if (response?.data?.metaobjectCreate?.userErrors?.length) {
      errorMessage = response.data.metaobjectCreate.userErrors[0].message;
    }
    if (errorMessage) {
      throw new Error(`${errorMessage}`);
    }

    if (response?.data?.metaobjectCreate?.metaobject?.id) {
      $.export("$summary", `Successfully created metaobject with ID ${response.data.metaobjectCreate.metaobject.id}`);
    }

    return response;
  },
};
