import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../simla_com.app.mjs";
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
    isDescendingOrder() {
      return true;
    },
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
    sortFn() {
      return;
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
      isDescendingOrder,
    } = this;

    const isFirstRun = getIsFirstRun();
    const dateField = getDateField();
    const lastDateAt = getLastDateAt();
    const isDescending = isDescendingOrder();

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

    const orderedResources = isDescending
      ? resources
      : Array.from(resources).reverse();
    orderedResources.forEach(processResource);

    if (resources.length) {
      const latestResource = orderedResources[0];
      if (latestResource) {
        setLastDateAt(latestResource[dateField]);
      }
    }

    if (isFirstRun) {
      setIsFirstRun(false);
    }
  },
};
