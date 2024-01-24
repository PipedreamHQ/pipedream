import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../decision_journal.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getResourcesFn() {
      throw new ConfigurationError("getResourcesFn is not implemented");
    },
    getResourcesFnArgs() {
      return {
        params: {
          limit: constants.DEFAULT_LIMIT,
        },
      };
    },
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    processResources(resources) {
      const { processEvent } = this;

      Array.from(resources)
        .reverse()
        .forEach(processEvent);
    },
  },
  async run() {
    const {
      getResourcesFn,
      getResourcesFnArgs,
      processResources,
    } = this;

    const resourcesFn = getResourcesFn();
    const resources = await resourcesFn(getResourcesFnArgs());

    processResources(resources);
  },
};
