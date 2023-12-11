import app from "../../hookdeck.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "hookdeck-new-event-received",
  name: "New Event Received (Instant)",
  description: "Emit new event when a new event is received from a HookDeck source.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
    name: {
      type: "string",
      label: "Connection Name",
      description: "The name of the connection.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the connection.",
      optional: true,
    },
    sourceId: {
      propDefinition: [
        app,
        "sourceId",
      ],
    },
    source: {
      type: "object",
      label: "Source",
      description: "An object representing the source of the connection. Object must contain at least `name`. Please check the [documentation](https://hookdeck.com/api-ref#create-a-connection) for more information.",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      if (this.sourceId && this.source) {
        throw new ConfigurationError("Only one of `Source Id` or `Source` may be provided.");
      }
      if (!this.source && !this.sourceId) {
        throw new ConfigurationError("Either `Source Id` or `Source` must be provided.");
      }
    },
    async activate() {
      const { id } = await this.app.createConnection({
        name: this.name || "Pipedream",
        description: this.description,
        source_id: this.sourceId,
        source: this.source,
        destination: {
          name: "Pipedream_Source",
          url: this.http.endpoint,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const id = this._getHookId();
      if (id) {
        await this.deleteConnection(id);
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    async deleteConnection(id) {
      await this.app._makeHttpRequest({
        method: "DELETE",
        path: `/connections/${id}`,
      });
    },
    generateMeta() {
      return {
        id: Date.now(),
        summary: "New Event Received",
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    const { body } = event;
    const meta = this.generateMeta();
    this.$emit(body, meta);
  },
};
