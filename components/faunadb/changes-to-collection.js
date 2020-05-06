const faunadb = require("https://github.com/PipedreamHQ/pipedream/blob/fauna/components/faunadb/fauna.app.js");

module.exports = {
  name: "changes-to-collection",
  version: "0.0.1",
  db: "$.service.db",
  dedupe: "unique", // Dedupe events based on the concatenation of event + document ref id
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        cron: "*/15 * * * *",
      },
    },
    collection: { propDefinition: [faunadb, "collection"] },
    emitEventsInBatch: {
      type: "boolean",
      label: "Emit changes as a single event",
      description:
        "If `true`, all events are emitted as an array, within a single Pipedream event. Defaults to `false`, emitting each event in Fauna as its own event in Pipedream",
      optional: true,
      default: false,
    },
    faunadb,
  },
  async run() {
    // As soon as the script runs, mark the start time so we can fetch changes
    // since this time on the next run. Fauna expects epoch ms as its cursor.
    const ts = +new Date() * 1000;

    const cursor = this.db.get("cursor") || ts;

    const events = this.faunadb.getEventsInCollectionAfterTs(
      this.collection,
      cursor
    );

    // Batched emits do not take advantage of the built-in deduper
    if (this.emitEventsInBatch) {
      this.$emit(events);
      return;
    }

    for (const event of events) {
      this.$emit(event, {
        summary: `${event.action.toUpperCase()} - ${event.document.id}`,
        id: `${event.action}-${event.document.id}`, // dedupes events based on this ID
      });
    }

    // Finally, set cursor for the next run
    this.db.set("cursor", ts);
  },
};
