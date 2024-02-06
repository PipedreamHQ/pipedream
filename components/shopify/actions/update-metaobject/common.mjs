import consts from "../common/consts.mjs";

export default {
  props: {
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
    async getMetaobjectFields(props) {
      const { data: { metaobject: { fields } } } = await this.getMetaobject({
        id: this.metaobject,
      });
      for (const field of fields) {
        const type = consts.METAFIELD_TYPES[field.type];
        props[field.key] = {
          type,
          label: field.definition.name,
          optional: true,
        };
        if (field.value) {
          if (type === "integer") {
            props[field.key].default = parseInt(field.value);
          } else if (type === "boolean") {
            props[field.key].default = field.value === "true"
              ? true
              : false;
          } else if (type === "object" || type === "string[]") {
            props[field.key].default = JSON.parse(field.value);
          } else {
            props[field.key].default = field.value;
          }
        }
      }
      return props;
    },
    async getTypeFields(props) {
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
  },
  async run({ $ }) {
    const { data: { metaobject: { fields } } } = await this.getMetaobject({
      id: this.metaobject,
    });

    const newFields = [];
    for (const field of fields) {
      const fieldValue = this[field.key]
        ? this[field.key]
        : field.value || "";
      newFields.push({
        key: field.key,
        value: typeof fieldValue === "string"
          ? fieldValue
          : JSON.stringify(fieldValue),
      });
    }

    const response = await this.updateMetaobject({
      id: this.metaobject,
      fields: newFields,
      $,
    });

    let errorMessage;
    if (response?.errors?.length) {
      errorMessage = response.errors[0].message;
    }
    if (response?.data?.metaobjectUpdate?.userErrors?.length) {
      errorMessage = response.data.metaobjectUpdate.userErrors[0].message;
    }
    if (errorMessage) {
      throw new Error(`${errorMessage}`);
    }

    $.export("$summary", `Successfully updated metaobject with ID ${this.metaobject}`);
    return response;
  },
};
