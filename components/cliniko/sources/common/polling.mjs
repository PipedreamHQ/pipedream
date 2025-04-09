import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../cliniko.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Schedule",
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
    getResourceName() {
      throw new ConfigurationError("getResourceName is not implemented");
    },
    getResourcesFn() {
      throw new ConfigurationError("getResourcesFn is not implemented");
    },
    getSort() {
      return "created_at:desc";
    },
    getResourcesFnArgs() {
      return {
        debug: true,
        params: {
          per_page: constants.DEFAULT_LIMIT,
          sort: this.getSort(),
        },
      };
    },
    processResource(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    processResources(resources) {
      Array.from(resources)
        .reverse()
        .forEach(this.processResource);
    },
  },
  async run() {
    const {
      getResourcesFn,
      getResourcesFnArgs,
      getResourceName,
      processResources,
    } = this;
    const resourcesFn = getResourcesFn();

    const { [getResourceName()]: resources } =
      await resourcesFn(getResourcesFnArgs());

    processResources(resources);
  },
};
