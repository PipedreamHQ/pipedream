import readwise from "../../readwise.app.mjs";

export default {
  key: "readwise-new-highlights",
  name: "New Highlights",
  description: "Emit new Highlight",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    readwise,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Readwise API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    bookId: {
      propDefinition: [
        readwise,
        "bookId",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      await this.processHighlighs({
        book_id: this.bookId,
        page_size: 25,
      });
    },
  },
  methods: {
    _getLastHighlightedAt() {
      return this.db.get("lastHighlightedAt");
    },
    _setLastHighlightedAt(lastHighlightedAt) {
      this.db.set("lastHighlightedAt", lastHighlightedAt);
    },
    async retrieveTicket(id) {
      return this.readwise.retrieveTicket({
        id,
      });
    },
    async processHighlighs(params) {
      const { results: events } = await this.readwise.listHighlights({
        params,
      });
      for (const event of events) {
        this.emitEvent(await this.readwise.getHighlight({
          highlightId: event.id,
        }));
      }
    },
    async processEvent() {
      const lastHighlightedAt = this._getLastHighlightedAt();
      await this.processHighlighs({
        book_id: this.bookId,
        highlighted_at__gt: lastHighlightedAt,
      });
    },
    emitEvent(event, lastHighlightedAt = null) {
      lastHighlightedAt = lastHighlightedAt || this._getLastHighlightedAt();

      if (!lastHighlightedAt || (new Date(event.highlighted_at) > new Date(lastHighlightedAt)))
        this._setLastHighlightedAt(event.highlighted_at);

      const ts = Date.parse(event.highlighted_at);
      this.$emit(event, {
        id: `${event.id}_${ts}`,
        ts,
        summary: `New highlight: ${event.id}`,
      });
    },
  },
  async run() {
    console.log("Raw received event:");
    return this.processEvent();
  },
};
