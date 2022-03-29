import hubspot from "../hubspot.app.js";

export default {
  props: {
    hubspot,
    propertyGroups: {
      type: "string[]",
      label: "Property Groups",
      description: "",
      reloadProps: true,
      async options() {
        const { results: groups } = await this.hubspot.getPropertyGroups(this.getObjectType());
        return groups.map((group) => ({
          label: group.label,
          value: group.name,
        }));
      },
    },
  },
  methods: {
    getObjectType() {
      throw new Error("getObjectType is not implemented");
    },
  },
  async additionalProps() {
    const { results: properties } = await this.hubspot.getProperties(this.getObjectType());
    return properties
      .filter((p) =>
        !p.modificationMetadata?.readOnlyValue
        && !p.hidden
        && this.propertyGroups?.includes(p.groupName)
        && !p.label.includes("(legacy)")
        && (!p.options || p.options.length <= 500))
      .map((p) => {
        let type = "string";
        if (p.fieldType === "checkbox") {
          type = "string[]";
        }
        let options = p.options?.length
          ? p.options?.filter((o) => !o.hidden)
            .map(({
              label, value,
            }) => ({
              label,
              value,
            }))
          : undefined;
        if (p.referencedObjectType) {
          options = this.hubspot.getOptionsMethod(p.referencedObjectType);
        }
        return {
          name: p.name,
          type,
          label: p.label,
          description: p.description,
          optional: true,
          options,
        };
      })
      .reduce((props, {
        name, ...definition
      }) => {
        props[name] = definition;
        return props;
      }, {});
  },
  async run({ $ }) {
    const {
      hubspot,
      /* eslint-disable no-unused-vars */
      propertyGroups,
      $db,
      ...properties
    } = this;
    const objectType = this.getObjectType();

    const response = await hubspot.createObject(objectType, properties);

    const objectName = this.hubspot.getObjectName(objectType);
    $.export("$summary", `Successfully fetched ${objectName}`);

    return response;
  },
};
