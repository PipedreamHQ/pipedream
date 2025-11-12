import utils from "../../common/utils.mjs";
import common from "../common/polling.mjs";

export default {
  ...common,
  key: "codereadr-new-scan",
  name: "New Scan",
  description: "Emit new event when there is a new scan. [See the documentation](https://secure.codereadr.com/apidocs/Scans.md#retrieve)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    status: {
      propDefinition: [
        common.props.app,
        "status",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceName() {
      return "scan";
    },
    getResourceFn() {
      return this.app.listScans;
    },
    getResourceFnArgs() {
      const {
        getLastTimestamp,
        status,
      } = this;

      const lastTimestamp = getLastTimestamp();

      const args = {
        params: {
          status: utils.parseArray(status).join(","),
          order_by: "timestamp",
        },
      };

      if (!lastTimestamp) {
        return args;
      }

      return {
        params: {
          ...args.params,
          start_date: lastTimestamp.split(" ")[0],
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Scan: ${resource.id}`,
        ts: Date.parse(resource.timestamp),
      };
    },
  },
};
