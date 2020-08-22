const zoomAdmin = {
  type: "app",
  app: "zoom_admin",
};

module.exports = {
  name: "User Created",
  description:
    "Emits an event each time a user is created in your Zoom account",
  version: "0.0.2",
  dedupe: "unique", // Dedupe based on user ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["user.created"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      { event: "user.created", payload },
      {
        summary: `New user: ${object.email}`,
        id: object.id,
      }
    );
  },
};
