import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import aweberApp from "../aweber.app.mjs";
import constants from "../common/constants.mjs";
import utils from "../common/utils.mjs";

export default {
  props: {
    aweberApp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the AWeber API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    accountId: {
      propDefinition: [
        aweberApp,
        "accountId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const resourcesStream = await this.aweberApp.getResourcesStream({
        resourceFn: this.getResourceFn(),
        resourceFnArgs: this.getResourceFnArgs(),
        max: constants.PAGINATION.MAX,
      });

      await this.processStreamEvents(resourcesStream);
    },
  },
  methods: {
    setLastResourceStr(resource) {
      this.db.set(constants.LAST_RESOURCE_STR, JSON.stringify(resource));
    },
    getLastResourceStr() {
      return this.db.get(constants.LAST_RESOURCE_STR);
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getResourceFnArgs() {
      throw new Error("getResourceFnArgs is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    async processStreamEvents(resourcesStream) {
      const resources = await utils.streamIterator(resourcesStream);

      if (resources.length === 0) {
        console.log("No new events detected. Skipping...");
        return;
      }

      resources.reverse().forEach(this.processEvent);

      const lastResource = resources.pop();
      this.setLastResourceStr(lastResource);
    },
    generateMeta(resource) {
      return {
        id: resource.id || resource.uuid,
        summary: this.getSummary(resource),
        ts: Date.parse(resource.subscribed_at ?? new Date()),
      };
    },
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
  },
  async run({ $ }) {
    const lastResourceStr = this.getLastResourceStr();

    const resourcesStream = await this.aweberApp.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs({
        $,
      }),
      lastResourceStr,
    });

    await this.processStreamEvents(resourcesStream);
  },
};
