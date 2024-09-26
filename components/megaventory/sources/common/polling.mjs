import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import common from "./base.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  props: {
    ...common.props,
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
    ...common.methods,
    setLastCreatedAt(value) {
      this.db.set(constants.LAST_CREATED_AT, value);
    },
    getLastCreatedAt() {
      return this.db.get(constants.LAST_CREATED_AT);
    },
    getResourceName() {
      throw new ConfigurationError("getResourceName is not implemented");
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    getResourceFnArgs() {
      const lastCreatedAt = this.getLastCreatedAt();
      if (!lastCreatedAt) {
        return;
      }
      return {
        data: {
          Filters: [
            {
              FieldName: this.getCreatedAtFieldName(),
              SearchOperator: "GreaterThan",
              SearchValue: this.timestampToDate(this.extractTimestamp(lastCreatedAt)),
            },
          ],
        },
      };
    },
    getCreatedAtFieldName() {
      throw new ConfigurationError("getCreatedAtFieldName is not implemented");
    },
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    async processStreamEvents(resourcesStream) {
      const resources = await utils.streamIterator(resourcesStream);

      const [
        lastResource = {},
      ] = resources;

      const lastCreatedAt = lastResource[this.getCreatedAtFieldName()];
      if (lastCreatedAt) {
        this.setLastCreatedAt(lastCreatedAt);
      }

      resources.reverse().forEach(this.processEvent);
    },
  },
  async run() {
    const resourcesStream = this.app.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
      resourceName: this.getResourceName(),
    });

    await this.processStreamEvents(resourcesStream);
  },
};
