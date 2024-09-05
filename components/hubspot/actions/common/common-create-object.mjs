import common from "./common-create.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    // Re-defining propertyGroups so this.getObjectType() can be called from async options
    // eslint-disable-next-line pipedream/props-description
    propertyGroups: {
      type: "string[]",
      label: "Property Groups",
      reloadProps: true,
      async options() {
        const { results: groups } = await this.hubspot.getPropertyGroups({
          objectType: this.getObjectType(),
        });
        return groups.map((group) => ({
          label: group.label,
          value: group.name,
        }));
      },
    },
  },
  methods: {
    ...common.methods,
    isRelevantProperty(property) {
      const isInPropertyGroups = this.propertyGroups?.includes(property.groupName);
      const isDefaultProperty = this.isDefaultProperty(property);
      return common.methods.isRelevantProperty(property)
        && isInPropertyGroups
        && !isDefaultProperty;
    },
    isDefaultProperty() {
      return false;
    },
  },
  async run({ $ }) {
    const {
      hubspot,
      /* eslint-disable no-unused-vars */
      propertyGroups,
      $db,
      updateIfExists,
      ...properties
    } = this;
    const objectType = this.getObjectType();

    // checkbox (string[]) props must be semicolon separated strings
    Object.keys(properties)
      .forEach((key) => {
        let value = properties[key];
        if (Array.isArray(value)) {
          properties[key] = value.join(";");
        }
      });
    try {
      const response = await hubspot.createObject({
        $,
        objectType,
        data: {
          properties,
        },
      });
      const objectName = hubspot.getObjectTypeName(objectType);
      $.export("$summary", `Successfully created ${objectName}`);

      return response;
    } catch (err) {
      if (updateIfExists && err?.message) {
        const errorObj = JSON.parse(err?.message);
        if (errorObj?.category === "CONFLICT" || errorObj?.category === "OBJECT_ALREADY_EXISTS") {
          const objectId = parseInt(errorObj.message.replace(/[^\d]/g, ""));
          const response = await hubspot.updateObject({
            $,
            objectType,
            objectId,
            data: {
              properties,
            },
          });
          const objectName = hubspot.getObjectTypeName(objectType);
          $.export("$summary", `Successfully updated ${objectName}`);
          return response;
        }
      }
      throw err;
    }
  },
};
