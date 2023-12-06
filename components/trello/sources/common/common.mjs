import trello from "../../trello.app.mjs";

export default {
  props: {
    trello,
    db: "$.service.db",
  },
  methods: {
    /**
     * Default generateMeta. Components should overwrite this function if they require
     * different meta to be emitted.
     * @param {string} id - The id of the item being emitted.
     * @param {string} name - The name of the item of the book.
     */
    generateMeta({
      id, name: summary,
    }) {
      return {
        id,
        summary,
        ts: Date.now(),
      };
    },
    /**
     * Default emitEvent. Components should overwrite this function if something more
     * needs to be emitted in the event.
     * @param {object} result - The result object to be emitted
     */
    emitEvent(result) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    },
  },
};
