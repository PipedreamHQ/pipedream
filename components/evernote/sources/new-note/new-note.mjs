import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import evernoteApp from "../../evernote.app.mjs";

export default {
  key: "evernote-new-note",
  name: "New Note Created",
  description: "Emits a new event when a note is created in Evernote. Optionally filter by notebook. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    evernote: {
      type: "app",
      app: "evernote",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    notebookFilter: {
      propDefinition: [
        evernoteApp,
        "notebookFilter",
      ],
      optional: true,
    },
  },
  methods: {
    async getLastRunTime() {
      return (await this.db.get("lastRun")) || 0;
    },
    async setLastRunTime(timestamp) {
      await this.db.set("lastRun", timestamp);
    },
    async emitNoteEvents(notes) {
      for (const note of notes) {
        const ts = Date.parse(note.created) || Date.now();
        const eventData = {
          id: note.id,
          summary: `New note created: ${note.title}`,
          ts,
        };
        this.$emit(note, eventData);
      }
    },
  },
  hooks: {
    async deploy() {
      const lastRun = await this.getLastRunTime();
      const notes = await this.evernote.listNotes({
        notebookId: this.notebookFilter || undefined,
        since: lastRun,
        limit: 50,
        sort: "created",
      });

      const recentNotes = notes.slice(-50).reverse();
      await this.emitNoteEvents(recentNotes);

      if (recentNotes.length > 0) {
        const latestNote = recentNotes[recentNotes.length - 1];
        const latestTs = Date.parse(latestNote.created) || Date.now();
        await this.setLastRunTime(latestTs);
      }
    },
    async activate() {
      // No webhook setup needed for polling source
    },
    async deactivate() {
      // No webhook teardown needed for polling source
    },
  },
  async run() {
    const lastRun = await this.getLastRunTime();
    const notes = await this.evernote.listNotes({
      notebookId: this.notebookFilter || undefined,
      since: lastRun,
      limit: 50,
      sort: "created",
    });

    await this.emitNoteEvents(notes);

    if (notes.length > 0) {
      const latestNote = notes[notes.length - 1];
      const latestTs = Date.parse(latestNote.created) || Date.now();
      await this.setLastRunTime(latestTs);
    }
  },
};
