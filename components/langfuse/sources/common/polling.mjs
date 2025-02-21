import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../langfuse.app.mjs";
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
    deploy() {
      this.setIsFirstRun(true);
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    setIsFirstRun(value) {
      this.db.set(constants.IS_FIRST_RUN, value);
    },
    getIsFirstRun() {
      return this.db.get(constants.IS_FIRST_RUN);
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
  },
  async run() {
    const {
      app,
      getDateField,
      getLastDateAt,
      getResourcesFn,
      getResourcesFnArgs,
      getResourceName,
      processResource,
      getIsFirstRun,
      setIsFirstRun,
      setLastDateAt,
    } = this;

    const isFirstRun = getIsFirstRun();
    const dateField = getDateField();
    const lastDateAt = getLastDateAt();

    const otherArgs = isFirstRun
      ? {
        max: constants.DEFAULT_LIMIT,
      }
      : {
        dateField,
        lastDateAt,
      };

    const resources = await app.paginate({
      resourcesFn: getResourcesFn(),
      resourcesFnArgs: getResourcesFnArgs(),
      resourceName: getResourceName(),
      ...otherArgs,
    });

    if (resources.length) {
      const [
        firstResource,
      ] = Array.from(resources);
      if (firstResource) {
        setLastDateAt(firstResource[dateField]);
      }
    }

    Array.from(resources)
      .forEach(processResource);

    if (isFirstRun) {
      setIsFirstRun(false);
    }
  },
};
