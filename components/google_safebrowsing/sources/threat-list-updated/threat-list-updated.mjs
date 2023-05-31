import safebrowsing from "../../google_safebrowsing.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "google_safebrowsing-threat-list-updated",
  name: "New Threat List Updated",
  description: "Emit new event when a threat list is updated. [See the documentation](https://developers.google.com/safe-browsing/v4/reference/rest/v4/threatListUpdates/fetch#ListUpdateRequest)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    safebrowsing,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    threatLists: {
      propDefinition: [
        safebrowsing,
        "threatLists",
      ],
    },
  },
  methods: {
    _getClientState() {
      return this.db.get("clientState");
    },
    _setClientState(clientState) {
      this.db.set("clientState", clientState);
    },
    generateMeta({
      threatType, platformType, threatEntryType, newClientState,
    }) {
      return {
        id: `${threatType}${platformType}${threatEntryType}${newClientState}`,
        summary: `${threatType} / ${platformType} / ${threatEntryType} Updated`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const threatLists = this.threatLists.map((list) => JSON.parse(list));
    const state = this._getClientState();

    const listUpdateRequests = state
      ? threatLists.map((list) => ({
        ...list,
        state,
      }))
      : threatLists;

    const { listUpdateResponses } = await this.safebrowsing.fetchThreatListUpdates({
      data: {
        listUpdateRequests,
      },
    });

    if (!listUpdateResponses?.length) {
      return;
    }

    for (const response of listUpdateResponses) {
      const meta = this.generateMeta(response);
      this.$emit(response, meta);
    }

    this._setClientState(listUpdateResponses[0].newClientState);
  },
};
