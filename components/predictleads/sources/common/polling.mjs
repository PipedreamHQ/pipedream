import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../predictleads.app.mjs";

const IS_FIRST_RUN = "isFirstRun";
const LAST_PROCESSED_DATE = "lastProcessedDate";
const DEFAULT_DATE_FIELD = "first_seen_at";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      this.setIsFirstRun(true);
    },
  },
  methods: {
    getIsFirstRun() {
      return this.db.get(IS_FIRST_RUN) ?? true;
    },
    setIsFirstRun(value) {
      this.db.set(IS_FIRST_RUN, value);
    },
    getLastDate() {
      return this.db.get(LAST_PROCESSED_DATE);
    },
    setLastDate(value) {
      this.db.set(LAST_PROCESSED_DATE, value);
    },
    getDateField() {
      return DEFAULT_DATE_FIELD;
    },
    sortFn(a, b) {
      const dateField = this.getDateField();
      return new Date(b.attributes[dateField]) - new Date(a.attributes[dateField]);
    },
    generateMeta() {
      throw new ConfigurationError("The 'generateMeta' method must be implemented.");
    },
    getResourcesFn() {
      throw new ConfigurationError("The 'getResourcesFn' method must be implemented.");
    },
    getResourcesFnArgs() {
      return {};
    },
    processResources(resources = []) {
      resources.reverse().forEach((resource) => {
        this.$emit(resource, this.generateMeta(resource));
      });
    },
  },
  async run() {
    const {
      app,
      getResourcesFn,
      getResourcesFnArgs,
      getIsFirstRun,
      setIsFirstRun,
      processResources,
      getLastDate,
      setLastDate,
      getDateField,
      sortFn,
    } = this;

    const isFirstRun = getIsFirstRun();
    const lastDate = getLastDate();
    const dateField = getDateField();
    const fnArgs = getResourcesFnArgs();

    const resources = await app.paginate({
      resourceFn: getResourcesFn(),
      resourceFnArgs: {
        ...fnArgs,
        params: {
          ...fnArgs.params,
          ...(!isFirstRun &&
            lastDate && {
            [`${dateField}_from`]: lastDate,
          }),
        },
      },
      ...(isFirstRun && {
        max: 100,
      }),
    });

    if (resources?.length) {
      const sortedResources = Array.from(resources).sort(sortFn.bind(this));
      const [
        newestResource,
      ] = sortedResources;

      if (newestResource) {
        setLastDate(newestResource.attributes[dateField]);
      }
      processResources(sortedResources);
    }

    if (isFirstRun) {
      setIsFirstRun(false);
    }
  },
};
