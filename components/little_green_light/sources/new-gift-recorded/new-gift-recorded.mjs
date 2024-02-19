import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import littleGreenLight from "../../little_green_light.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "little_green_light-new-gift-recorded",
  name: "New Gift Recorded",
  description: "Emit new event for each new gift recorded in Little Green Light.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    littleGreenLight,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async generateMeta(gift) {
      let constituentName = "Anonymous";
      if (gift.constituent_id) {
        const constituent = await this.littleGreenLight.getConstituent({
          constituentId: gift.constituent_id,
        });
        constituentName = `${constituent.first_name} ${constituent.last_name}`;
      }
      return {
        id: gift.id,
        summary: `New Gift: $${gift.received_amount} from ${constituentName}`,
        ts: Date.parse(gift.created_at),
      };
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();

      let data = this.littleGreenLight.paginate({
        fn: this.littleGreenLight.searchGifts,
        maxResults,
        params: {
          created_from: lastDate,
        },
      });

      let responseArray = [];
      for await (const item of data) {
        responseArray.push(item);
      }

      responseArray = responseArray.sort(
        (a, b) => b.id - a.id,
      );
      if (responseArray.length) this._setLastDate(responseArray[0].deposit_date);

      for (const item of responseArray.reverse()) {
        this.$emit(item, await this.generateMeta(item));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
