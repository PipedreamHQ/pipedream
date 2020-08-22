const zoomAdmin = {
  type: "app",
  app: "zoom_admin",
};

module.exports = {
  name: "User Updated",
  description:
    "Emits an event each time a user's settings are updated in your Zoom account",
  version: "0.0.2",
  dedupe: "unique", // Dedupe based on user ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["user.updated"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      { event: "user.updated", payload },
      {
        summary: `User ${object.email} updated`,
        id: object.id,
      }
    );
  },
};
