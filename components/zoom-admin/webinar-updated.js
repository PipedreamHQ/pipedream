const zoomAdmin = {
  type: "app",
  app: "zoom_admin",
};

module.exports = {
  name: "Webinar Updated",
  version: "0.0.1",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["webinar.updated"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      { event: "webinar.updated", payload },
      {
        summary: `Webinar ${object.id} updated`,
        id: `${object.id}-${payload.time_stamp}`,
      }
    );
  },
};
