import app from "../../transistor_fm.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "New Event",
  description: "Emit new event when the desired event happens",
  key: "transistor_fm-new-event",
  version: "0.0.1",
  type: "source",
  props: {
    app,
    http: "$.interface.http",
    db: "$.service.db",
    showId: {
      propDefinition: [
        app,
        "showId",
      ],
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event you want to subscribe to.",
      options: constants.EVENT_NAME_OPTIONS,
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.app.registerHook({
        show_id: this.showId,
        event_name: this.eventName,
        url: this.http.endpoint,
      });
      this._setHookId(data.id);
      console.log("Hook successfully registered");
    },
    async deactivate() {
      await this.app.unregisterHook(this._getHookId());
      this._setHookId(null);
      console.log("Hook successfully unregistered");
    },
  },
  methods: {
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    _emit(data) {
      this.$emit(data, {
        id: data.id,
        summary: `${this.eventName} - ${data.attributes.email}`,
        ts: data.attributes.created_at || data.attributes.last_notified_at || new Date(),
      });
    },
  },
  async run(event) {
    console.log("Event received");
    console.log("WARN: Transistor.fm does not assign webhook events. Be awared that, because of this, we can not check the reliability of this event.");
    this._emit(event.body.data);
    console.log("Event emitted");
  },
};
