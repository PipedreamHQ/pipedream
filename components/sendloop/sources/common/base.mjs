import sendloop from "../../sendloop.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    sendloop,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async getSubscriber(item) {
      const { Subscriber: subscriber } = await this.sendloop.getSubscriber({
        data: {
          ListID: item.ListID,
        },
      });
      return subscriber;
    },
    isRelevant() {
      return true;
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getResourceType() {
      throw new Error("getResourceType is not implemented");
    },
    getData() {
      throw new Error("getData is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const resourceFn = this.getResourceFn();
    const resourceType = this.getResourceType();
    const data = this.getData();

    const items = this.sendloop.paginate({
      resourceFn,
      resourceType,
      data,
    });

    for await (const item of items) {
      if (!this.isRelevant(item)) {
        return;
      }
      const subscriber = resourceType === "Subscribers" || !item?.ListID
        ? item
        : await this.getSubscriber(item);
      const meta = this.generateMeta(subscriber);
      this.$emit(subscriber, meta);
    }
  },
};
