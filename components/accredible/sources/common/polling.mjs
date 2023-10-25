import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import common from "./base.mjs";

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
    setLastDate() {
      throw new ConfigurationError("setLastDate is not implemented");
    },
    getLastDate() {
      throw new ConfigurationError("getLastDate is not implemented");
    },
    getDateFormatted(dateStr, yearsAgo = 0) {
      const date = dateStr && new Date(dateStr) || new Date();
      const year = date.getFullYear() - yearsAgo;
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month}-${day}`;
    },
    sortFn(a, b) {
      // Sort by created_at in ascending order by default to then call reverse()
      return new Date(a.created_at) - new Date(b.created_at);
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
    async processResources(resources) {
      const {
        sortFn,
        processEvent,
      } = this;

      const sortedResources = Array.from(resources).sort(sortFn);

      const [
        lastResource,
      ] = Array.from(sortedResources).reverse();

      this.setLastDate(lastResource);

      return sortedResources.forEach(processEvent);
    },
  },
  async run() {
    const {
      app,
      getResourceFn,
      getResourceFnArgs,
      getResourceName,
      processResources,
    } = this;

    const resources = await app.paginate({
      resourceFn: getResourceFn(),
      resourceFnArgs: getResourceFnArgs(),
      resourceName: getResourceName(),
    });

    processResources(resources);
  },
};
