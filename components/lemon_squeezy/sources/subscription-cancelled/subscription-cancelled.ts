import { defineSource } from "@pipedream/types";
import moment from "moment";
import common from "../common/base";

export default defineSource({
  ...common,
  key: "lemon_squeezy-subscription-cancelled",
  name: "New Subscription Cancelled",
  description: "Emit new event when a new subscription is cancelled.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    setLastEnd(lastEnd: number): void {
      this.db.set("lastEnd", lastEnd);
    },
    getLastEnd(): number {
      return this.db.get("lastEnd") || 0;
    },
    async startEvent(maxResults: number): Promise<void> {
      const lastEnd = this.getLastEnd();
      const responseArray: Array<any> = [];
      let tempLastEnd = lastEnd;

      const items = this.lemonSqueezy.paginate({
        fn: this.lemonSqueezy.listSubscriptions,
        params: {
          sort: "-endsAt",
        },
        maxResults,
      });

      for await (const item of items) {
        const newLastEnd = item.attributes.ends_at;
        if (
          item.attributes.ends_at
          && moment(newLastEnd).isAfter(lastEnd)
          && item.attributes.cancelled
        ) {
          responseArray.push(item);
          if (moment(newLastEnd).isAfter(tempLastEnd)) {
            tempLastEnd = newLastEnd;
          }
        } else {
          break;
        }
      }

      if (!moment(lastEnd).isSame(tempLastEnd))
        this.setLastEnd(tempLastEnd);

      for (const responseItem of responseArray.reverse()) {
        this.$emit(
          responseItem,
          {
            id: responseItem.id,
            summary: `A new subscription with id ${responseItem.id} was cancelled!`,
            ts: responseItem.createdAt,
          },
        );
      }
    },
  },
});
