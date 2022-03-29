import hubspot from "../hubspot.app.js";

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
    additionalProperties: {
      type: "string[]",
      label: "Additional properties to retrieve",
      description: "",
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
      default: [],
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
    );

    const objectName = this.hubspot.getObjectName(objectType);
    $.export("$summary", `Successfully fetched ${objectName}`);

    return object;
  },
};
