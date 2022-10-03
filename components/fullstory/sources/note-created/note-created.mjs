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
      const date = event?.body?.data?.created ?
        new Date(event?.body?.data?.created).getTime() :
        Date.now();
      return {
        id: date,
        ts: date,
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
