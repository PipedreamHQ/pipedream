import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../cleverreach.app.mjs";

export default {
  key: "cleverreach-new-receiver-subscribed",
  name: "New Receiver Subscribed",
  description: "Emit new event when a new subscriber is added to a selected group. [See the documentation](https://rest.cleverreach.com/explorer/v3/#!/groups-v3/list_groups_get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    groupId: {
      propDefinition: [
        app,
        "groupId",
      ],
      description: "The group (mailing list) to watch for new subscribers",
    },
  },
  methods: {
    getLastReceiverId() {
      return this.db.get("lastReceiverId");
    },
    setLastReceiverId(id) {
      this.db.set("lastReceiverId", id);
    },
    async getAndProcessData() {
      const { groupId } = this;
      const receivers = await this.app.listReceivers({
        groupId,
        params: {
          "order_by": "registered desc",
        },
      });

      let lastId, lastEmittedId = this.getLastReceiverId();

      for (const receiver of receivers) {
        const { id } = receiver;
        if (id === lastEmittedId) break;
        this.$emit(receiver, {
          id,
          summary: `New subscriber: ${receiver.email}`,
          ts: new Date((receiver.registered ?? receiver.activated) * 1000).valueOf(),
        });
        lastId = id;
      }

      if (lastId !== undefined) this.setLastReceiverId(lastId);
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData();
    },
  },
  async run() {
    await this.getAndProcessData();
  },
};
