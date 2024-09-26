import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import common from "./base.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Plivo API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    ...common.methods,
    getResourcesFn() {
      throw new Error("getResourcesFn not implemented");
    },
    getResourcesFnArgs() {
      throw new Error("getResourcesFnArgs not implemented");
    },
    async processEvents() {
      console.log("Retrieving historical events...");
      const stream = this.app.getResourcesStream({
        resourcesFn: this.getResourcesFn(),
        resourcesFnArgs: this.getResourcesFnArgs(),
      });

      const resources = await utils.streamIterator(stream);

      const [
        lastResource,
      ] = resources;

      if (lastResource?.endTime) {
        const endTimeDate = new Date(Date.parse(lastResource.endTime));
        const lastEndTime = endTimeDate.toISOString().split(".")[0].replace("T", " ");
        this.setLastEndTime(lastEndTime);
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
