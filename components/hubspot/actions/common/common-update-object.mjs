import common from "./common-create.mjs";

export default {
  ...common,
  props: {
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
      return common.methods.isRelevantProperty(property) && isInPropertyGroups;
    },
  },
  async run({ $ }) {
    const {
      hubspot,
      /* eslint-disable no-unused-vars */
      propertyGroups,
      $db,
      objectId,
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

    const response = await hubspot.updateObject({
      objectType,
      objectId,
      data: {
        properties,
      },
    });
    const objectName = hubspot.getObjectTypeName(objectType);

    $.export("$summary", `Successfully updated ${objectName}`);
    return response;
  },
};
