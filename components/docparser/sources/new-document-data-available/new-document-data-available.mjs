import docparser from "../../docparser.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "docparser-new-document-data-available",
  name: "New Document Data Available",
  description: "Emit new event every time a document is processed and parsed data is available. [See the documentation](https://docparser.com/api/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    docparser,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    parserId: {
      propDefinition: [
        docparser,
        "parserId",
      ],
    },
  },
  methods: {
    _getLastFetchedId() {
      return this.db.get("lastFetchedId") || null;
    },
    _setLastFetchedId(id) {
      this.db.set("lastFetchedId", id);
    },
    async getParsedData() {
      return await this.docparser._makeRequest({
        path: `/v2/results/${this.parserId}`,
      });
    },
  },
  hooks: {
    async deploy() {
      const parsedData = await this.getParsedData();
      const eventsToEmit = parsedData.slice(-50);

      for (const event of eventsToEmit) {
        this.$emit(event, {
          id: event.id,
          summary: `New Document Parsed: ${event.file_name}`,
          ts: Date.parse(event.parsed_at),
        });
      }

      if (eventsToEmit.length > 0) {
        const lastEvent = eventsToEmit[eventsToEmit.length - 1];
        this._setLastFetchedId(lastEvent.id);
      }
    },
    async activate() {
      console.log("Component activated");
    },
    async deactivate() {
      console.log("Component deactivated");
    },
  },
  async run() {
    const lastFetchedId = this._getLastFetchedId();
    const parsedData = await this.getParsedData();

    for (const event of parsedData) {
      if (!lastFetchedId || event.id > lastFetchedId) {
        this.$emit(event, {
          id: event.id,
          summary: `New Document Parsed: ${event.file_name}`,
          ts: Date.parse(event.parsed_at),
        });
      }
    }

    if (parsedData.length > 0) {
      const lastEvent = parsedData[parsedData.length - 1];
      this._setLastFetchedId(lastEvent.id);
    }
  },
};
