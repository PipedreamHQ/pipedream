import app from "../../stormboard.app.mjs";

export default {
  type: "source",
  dedupe: "unique",
  key: "stormboard-new-action",
  name: "New Action (Instant)",
  description: "Emit new event when a new action occurs. See how to configure the webhook [here](https://stormboard.com/users/webhook)",
  version: "0.0.1",
  props: {
    app,
    http: "$.interface.http",
  },
  methods: {
    emit(event) {
      this.$emit(event, {
        id: event.id,
        summary: `${event.event} - ${event.id}`,
        ts: event.time || Date.now(),
      });
    },
  },
  async run(event) {
    console.log("Stormboard does not sign your webhook requests. Therefore, it is not possible to verify the veracity of the request.");
    this.emit(event.body);
  },
};
