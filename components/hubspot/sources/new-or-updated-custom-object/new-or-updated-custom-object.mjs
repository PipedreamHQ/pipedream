import { DEFAULT_LIMIT } from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-or-updated-custom-object",
  name: "New or Updated Custom Object",
  description: "Emit new event each time a Custom Object of the specified schema is updated.",
  version: "0.0.23",
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
  },
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
      return {
        data: {
          limit: DEFAULT_LIMIT,
          sorts: [
            {
              propertyName: "hs_lastmodifieddate",
              direction: "DESCENDING",
            },
          ],
        },
        object,
      };
    },
    async processResults(after) {
      const params = this.getObjectParams(this.objectSchema);
      await this.searchCRM(params, after);
    },
  },
  sampleEmit,
};
