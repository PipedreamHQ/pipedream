import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import common from "./base.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  prop: {
    ...common.props,
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the ShipeEngine API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents();
    },
  },
  methods: {
    ...common.methods,
    async processEvents() {
      const resourcesFn = this.getResourcesFn();
      if (!resourcesFn) {
        return;
      }
      console.log("Retrieving historical events...");
      const stream = this.app.getResourcesStream({
        resourcesFn,
        resourcesFnArgs: this.getResourcesFnArgs(),
        resourcesName: this.getResourcesName(),
      });
      const resources = await utils.streamIterator(stream);

      const [
        lastResource,
      ] = resources;

      if (lastResource) {
        this.setLastCreatedAtStart(lastResource.created_at);
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
