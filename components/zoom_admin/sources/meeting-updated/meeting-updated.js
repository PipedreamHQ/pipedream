const zoomAdmin = require('../../zoom_admin.app.js')

module.exports = {
  key: "zoom_admin-meeting-updated",
  name: "Meeting Updated",
  description:
    "Emits an event each time a meeting is updated in your Zoom account",
  version: "0.0.2",
  dedupe: "unique", // dedupe on the meeting ID + timestamp
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["meeting.updated"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(event, {
      summary: `Meeting ${object.id} updated`,
      id: `${object.id}-${payload.time_stamp}`,
    });
  },
};
