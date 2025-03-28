import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../homerun.app.mjs";
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
    setLastDateAt(value) {
      this.db.set(constants.LAST_DATE_AT, value);
    },
    getLastDateAt() {
      return this.db.get(constants.LAST_DATE_AT);
    },
    getDateField() {
      throw new ConfigurationError("getDateField is not implemented");
    },
    isResourceRelevant() {
      return true;
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
      const {
        isResourceRelevant,
        processResource,
      } = this;

      return Array.from(resources)
        .filter(isResourceRelevant)
        .forEach(processResource);
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
      setLastDateAt,
    } = this;

    const dateField = getDateField();
    const lastDateAt = getLastDateAt();

    const resources = await app.paginate({
      resourcesFn: getResourcesFn(),
      resourcesFnArgs: getResourcesFnArgs(),
      resourceName: getResourceName(),
      dateField,
      lastDateAt,
    });

    if (resources.length) {
      const [
        firstResource,
      ] = Array.from(resources).reverse();
      if (firstResource) {
        setLastDateAt(firstResource[dateField]);
      }
    }

    processResources(resources);
  },
};
