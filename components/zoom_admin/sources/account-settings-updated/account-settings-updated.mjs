import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-account-settings-updated",
  type: "source",
  name: "Account Settings Updated",
  description: "Emits an event each time your master account or sub-account settings are updated",
  version: "0.1.7",
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
