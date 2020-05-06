const fauna = require("https://github.com/PipedreamHQ/pipedream/components/faunadb/faunadb.app.js");

module.exports = {
  name: "changes-to-collection",
  version: "0.0.1",
  dedupe: "unique", // Dedupe events based on the concatenation of event + document ref id
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        cron: "*/15 * * * *",
      },
    },
    db: "$.service.db",
    fauna,
    collection: { propDefinition: [fauna, "collection"] },
    emitEventsInBatch: {
      type: "boolean",
      label: "Emit changes as a single event",
      description:
        "If `true`, all events are emitted as an array, within a single Pipedream event. Defaults to `false`, emitting each event in Fauna as its own event in Pipedream",
      optional: true,
      default: false,
    },
  },
  async run() {
    // As soon as the script runs, mark the start time so we can fetch changes
    // since this time on the next run. Fauna expects epoch ms as its cursor.
    const ts = +new Date() * 1000;
    const cursor = this.db.get("cursor") || ts;

    const events = await this.fauna.getEventsInCollectionAfterTs(
      this.collection,
      cursor
    );

    if (!events.length) {
      console.log(`No new events in collection ${this.collection}`);
      this.db.set("cursor", ts);
      return;
    }

    console.log(`${events.length} new events in collection ${this.collection}`);

    // Batched emits do not take advantage of the built-in deduper
    if (this.emitEventsInBatch) {
      this.$emit(events, {
        summary: `${events.length} new event${events.length > 1 ? "s" : ""}`,
        id: cursor,
      });
    } else {
      for (const event of events) {
        this.$emit(event, {
          summary: `${event.action.toUpperCase()} - ${event.instance.id}`,
          id: `${event.action}-${event.instance.id}`, // dedupes events based on this ID
        });
      }
    }

    // Finally, set cursor for the next run
    this.db.set("cursor", ts);
  },
};
