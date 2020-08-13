const zoomAdmin = {
  type: "app",
  app: "zoom_admin",
};

module.exports = {
  name: "Webinar Created",
  version: "0.0.1",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["webinar.created"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      { event: "webinar.created", payload },
      {
        summary: `Webinar ${object.topic} created`,
        id: object.uuid,
        ts: +new Date(object.start_time),
      }
    );
  },
};
