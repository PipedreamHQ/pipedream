import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../satuit.app.mjs";
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
    setLastId(value) {
      this.db.set(constants.LAST_ID, value);
    },
    getLastId() {
      return this.db.get(constants.LAST_ID);
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getFieldId() {
      throw new ConfigurationError("getFieldId is not implemented");
    },
    getResourceName() {
      throw new ConfigurationError("getResourceName is not implemented");
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
      if (resources.length) {
        const [
          lastResource,
        ] = resources;
        this.setLastId(lastResource[this.getFieldId()]);
      }

      Array.from(resources)
        .reverse()
        .forEach(this.processResource);
    },
  },
  async run() {
    const {
      app,
      getResourcesFn,
      getResourcesFnArgs,
      getResourceName,
      processResources,
      getFieldId,
      getLastId,
    } = this;

    const resources = await app.paginate({
      resourcesFn: getResourcesFn(),
      resourcesFnArgs: getResourcesFnArgs(),
      resourceName: getResourceName(),
      fieldId: getFieldId(),
      lastId: getLastId(),
    });

    processResources(resources);
  },
};
