const zoomAdmin = {
  type: "app",
  app: "zoom_admin",
};

module.exports = {
  name: "Account Created",
  version: "0.0.1",
  dedupe: "unique", // Dedupe based on account ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["account.created"],
    },
  },
  async run(event) {
    console.log(event);
    const { id } = event.payload.object;
    this.$emit(event, {
      summary: `New sub-account ${id} created`,
      id,
    });
  },
};
