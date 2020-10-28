const zoomAdmin = require('../../zoom_admin.app.js');

module.exports = {
  key: "zoom_admin-webinar-ended",
  name: "Webinar Ended",
  description: "Emits an event each time a webinar ends in your Zoom account",
  version: "0.0.2",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["webinar.ended"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      { event: "webinar.ended", payload },
      {
        summary: `Webinar ${object.topic} ended`,
        id: object.uuid,
        ts: +new Date(object.start_time),
      }
    );
  },
};
