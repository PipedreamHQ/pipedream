import hubspot from "../hubspot.app.mjs";

export default {
  props: {
    hubspot,
    objectId: {
      type: "string",
      label: "Object ID",
      description: "Hubspot's internal ID for the object",
      async options(opts) {
        return this.hubspot.createOptions(this.getObjectType(), opts);
      },
    },
    // eslint-disable-next-line pipedream/props-description
    additionalProperties: {
      type: "string[]",
      label: "Additional properties to retrieve",
      optional: true,
      async options({ page }) {
        if (page !== 0) {
          return [];
        }
        const { results: properties } = await this.hubspot.getProperties(this.getObjectType());
        return properties.map((property) => ({
          label: property.label,
          value: property.name,
        }));
      },
    },
  },
  methods: {
    getObjectType() {
      throw new Error("getObjectType is not implemented");
    },
  },
  async run({ $ }) {
    const objectType = this.getObjectType();

    const object = await this.hubspot.getObject(
      objectType,
      this.objectId,
      this.additionalProperties,
      $,
    );

    const objectName = this.hubspot.getObjectTypeName(objectType);
    $.export("$summary", `Successfully fetched ${objectName}`);

    return object;
  },
};
