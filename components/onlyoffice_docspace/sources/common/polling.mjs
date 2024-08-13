import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../onlyoffice_docspace.app.mjs";

export default {
  props: {
    app,
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
    sortFn() {
      return;
    },
    getResourcesName() {
      return;
    },
    getResourcesFn() {
      throw new ConfigurationError("getResourcesFn is not implemented");
    },
    getResourcesFnArgs() {
      throw new ConfigurationError("getResourcesFnArgs is not implemented");
    },
    processResource(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    async processResources(resources) {
      const {
        sortFn,
        processResource,
      } = this;

      Array.from(resources)
        .sort(sortFn)
        .forEach(processResource);
    },
  },
  async run() {
    const {
      getResourcesFn,
      getResourcesFnArgs,
      getResourcesName,
      processResources,
    } = this;

    const resourcesName = getResourcesName();
    const resourcesFn = getResourcesFn();
    const metadata = await resourcesFn(getResourcesFnArgs());

    let resources;

    if (resourcesName) {
      ({ response: { [resourcesName]: resources } } = metadata);
    } else {
      ({ response: resources } = metadata);
    }

    processResources(resources);
  },
};
