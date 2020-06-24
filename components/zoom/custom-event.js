const zoom = {
  type: "app",
  app: "zoom",
};

module.exports = {
  name: "Zoom Custom Events",
  version: "0.0.1",
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
    },
  },
  async run(event) {
    console.log(event);
    this.$emit(event, {
      summary: event.event,
    });
  },
};
