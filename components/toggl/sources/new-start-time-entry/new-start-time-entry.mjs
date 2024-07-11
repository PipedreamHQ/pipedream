import base from "../common/base.mjs";

export default {
  ...base,
  name: "New Start Time Entry (Instant)",
  version: "0.0.3",
  key: "toggl-new-start-time-entry",
  description: "Emit new event when a time entry is started. [See docs here](https://github.com/toggl/toggl_api_docs/blob/master/webhooks.md)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    _getAction() {
      return "created";
    },
    _getEntity() {
      return "time_entry";
    },
  },
  async run(event) {
    const { body } = event;

    await this._respond(event);
    if (body.payload === "ping") return;

    if (!body.payload.stop) {
      this.$emit(body, {
        id: body.event_id,
        summary: `New time_entry started with id ${body.payload.id}`,
        ts: Date.parse(body.created_at),
      });
    }
  },
};
