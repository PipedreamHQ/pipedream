import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-account-created",
  type: "source",
  name: "Account Created",
  description: "Emits an event each time a sub-account is created in your master account",
  version: "0.1.9",
  dedupe: "unique", // Dedupe based on account ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "account.created",
      ],
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
