import common from "../common/base.mjs";

export default {
  ...common,
  key: "pipedrive-new-event-instant",
  name: "New Event (Instant)",
  description: "Emit new event for any Pipedrive webhook matching the chosen `Event Action` and `Event Object`, e.g. `change` + `deal` for every deal update, or `*` + `*` for everything. Each event is the Pipedrive webhook (v2) payload: `meta` (`action`, `entity`, `entity_id`, `timestamp`, `user_id`) and `data` (the affected record), plus `previous` on `change` events. On `delete` events `data` is `null` and `previous` holds the object's last state. Prefer the dedicated deal, person and lead triggers when you only need one of those; they also resolve custom field names. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Webhooks#addWebhook)",
  version: "0.0.10",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventAction: {
      type: "string",
      label: "Event Action",
      description: "The action to listen for: `create`, `change`, `delete`, or `*` for all of them, e.g. `create`.",
      options: [
        "*",
        "create",
        "change",
        "delete",
      ],
    },
    eventObject: {
      type: "string",
      label: "Event Object",
      description: "The record type to listen for, e.g. `deal`, `person` or `activity`. Use `*` to match every supported object type.",
      options: [
        "*",
        "activity",
        "deal",
        "lead",
        "note",
        "organization",
        "person",
        "pipeline",
        "product",
        "stage",
        "user",
      ],
    },
  },
  methods: {
    ...common.methods,
    getExtraData() {
      return {
        event_action: this.eventAction,
        event_object: this.eventObject,
      };
    },
    getSummary(body) {
      return `New ${body.meta.action}.${body.meta.entity} event`;
    },
  },
};
