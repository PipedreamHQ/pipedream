const zoomAdmin = {
  type: "app",
  app: "zoom_admin",
};

module.exports = {
  name: "Webinar Started",
  description: "Emits an event each time a webinar starts in your Zoom account",
  version: "0.0.2",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["webinar.started"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      { event: "webinar.started", payload },
      {
        summary: `Webinar ${object.topic} started`,
        id: object.uuid,
        ts: +new Date(object.start_time),
      }
    );
  },
};
