import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-user-deactivated",
  type: "source",
  name: "User Deactivated",
  description: "Emits an event each time a user is deactivated in your Zoom account",
  version: "0.1.8",
  dedupe: "unique", // Dedupe based on user ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "user.deactivated",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      {
        event: "user.deactivated",
        payload,
      },
      {
        summary: `User ${object.email} deactivated`,
        id: object.id,
      },
    );
  },
};
