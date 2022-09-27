import common from "../common.mjs";

export default {
  key: "fullstory-note-created",
  name: "New Note Created Event",
  description: "Emit new events when new note created. [See the docs here](https://developer.fullstory.com/note-created)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getMeta(event) {
      return {
        id: event?.body?.data?.id,
        ts: event?.body?.data?.created ?
          new Date(event?.body?.data?.created).getTime() :
          Date.now(),
        summary: `New custom event: ${event?.body?.data?.text}`,
      };
    },
    getEvents() {
      return [
        {
          eventName: "note.created",
        },
      ];
    },
  },
};
