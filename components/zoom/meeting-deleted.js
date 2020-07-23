const zoom = {
  type: "app",
  app: "zoom",
};

module.exports = {
  name: "Meeting Deleted",
  version: "0.0.1",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: ["meeting.deleted.by_me", "meeting.deleted.for_me"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      { event: "meeting.deleted", payload },
      {
        summary: `Meeting ${object.topic} deleted`,
        id: object.uuid,
        ts: +new Date(object.start_time),
      }
    );
  },
};
