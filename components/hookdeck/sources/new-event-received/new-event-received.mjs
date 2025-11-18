import app from "../../hookdeck.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "hookdeck-new-event-received",
  name: "New Event Received (Instant)",
  description: "Emit new event when a new event is received from a HookDeck source.",
  version: "0.0.3",
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
      label: "Pre-existing Source",
    },
    source: {
      type: "object",
      label: "New Source",
      description: "An object representing the source of the connection. Object must contain at least `name`. Please check the [documentation](https://hookdeck.com/api-ref#create-a-connection) for more information.",
      default: {
        name: "My New Source",
      },
      optional: true,
    },
    destinationName: {
      type: "string",
      label: "Destination Name",
      description: "The destination name that will be created or updated with Pipedream HTTP endpoint for Pipedream source to receive your event. Existing destination with the same name will be overridden with the new HTTP endpoint",
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
        name: this.name || `Pipedream_Connection_${this.getCurrentDateTime()}`,
        description: this.description,
        source_id: this.sourceId,
        source: this.source,
        destination: {
          name: this.destinationName || `Pipedream_Source_${this.getCurrentDateTime()}`,
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
    getCurrentDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString()
        .padStart(2, "0");
      const hours = now.getHours().toString()
        .padStart(2, "0");
      const minutes = now.getMinutes().toString()
        .padStart(2, "0");

      return `${year}${month}${day}${hours}${minutes}`;
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
