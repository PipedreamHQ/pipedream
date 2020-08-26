const zoomAdmin = {
  type: "app",
  app: "zoom_admin",
};

module.exports = {
  name: "Meeting Ended",
  description: "Emits an event each time a meeting ends in your Zoom account",
  version: "0.0.2",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["meeting.ended"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(event, {
      summary: `Meeting ${object.topic} ended`,
      id: object.uuid,
      ts: +new Date(object.end_time),
    });
  },
};
