import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../paved.app.mjs";
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
    slug: {
      propDefinition: [
        app,
        "slug",
      ],
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    setLastFromDate(value) {
      this.db.set(constants.LAST_FROM_DATE, value);
    },
    getLastFromDate() {
      return this.db.get(constants.LAST_FROM_DATE);
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
        setLastFromDate,
        processResource,
      } = this;

      const [
        lastResource,
      ] = Array.from(resources).reverse();

      if (lastResource?.run_date) {
        setLastFromDate(lastResource.run_date);
      }

      Array.from(resources)
        .forEach(processResource);
    },
  },
  async run() {
    const {
      app,
      getResourcesFn,
      getResourcesFnArgs,
      processResources,
    } = this;

    const resources = await app.paginate({
      resourcesFn: getResourcesFn(),
      resourcesFnArgs: getResourcesFnArgs(),
      fromDate: this.getLastFromDate(),
    });

    processResources(resources);
  },
};
