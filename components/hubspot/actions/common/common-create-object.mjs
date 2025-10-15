import common from "./common-create.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    hubspot,
    // Re-defining propertyGroups so this.getObjectType() can be called from async options
    // eslint-disable-next-line pipedream/props-description
    propertyGroups: {
      type: "string[]",
      label: "Property Groups",
      hidden: true,
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
    objectProperties: {
      type: "object",
      label: "Object Properties",
      description: "Enter the object properties to create as a JSON object",
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
    createObject(opts = {}) {
      return this.hubspot.createObject(opts);
    },
  },
  async run({ $ }) {
    const {
      hubspot,
      /* eslint-disable no-unused-vars */
      propertyGroups,
      customObjectType,
      contactId,
      $db,
      updateIfExists,
      objectProperties,
      ...otherProperties
    } = this;
    const objectType = this.getObjectType();

    const properties = objectProperties
      ? typeof objectProperties === "string"
        ? JSON.parse(objectProperties)
        : objectProperties
      : otherProperties;

    // checkbox (string[]) props must be semicolon separated strings
    Object.keys(properties)
      .forEach((key) => {
        let value = properties[key];
        if (Array.isArray(value)) {
          properties[key] = value.join(";");
        }
      });
    try {
      const response = await this.createObject({
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
