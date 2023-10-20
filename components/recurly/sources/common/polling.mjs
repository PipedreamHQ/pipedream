import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../recurly.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Recurly API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    setLastCreatedAt(value) {
      this.db.set(constants.LAST_CREATED_AT, value);
    },
    getLastCreatedAt() {
      return this.db.get(constants.LAST_CREATED_AT);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    getResourcesFn() {
      throw new Error("getResourcesFn not implemented");
    },
    getResourcesFnArgs() {
      throw new Error("getResourcesFnArgs not implemented");
    },
    async processEvents() {
      console.log("Retrieving historical events...");

      const resourcesFn = this.getResourcesFn();
      const resourcesFnArgs = this.getResourcesFnArgs();
      const resources = await resourcesFn(resourcesFnArgs);

      const [
        lastResource,
      ] = resources;

      if (lastResource?.createdAt) {
        this.setLastCreatedAt(lastResource.createdAt);
      }

      resources
        .reverse()
        .forEach((resource) =>
          this.$emit(resource, this.generateMeta(resource)));
    },
  },
  async run() {
    await this.processEvents();
  },
};
