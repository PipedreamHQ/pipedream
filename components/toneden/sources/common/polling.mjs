import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../toneden.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    isResourceRelevant() {
      return true;
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
      Array.from(resources)
        .reverse()
        .filter(this.isResourceRelevant)
        .forEach(this.processEvent);
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
