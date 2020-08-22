const zoomAdmin = {
  type: "app",
  app: "zoom_admin",
};

module.exports = {
  name: "User Invitation Accepted",
  description:
    "Emits an event each time a user accepts an invite to your Zoom account",
  version: "0.0.2",
  dedupe: "unique", // Dedupe based on user ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["user.invitation_accepted"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      { event: "user.invitation_accepted", payload },
      {
        summary: `User ${object.email} accepted invitation`,
        id: object.id,
      }
    );
  },
};
