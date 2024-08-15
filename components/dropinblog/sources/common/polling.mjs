import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../dropinblog.app.mjs";
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
  hooks: {
    async deploy() {
      const {
        app,
        setLastDateAt,
        getDateField,
        getResourcesFn,
        getResourcesFnArgs,
        getResourceName,
        processResources,
      } = this;

      const dateField = getDateField();

      const resources = await app.paginate({
        max: constants.DEFAULT_LIMIT,
        resourcesFn: getResourcesFn(),
        resourcesFnArgs: getResourcesFnArgs(),
        resourceName: getResourceName(),
        dateField,
      });

      if (resources.length) {
        const [
          firstResource,
        ] = Array.from(resources).reverse();
        setLastDateAt(firstResource[dateField]);
      }

      processResources(resources);
    },
  },
  methods: {
    setLastDateAt(value) {
      this.db.set(constants.LAST_DATE_AT, value);
    },
    getLastDateAt() {
      return this.db.get(constants.LAST_DATE_AT);
    },
    getDateField() {
      throw new ConfigurationError("getDateField is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
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
    processResources(resources) {
      Array.from(resources)
        .forEach(this.processResource);
    },
  },
  async run() {
    const {
      app,
      getDateField,
      getLastDateAt,
      getResourcesFn,
      getResourcesFnArgs,
      getResourceName,
      processResources,
    } = this;

    const resources = await app.paginate({
      resourcesFn: getResourcesFn(),
      resourcesFnArgs: getResourcesFnArgs(),
      resourceName: getResourceName(),
      dateField: getDateField(),
      lastDateAt: getLastDateAt(),
    });

    processResources(resources);
  },
};
