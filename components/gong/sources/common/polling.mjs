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
    setLastCreatedAt(value) {
      this.db.set(constants.LAST_CREATED_AT, value);
    },
    getLastCreatedAt() {
      return this.db.get(constants.LAST_CREATED_AT);
    },
    getResourceName() {
      throw new ConfigurationError("getResourceName is not implemented");
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
    async processResources(resources, max) {
      let descendingResources = Array.from(resources).reverse();

      if (max) {
        descendingResources = descendingResources.slice(0, max);
      }

      const [
        lastResource,
      ] = descendingResources;

      if (lastResource?.started) {
        this.setLastCreatedAt(lastResource.started);
      }

      descendingResources.forEach(this.processEvent);
    },
  },
  hooks: {
    async deploy() {
      const resources = await this.app.paginate({
        resourceFn: this.getResourceFn(),
        resourceFnArgs: this.getResourceFnArgs(),
        resourceName: this.getResourceName(),
      });

      this.processResources(resources, 25);
    },
  },
  async run() {
    const resources = await this.app.paginate({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
      resourceName: this.getResourceName(),
    });

    this.processResources(resources);
  },
};
