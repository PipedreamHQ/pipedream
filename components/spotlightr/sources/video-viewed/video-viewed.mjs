import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import spotlightr from "../../spotlightr.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "spotlightr-video-viewed",
  name: "New Video View",
  version: "0.0.1",
  description: "Emit new event when a specific video is viewed by a user.",
  type: "source",
  dedupe: "unique",
  props: {
    spotlightr,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Spotlightr on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    videoId: {
      propDefinition: [
        spotlightr,
        "videoId",
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
        spotlightr,
        videoId,
      } = this;

      const lastDate = this._getLastDate();
      const items = spotlightr.paginate({
        fn: spotlightr.getViews,
        maxResults,
        params: {
          videoID: videoId,
        },
      });

      let responseArray = [];

      for await (const item of items) {
        if (new Date(item.date) <= new Date(lastDate)) break;
        responseArray.push(item);
      }
      if (responseArray.length) this._setLastDate(responseArray[0].created_time);

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: `New view with id: "${item.id}" was created!`,
            ts: Date.parse(item.date),
          },
        );
      }
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
