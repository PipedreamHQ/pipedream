import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import vivomeetings from "../../vivomeetings.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "vivomeetings-new-meeting",
  name: "New VivoMeeting or Webinar Created",
  description: "Emit new event when a new VivoMeeting or webinar is created. [See the documentation](https://vivomeetings.com/api-developer-guide/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    vivomeetings,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    hostId: {
      propDefinition: [
        vivomeetings,
        "hostId",
      ],
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();
      const response = await this.vivomeetings.listConferences({
        data: {
          host_id: this.hostId,
        },
      });

      const filteredArray = response.filter((item) => item.conference_id > lastId).reverse();
      if (filteredArray.length) {
        if (maxResults && (filteredArray.length > maxResults)) {
          filteredArray.length = maxResults;
        }
        this._setLastId(filteredArray[0].conference_id);
      }

      for (const item of filteredArray.reverse()) {
        this.$emit(item, {
          id: item.conference_id,
          summary: `New Meeting: ${item.subject}`,
          ts: Date.parse(new Date()),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
  sampleEmit,
};
