import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Company Created",
  key: "roll-new-company",
  description: "Emit new event when a company is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Spondyr API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    ...common.methods,
    getFieldId() {
      return "CompanyId";
    },
    getFieldResponse() {
      return "company";
    },
    getFn() {
      return this.roll.listCompanies;
    },
    getDataToEmit({ CompanyId }) {
      return {
        id: CompanyId,
        summary: `New company with CompanyId ${CompanyId} was successfully created!`,
        ts: new Date().getTime(),
      };
    },
  },
};

