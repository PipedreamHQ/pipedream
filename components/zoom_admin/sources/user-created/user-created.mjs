import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-user-created",
  type: "source",
  name: "User Created",
  description: "Emits an event each time a user is created in your Zoom account",
  version: "0.1.8",
  dedupe: "unique", // Dedupe based on user ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "user.created",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      {
        event: "user.created",
        payload,
      },
      {
        summary: `New user: ${object.email}`,
        id: object.id,
      },
    );
  },
};
