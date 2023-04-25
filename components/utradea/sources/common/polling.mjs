import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import common from "./base.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  props: {
    ...common.props,
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
    ...common.methods,
    setLastEndTimestamp(value) {
      this.db.set(constants.LAST_END_TS, value);
    },
    getLastEndTimestamp() {
      return this.db.get(constants.LAST_END_TS);
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    getResourceFnArgs() {
      throw new ConfigurationError("getResourceFnArgs is not implemented");
    },
    compareFn() {
      return;
    },
    processLastResource() {
      return;
    },
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    async processStreamEvents(resourcesStream) {
      const resources = await utils.streamIterator(resourcesStream);

      const resourcesSorted = Array.from(resources).sort(this.compareFn);

      const [
        lastResource,
      ] = resourcesSorted;

      this.processLastResource(lastResource);

      resourcesSorted.reverse().forEach(this.processEvent);
    },
  },
  async run() {
    const resourcesStream = this.app.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
    });

    await this.processStreamEvents(resourcesStream);
  },
};
