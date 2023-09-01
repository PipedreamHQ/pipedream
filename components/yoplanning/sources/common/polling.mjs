import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import common from "./base.mjs";
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
    setLastCreationDate(value) {
      this.db.set(constants.LAST_CREATION_DATE, value);
    },
    getLastCreationDate() {
      return this.db.get(constants.LAST_CREATION_DATE);
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    getResourceFnArgs() {
      throw new ConfigurationError("getResourceFnArgs is not implemented");
    },
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    async processResources(resources) {
      const [
        lastResource,
      ] = resources;

      if (lastResource?.creation_date) {
        this.setLastCreationDate(lastResource.creation_date);
      }

      Array.from(resources)
        .reverse()
        .forEach(this.processEvent);
    },
  },
  async run() {
    const resources = await this.app.paginate({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
      resourceName: "results",
    });

    this.processResources(resources);
  },
};
