const zoomAdmin = {
  type: "app",
  app: "zoom_admin",
};

module.exports = {
  name: "User Deleted",
  version: "0.0.1",
  dedupe: "unique", // Dedupe based on user ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["user.deleted"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      { event: "user.deleted", payload },
      {
        summary: `User ${object.email} deleted`,
        id: object.id,
      }
    );
  },
};
