import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-or-updated-crm-object",
  name: "New or Updated CRM Object",
  description: "Emit new event each time a CRM Object of the specified object type is updated.",
  version: "0.0.12",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    objectType: {
      propDefinition: [
        common.props.hubspot,
        "objectType",
      ],
    },
  },
  hooks: {},
  methods: {
    ...common.methods,
    getTs(object) {
      return Date.parse(object.updatedAt);
    },
    generateMeta(object) {
      const { id } = object;
      const ts = this.getTs(object);
      return {
        id: `${id}${ts}`,
        summary: `Record ID: ${id}`,
        ts,
      };
    },
    isRelevant(object, updatedAfter) {
      return this.getTs(object) > updatedAfter;
    },
    getParams() {
      return null;
    },
    getObjectParams(object) {
      const propertyName = (object == "contacts")
        ? "lastmodifieddate"
        : "hs_lastmodifieddate";
      return {
        limit: 100,
        sorts: [
          {
            propertyName,
            direction: "DESCENDING",
          },
        ],
        object,
      };
    },
    async processResults(after) {
      const object = (this.objectType == "company")
        ? "companies"
        : `${this.objectType}s`;
      const params = this.getObjectParams(object);
      await this.searchCRM(params, after);
    },
  },
};
