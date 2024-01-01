import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../zamzar.app.mjs";
import constants from "../../common/constants.mjs";

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
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    setCursor(value) {
      this.db.set(constants.CURSOR, value);
    },
    getCursor() {
      return this.db.get(constants.CURSOR);
    },
    isResourceRelevant() {
      return true;
    },
    getListResourcesFn() {
      throw new ConfigurationError("getListResourcesFn is not implemented");
    },
    getListResourcesFnArgs() {
      return;
    },
    processLastResource() {
      throw new ConfigurationError("processLastResource is not implemented");
    },
    processResource(resource) {
      const {
        generateMeta,
        $emit: emit,
      } = this;

      emit(resource, generateMeta(resource));
    },
    processResources(resources) {
      const {
        processResource,
        processLastResource,
      } = this;

      const [
        lastResource,
      ] = resources;

      if (lastResource) {
        processLastResource(lastResource);
      }

      Array.from(resources)
        .reverse()
        .forEach(processResource);
    },
  },
  async run() {
    const {
      app,
      getListResourcesFn,
      getListResourcesFnArgs,
      processResources,
      isResourceRelevant,
    } = this;

    const resources = await app.paginate({
      listResourcesFn: getListResourcesFn(),
      listResourcesFnArgs: getListResourcesFnArgs(),
      resourcesFilter: isResourceRelevant,
    });

    processResources(resources);
  },
};
