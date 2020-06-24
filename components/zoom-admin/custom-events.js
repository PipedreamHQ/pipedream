const zoomAdmin = {
  type: "app",
  app: "zoom_admin",
};

module.exports = {
  name: "Zoom Admin Custom Events",
  version: "0.0.1",
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom_admin",
    },
  },
  async run(event) {
    console.log(event);
    this.$emit(event, {
      summary: event.event,
    });
  },
};
