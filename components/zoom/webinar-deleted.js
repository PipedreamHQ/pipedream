const zoom = {
  type: "app",
  app: "zoom",
};

module.exports = {
  name: "Webinar Deleted",
  description:
    "Emits an event each time a webinar is deleted where you're the host",
  version: "0.0.2",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: ["webinar.deleted.by_me", "webinar.deleted.for_me"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      { event: "webinar.deleted", payload },
      {
        summary: object.topic,
        id: object.uuid,
        ts: +new Date(object.start_time),
      }
    );
  },
};
