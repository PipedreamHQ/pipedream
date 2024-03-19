import noteManagementApp from "../../note_management_app.app.mjs";

export default {
  key: "zoho-notebook-new-note-card-in-notebook-instant",
  name: "New Note Card in Notebook (Instant)",
  description: "Emits an event when a new note card is created in a specific notebook.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    noteManagementApp,
    db: "$.service.db",
    notebookId: {
      propDefinition: [
        noteManagementApp,
        "notebookId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    ...noteManagementApp.methods,
    generateMeta(data) {
      const {
        id, created_time, name,
      } = data;
      return {
        id,
        summary: `New Note Card Created: ${name}`,
        ts: Date.parse(created_time),
      };
    },
  },
  async run() {
    const url = `${this._baseUrl()}/notebooks/${this.notebookId}/notecards`;
    const lastRunTime = this.db.get("lastRunTime") || this.timer.intervalSeconds * 1000;
    const now = new Date().getTime();
    try {
      const response = await axios(this, {
        url,
        method: "GET",
      });
      const { data } = response;
      if (Array.isArray(data)) {
        data.forEach((noteCard) => {
          if (Date.parse(noteCard.created_time) > lastRunTime) {
            const meta = this.generateMeta(noteCard);
            this.$emit(noteCard, meta);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
    this.db.set("lastRunTime", now);
  },
};
