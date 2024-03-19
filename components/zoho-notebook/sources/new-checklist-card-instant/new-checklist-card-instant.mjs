import noteManagementApp from "../../note_management_app.app.mjs";

export default {
  key: "zoho-notebook-new-checklist-card-instant",
  name: "New Checklist Card Instant",
  description: "This component emits an event when a new checklist card is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    noteManagementApp,
    notebookId: {
      propDefinition: [
        noteManagementApp,
        "notebookId",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // by default, run every 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      // Get all notecards when this component is first deployed
      const notecards = await this.noteManagementApp.getNotebooks({
        notebookId: this.notebookId,
      });
      if (notecards.length > 0) {
        // Loop through notecards and emit them
        notecards.forEach((notecard) => {
          this.$emit(notecard, {
            id: notecard.id,
            summary: notecard.title,
            ts: Date.now(),
          });
        });
      }
    },
  },
  async run() {
    // Get all notecards
    const notecards = await this.noteManagementApp.getNotebooks({
      notebookId: this.notebookId,
    });
    if (notecards.length > 0) {
      // Loop through notecards and emit new ones
      notecards.forEach((notecard) => {
        // Only emit data for new notecards
        if (!this.db.get(notecard.id)) {
          this.$emit(notecard, {
            id: notecard.id,
            summary: notecard.title,
            ts: Date.now(),
          });
          // Store the ID of the notecard we just emitted
          this.db.set(notecard.id, true);
        }
      });
    }
  },
};
