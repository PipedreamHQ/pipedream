const zoom = {
  type: "app",
  app: "zoom",
};

module.exports = {
  name: "Meeting Updated",
  version: "0.0.1",
  dedupe: "unique", // dedupe on the meeting ID + timestamp
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
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
