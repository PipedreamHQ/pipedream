import common from "./common-create.mjs";

export default {
  ...common,
  props: {
    objectProperties: {
      type: "object",
      label: "Object Properties",
      description: "Enter the object properties to update as a JSON object. Example: {\"firstname\": \"Alice\", \"lastname\": \"Smith\"}. This will overwrite any properties entered individually.",
    },
  },
  methods: {
    ...common.methods,
  },
  async run({ $ }) {
    const {
      hubspot,
      objectId,
      objectProperties,
    } = this;
    const objectType = this.getObjectType();

    const properties = typeof objectProperties === "string"
      ? JSON.parse(objectProperties)
      : objectProperties;

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
