import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import modeck from "../../modeck.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "modeck-render-complete",
  name: "New Render Completed",
  version: "0.0.1",
  description: "Emit new event when a render is completed.",
  type: "source",
  dedupe: "unique",
  props: {
    modeck,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the MoDeck on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    deck: {
      propDefinition: [
        modeck,
        "deck",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults = 0) {
      const {
        modeck,
        deck,
      } = this;

      const lastDate = this._getLastDate();

      const { renderList } = await modeck.listRenders({
        data: {
          deck,
        },
      });

      let responseArray = [];
      let count = 0;

      for (const render of renderList) {
        if (new Date(render.data) <= new Date(lastDate)) break;
        responseArray.push(render);
        if (maxResults && (++count === maxResults)) break;
      }
      if (responseArray.length) this._setLastDate(responseArray[0].date);

      for (const render of responseArray.reverse()) {
        this.$emit(
          render,
          {
            id: render.id,
            summary: `The render with id: "${render.id}" has been completed!`,
            ts: render.date,
          },
        );
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
