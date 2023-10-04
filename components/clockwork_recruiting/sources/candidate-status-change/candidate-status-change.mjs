import app from "../../clockwork_recruiting.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "clockwork_recruiting-document-signed",
  name: "New Document Signed (Instant)",
  description: "Emit new event when a document is signed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { id } = await this.app.createHook({
        data: {
          hook_url: this.http.endpoint,
        },
      });

      this._setHookId(id);
    },
    async deactivate() {
      const id = this._getHookId("hookId");
      await this.app.deleteHook(id);
    },
  },
  methods: {
    emitEvent(body) {
      const {
        event_name: event,
        candidacy,
      } = body;

      if (event === "candidacy_updated") {
        const {
          id, status_id: statusId, updated_at: updatedAt,
        } = candidacy;

        this.$emit(body, {
          id: id + statusId,
          summary: `The status of the candidate with id ${id} has been updated!`,
          ts: new Date(updatedAt),
        });
      }
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getLastStatusId() {
      return this.db.get("lastStatusId");
    },
    _setLastStatusId(statusId) {
      this.db.set("lastStatusId", statusId);
    },
  },
  async run({ body }) {
    this.emitEvent(body);
  },
  sampleEmit,
};
