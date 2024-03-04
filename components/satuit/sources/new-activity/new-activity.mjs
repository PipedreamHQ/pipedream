import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "satuit-new-activity",
  name: "New Activity",
  description: "Emit new event when a new activity is created in Satuit. [See the documentation](https://satuittechnologies.zendesk.com/hc/en-us/articles/360055725213-Satuit-REST-API-Postman-Documentation)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldId() {
      return "ptickler.icomkey";
    },
    getResourceName() {
      return "Result";
    },
    getResourcesFn() {
      return this.app.getActivity;
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
        ["ptickler.dcreated"]: createdAt,
      } = resource;
      return {
        id,
        summary: `New Activity: ${id}`,
        ts: Date.parse(createdAt),
      };
    },
  },
};
