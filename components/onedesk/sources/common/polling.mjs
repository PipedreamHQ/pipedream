import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
  ConfigurationError,
} from "@pipedream/platform";
import app from "../../onedesk.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

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
  methods: {
    setLastCreationDate(value) {
      this.db.set(constants.LAST_CREATION_DATE, value);
    },
    getLastCreationDate() {
      return this.db.get(constants.LAST_CREATION_DATE);
    },
    getActivityTypeProperties() {
      throw new ConfigurationError("getActivityTypeProperties is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getResourceName() {
      return "data";
    },
    getResourcesFn() {
      return this.app.filterActivityDetails;
    },
    getResourcesFnArgs() {
      const lastCreationDate = this.getLastCreationDate();

      const creationDateFilter = lastCreationDate
        ? {
          property: "createdDate",
          operation: "GE",
          value: utils.getDateOnly(lastCreationDate),
        }
        : {
          property: "createdDate",
          operation: "LT",
          value: utils.getDateAfterToday(),
        };

      return {
        data: {
          properties: [
            creationDateFilter,
            ...this.getActivityTypeProperties(),
          ],
          isAsc: false,
        },
      };
    },
    processResource(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    async processResources(resources) {
      const {
        setLastCreationDate,
        processResource,
      } = this;

      const [
        lastResource,
      ] = resources;

      if (lastResource?.timestamp) {
        setLastCreationDate(lastResource.timestamp);
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
      getResourceName,
      processResources,
    } = this;

    const resources = await app.paginate({
      resourcesFn: getResourcesFn(),
      resourcesFnArgs: getResourcesFnArgs(),
      resourceName: getResourceName(),
    });

    processResources(resources);
  },
};
