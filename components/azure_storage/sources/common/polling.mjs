import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../azure_storage.app.mjs";

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
    isResourceRelevant() {
      return true;
    },
    getResourcesFn() {
      throw new ConfigurationError("getResourcesFn is not implemented");
    },
    getResourcesFnArgs() {
      throw new ConfigurationError("getResourcesFnArgs is not implemented");
    },
    getResourcesFromResponse() {
      throw new ConfigurationError("getResourcesFromResponse is not implemented");
    },
    processResource(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
  },
  async run() {
    const {
      getResourcesFn,
      getResourcesFnArgs,
      getResourcesFromResponse,
      isResourceRelevant,
      processResource,
    } = this;

    const resourcesFn = getResourcesFn();
    const response = await resourcesFn(getResourcesFnArgs());
    const resources = getResourcesFromResponse(response);

    Array.from(resources)
      .filter(isResourceRelevant)
      .forEach(processResource);
  },
};
