import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../keycloak.app.mjs";
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
    realm: {
      propDefinition: [
        app,
        "realm",
      ],
    },
  },
  methods: {
    setLastDateFrom(value) {
      this.db.set(constants.LAST_DATE_FROM, value);
    },
    getLastDateFrom() {
      return this.db.get(constants.LAST_DATE_FROM);
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
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
      const {
        setLastDateFrom,
        processResource,
      } = this;

      const [
        lastResource,
      ] = resources;

      if (lastResource?.time) {
        const date = new Date(lastResource.time);
        setLastDateFrom(date.toISOString().split("T")[0]);
      }

      Array.from(resources)
        .reverse()
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
    });

    processResources(resources);
  },
};
