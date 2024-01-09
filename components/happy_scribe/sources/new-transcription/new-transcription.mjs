import app from "../../happy_scribe.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Transcription",
  version: "0.0.1",
  key: "happy_scribe-new-transcription",
  description: "Emit new event on each new transcription.",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
  },
  methods: {
    emitEvent(data) {
      this._setLastResourceId(data.id);

      this.$emit(data, {
        id: data.id,
        summary: `New transcription with ID ${data.id}`,
        ts: Date.parse(data.createdAt),
      });
    },
    _setLastResourceId(id) {
      this.db.set("lastResourceId", id);
    },
    _getLastResourceId() {
      return this.db.get("lastResourceId");
    },
  },
  async run() {
    const lastResourceId = this._getLastResourceId();

    let page = 1;

    while (page >= 0) {
      const { results: resources } = await this.app.getTranscriptions({
        params: {
          page,
          organization_id: this.organizationId,
        },
      });

      resources.reverse().forEach(this.emitEvent);

      if (
        resources.length < 100 ||
        resources.filter((resource) => resource.id === lastResourceId)
      ) {
        page = -1;
        return;
      }

      page++;
    }
  },
};
