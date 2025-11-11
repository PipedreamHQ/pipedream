import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-account-updated",
  type: "source",
  name: "Account Updated",
  description: "Emits an event each time your master account or sub-account profile is updated",
  version: "0.1.9",
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "account.updated",
      ],
    },
  },
  async run(event) {
    console.log(event);
    const { payload } = event;
    const { id } = payload.object;
    this.$emit(event, {
      summary: JSON.stringify(payload.object),
      id: `${id}-${payload.time_stamp}`,
    });
  },
};
