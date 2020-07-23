const zoomAdmin = {
  type: "app",
  app: "zoom_admin",
};

module.exports = {
  name: "Webinar Ended",
  version: "0.0.1",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["webinar.ended"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      { event: "webinar.ended", payload },
      {
        summary: `Webinar ${object.topic} ended`,
        id: object.uuid,
        ts: +new Date(object.start_time),
      }
    );
  },
};
