import { DEFAULT_LIMIT } from "../../common/constants.mjs";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-custom-object-property-change",
  name: "New Custom Object Property Change",
  description:
    "Emit new event when a specified property is provided or updated on a custom object.",
  version: "0.0.16",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    objectSchema: {
      propDefinition: [
        common.props.hubspot,
        "objectSchema",
      ],
    },
    property: {
      type: "string",
      label: "Property",
      description: "The custom object property to watch for changes",
      async options() {
        const properties = await this.getWriteOnlyProperties(this.objectSchema);
        return properties.map((property) => property.name);
      },
    },
  },
  methods: {
    ...common.methods,
    getTs(object) {
      const history = object.propertiesWithHistory[this.property];
      if (!history || !(history.length > 0)) {
        return;
      }
      return Date.parse(history[0].timestamp);
    },
    generateMeta(object) {
      const {
        id, properties,
      } = object;
      const ts = this.getTs(object);
      return {
        id: `${id}${ts}`,
        summary: properties[this.property],
        ts,
      };
    },
    isRelevant(object, updatedAfter) {
      return !updatedAfter || this.getTs(object) > updatedAfter;
    },
    getParams(after) {
      return {
        object: this.objectSchema,
        data: {
          limit: DEFAULT_LIMIT,
          properties: [
            this.property,
          ],
          sorts: [
            {
              propertyName: "hs_lastmodifieddate",
              direction: "DESCENDING",
            },
          ],
          filterGroups: [
            {
              filters: [
                {
                  propertyName: this.property,
                  operator: "HAS_PROPERTY",
                },
                {
                  propertyName: "hs_lastmodifieddate",
                  operator: "GTE",
                  value: after,
                },
              ],
            },
          ],
        },
      };
    },
    batchGetCustomObjects(inputs) {
      return this.hubspot.batchGetObjects({
        objectType: this.objectSchema,
        data: {
          properties: [
            this.property,
          ],
          propertiesWithHistory: [
            this.property,
          ],
          inputs,
        },
      });
    },
    async processResults(after, params) {
      const properties = await this.getWriteOnlyProperties(this.objectSchema);
      const propertyNames = properties.map((property) => property.name);

      if (!propertyNames.includes(this.property)) {
        throw new Error(
          `Property "${this.property}" not supported for custom object ${this.objectSchema}.`,
        );
      }

      const updatedObjects = await this.getPaginatedItems(
        this.hubspot.searchCRM,
        params,
      );

      if (!updatedObjects.length) {
        return;
      }

      const results = await this.processChunks({
        batchRequestFn: this.batchGetCustomObjects,
        chunks: this.getChunks(updatedObjects),
      });

      this.processEvents(results, after);
    },
  },
};
