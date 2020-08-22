const zoomAdmin = {
  type: "app",
  app: "zoom_admin",
};

module.exports = {
  name: "Webinar Deleted",
  description:
    "Emits an event each time a webinar is deleted in your Zoom account",
  version: "0.0.2",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["webinar.deleted"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      { event: "webinar.deleted", payload },
      {
        summary: `Webinar ${object.topic} deleted`,
        id: object.uuid,
        ts: +new Date(object.start_time),
      }
    );
  },
};
