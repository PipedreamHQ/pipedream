// This example batches all requests it receives before a
// "start" and an "end" event, storing them in the component's
// local storage, and flushing them as soon as the end event
// is received.
module.exports = {
  name: "Collect events, emit as batch",
  version: "0.0.1",
  props: {
    http: "$.interface.http",
    db: "$.service.db",
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    // Check if the event contains the start or end flags
    // If start, start a new batch
    // If end, flush the batch
    const { type } = event.body;

    if (type === "start") {
      console.log("START EVENT");
      this.db.set("events", []);
      return;
    }

    const events = this.db.get("events") || [];

    if (type === "end") {
      console.log("END EVENT");
      this.$emit(events, { summary: `${events.length} events` });
      this.db.set("events", []);
      return;
    }

    // Otherwise, we have a normal event that we should add to our batch
    events.push(event);
    this.db.set("events", events);
  },
};
