import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-user-deleted",
  type: "source",
  name: "User Deleted",
  description: "Emits an event each time a user is deleted in your Zoom account",
  version: "0.1.7",
  dedupe: "unique", // Dedupe based on user ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "user.deleted",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      {
        event: "user.deleted",
        payload,
      },
      {
        summary: `User ${object.email} deleted`,
        id: object.id,
      },
    );
  },
};
