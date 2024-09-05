import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import poper from "../../poper.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "poper-new-lead",
  name: "New Lead from Poper Popup",
  description: "Emit new event when a new lead is obtained from Poper popups.",
  version: "0.0.1",
  type: "source",
  props: {
    poper,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Poper API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    poperId: {
      propDefinition: [
        poper,
        "poperId",
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
    getParams() {
      return {};
    },
    async startEvent(maxResults = 0) {
      const lastId = this._getLastId();
      const { responses } = await this.poper.listPoperResponses({
        data: {
          popup_id: this.poperId,
        },
      });

      const filteredResponse = responses.filter((item) => item.id > lastId);

      if (filteredResponse.length) {
        if (maxResults && filteredResponse.length > maxResults) {
          filteredResponse.length = maxResults;
        }
        this._setLastId(filteredResponse[0].id);
      }

      for (const item of filteredResponse.reverse()) {
        this.$emit( item, {
          id: item.id,
          summary: `New lead with Id: ${item.id}`,
          ts: Date.parse(item.time_stamp),
        });
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
