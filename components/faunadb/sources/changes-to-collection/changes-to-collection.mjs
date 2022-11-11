import fauna from "../../faunadb.app.mjs";
import _ from "lodash";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  type: "source",
  key: "faunadb-changes-to-collection",
  name: "New or Removed Documents in a Collection",
  description: "Emit new event each time you add or remove a document from a specific collection, with the details of the document.",
  version: "0.0.8",
  dedupe: "unique", // Dedupe events based on the concatenation of event + document ref id
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
    fauna,
    collection: {
      propDefinition: [
        fauna,
        "collections",
      ],
    },
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
      cursor,
    );

    if (!events.length) {
      console.log(`No new events in collection ${this.collection}`);
      this.db.set("cursor", ts);
      return;
    }

    console.log(`${events.length} new events in collection ${this.collection}`);

    // Batched emits do not take advantage of the built-in deduper
    if (this.emitEventsInBatch) {
      this.$emit({
        events,
      }, {
        summary: `${events.length} new event${events.length > 1
          ? "s"
          : ""}`,
        id: cursor,
      });
    } else {
      for (const event of events) {
        this.$emit(event, {
          summary: `${event.action.toUpperCase()} - ${event.document.id}`,
          id: `${event.action}-${event.document.id}`, // dedupes events based on this ID
        });
      }
    }

    // Finally, set cursor for the next run to the max timestamp of the changed events, ensuring we
    // get all events after that on the next run. We need to add 1 since the timestamp filter in
    // Fauna is inclusive: https://docs.fauna.com/fauna/current/api/fql/functions/paginate
    const maxEventTs = _.maxBy(events, (event) => event.ts).ts + 1;

    this.db.set("cursor", maxEventTs);
  },
};
