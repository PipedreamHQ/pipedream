import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import evernote from "../../evernote.app.mjs";

export default {
  key: "evernote-new-notebook",
  name: "New Notebook Created",
  description: "Emit a new event when a notebook is created in Evernote. [See the documentation](),",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    evernote,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    notebookFilter: {
      propDefinition: [
        evernote,
        "notebookFilter",
      ],
    },
  },
  methods: {
    async fetchNotebooks() {
      const notebooks = await this.evernote.listNotebooks();
      return notebooks;
    },
    getStoredNotebooks() {
      return this.db.get("notebooks") || [];
    },
    storeNotebooks(notebooks) {
      this.db.set("notebooks", notebooks);
    },
    findNewNotebooks(currentNotebooks, storedNotebooks) {
      const storedIds = new Set(storedNotebooks.map((nb) => nb.id));
      return currentNotebooks.filter((nb) => !storedIds.has(nb.id));
    },
    async emitNotebookEvents(newNotebooks) {
      for (const notebook of newNotebooks) {
        const timestamp = notebook.created
          ? Date.parse(notebook.created)
          : Date.now();
        this.$emit(notebook, {
          id: notebook.id,
          summary: `New notebook created: ${notebook.name}`,
          ts: timestamp,
        });
      }
    },
  },
  hooks: {
    async deploy() {
      const notebooks = await this.fetchNotebooks();
      this.storeNotebooks(notebooks);

      const recentNotebooks = notebooks.slice(-50).reverse();
      for (const notebook of recentNotebooks) {
        const timestamp = notebook.created
          ? Date.parse(notebook.created)
          : Date.now();
        this.$emit(notebook, {
          id: notebook.id,
          summary: `New notebook created: ${notebook.name}`,
          ts: timestamp,
        });
      }
    },
    async activate() {
      // No webhook subscription needed for polling
    },
    async deactivate() {
      // No webhook subscription to remove
    },
  },
  async run() {
    const currentNotebooks = await this.fetchNotebooks();
    const storedNotebooks = this.getStoredNotebooks();

    const newNotebooks = this.findNewNotebooks(currentNotebooks, storedNotebooks);
    if (newNotebooks.length > 0) {
      await this.emitNotebookEvents(newNotebooks);
      this.storeNotebooks(currentNotebooks);
    }
  },
};
