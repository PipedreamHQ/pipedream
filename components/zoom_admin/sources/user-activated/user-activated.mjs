import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-user-activated",
  type: "source",
  name: "User Activated",
  description: "Emits an event each time a user is activated in your Zoom account",
  version: "0.0.3",
  dedupe: "unique", // Dedupe based on user ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "user.activated",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      {
        event: "user.activated",
        payload,
      },
      {
        summary: `User ${object.email} activated`,
        id: object.id,
      },
    );
  },
};
