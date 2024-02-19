import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "little_green_light-new-gift-recorded",
  name: "New Gift Recorded",
  description: "Emit new event for each new gift recorded in Little Green Light.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getOpts(maxResults, lastData) {
      return {
        fn: this.getFn(),
        maxResults,
        params: {
          created_from: lastData,
        },
      };
    },
    getFn() {
      return this.littleGreenLight.searchGifts;
    },
    async prepareDate(data) {

      let responseArray = [];
      for await (const item of data) {
        responseArray.push(item);
      }

      responseArray = responseArray.sort(
        (a, b) => b.id - a.id,
      );
      if (responseArray.length) this._setLastData(responseArray[0].deposit_date);
      return responseArray;
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
  },
  sampleEmit,
};
