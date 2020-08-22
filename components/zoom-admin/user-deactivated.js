const zoomAdmin = {
  type: "app",
  app: "zoom_admin",
};

module.exports = {
  name: "User Deactivated",
  description:
    "Emits an event each time a user is deactivated in your Zoom account",
  version: "0.0.2",
  dedupe: "unique", // Dedupe based on user ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["user.deactivated"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      { event: "user.deactivated", payload },
      {
        summary: `User ${object.email} deactivated`,
        id: object.id,
      }
    );
  },
};
