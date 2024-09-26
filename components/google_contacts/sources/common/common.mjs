import googleContacts from "../../google_contacts.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    googleContacts,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    getEvents() {
      throw new ConfigurationError("getEvents is not implemented");
    },
    getParams() {
      throw new ConfigurationError("getParams is not implemented");
    },
    getTs() {
      throw new ConfigurationError("getTs is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxLastTs = lastTs;
    const client = this.googleContacts.getClient();
    const params = this.getParams();

    do {
      const {
        events,
        nextPageToken,
      } = await this.getEvents({
        client,
        params,
      });
      params.pageToken = nextPageToken;

      for (const event of events) {
        const ts = this.getTs(event);
        if (ts > lastTs) {
          this.emitEvent(event);
          if (ts > maxLastTs) {
            maxLastTs = ts;
          }
        }
      }
    } while (params.pageToken);

    this._setLastTs(maxLastTs);
  },
};
