import noteManagementApp from "../../note_management_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zoho-notebook-new-audio-card-instant",
  name: "New Audio Card Instant",
  description: "Emits an event when a new audio card is created in Zoho Notebook",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    noteManagementApp: {
      type: "app",
      app: "note_management_app",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const ts = Date.parse(data.created_at);
      return {
        id: data.id,
        summary: `New Audio Card: ${data.title}`,
        ts,
      };
    },
  },
  async run() {
    const url = this.noteManagementApp._baseUrl() + "/notebooks";
    const notebooks = await this.noteManagementApp._makeRequest({
      $: this,
      method: "GET",
      url,
    });

    for (const notebook of notebooks) {
      const notecards = await this.noteManagementApp._makeRequest({
        $: this,
        method: "GET",
        url: `${url}/${notebook.id}/notecards`,
      });

      for (const notecard of notecards) {
        if (notecard.type === "audio") {
          const meta = this.generateMeta(notecard);
          this.$emit(notecard, meta);
        }
      }
    }
  },
};
