import littleGreenLight from "../../little_green_light.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "little_green_light-new-gift-recorded",
  name: "New Gift Recorded",
  description: "Emits an event for each new gift recorded in Little Green Light. [See the documentation]()",
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
    constituentId: {
      propDefinition: [
        littleGreenLight,
        "constituentId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch gifts once on deploy, but do not emit events to avoid duplicates
      await this.fetchGifts(true);
    },
  },
  methods: {
    async fetchGifts(isDeploy = false) {
      const lastGiftId = this.db.get("lastGiftId") || 0;
      let maxGiftId = lastGiftId;

      const gifts = await this.littleGreenLight.fetchGifts({
        constituentId: this.constituentId,
      });
      for (const gift of gifts) {
        if (gift.id > lastGiftId) {
          if (!isDeploy) { // Avoid emitting during deploy
            this.$emit(gift, {
              id: gift.id.toString(),
              summary: `New Gift: $${gift.received_amount} from ${gift.tributee_name || "Anonymous"}`,
              ts: new Date(gift.received_date).getTime(),
            });
          }
          if (gift.id > maxGiftId) {
            maxGiftId = gift.id;
          }
        }
      }

      this.db.set("lastGiftId", maxGiftId);
    },
  },
  async run() {
    await this.fetchGifts();
  },
};
