const zoom = {
  type: "app",
  app: "zoom",
};

module.exports = {
  name: "Meeting Created",
  version: "0.0.1",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      static: ["meeting.created.by_me", "meeting.created.for_me"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      { event: "meeting.created", payload },
      {
        summary: object.topic,
        id: object.uuid,
        ts: +new Date(object.start_time),
      }
    );
  },
};
