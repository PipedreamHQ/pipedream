import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "satuit-new-opportunity",
  name: "New Opportunity",
  description: "Emit new event when a new opportunity is created in Satuit. [See the documentation](https://satuittechnologies.zendesk.com/hc/en-us/articles/360055725213-Satuit-REST-API-Postman-Documentation)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldId() {
      return "pproduct.iprodkey";
    },
    getResourceName() {
      return "Result";
    },
    getResourcesFn() {
      return this.app.getOpportunity;
    },
    getResourcesFnArgs() {
      return {
        params: {
          pagesize: constants.DEFAULT_LIMIT,
          orderby: encodeURIComponent(
            JSON.stringify({
              [this.getFieldId()]: "desc",
            }),
          ),
        },
      };
    },
    generateMeta(resource) {
      const {
        [this.getFieldId()]: id,
        ["pproduct.dcreated"]: createdAt,
      } = resource;
      return {
        id,
        summary: `New Opportunity: ${id}`,
        ts: Date.parse(createdAt),
      };
    },
  },
};
