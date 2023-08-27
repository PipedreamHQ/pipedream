import pushcut from "../../pushcut.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "pushcut-action-created",
  name: "New Action Created",
  description: "Emit new event when a new action is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    pushcut,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    actionType: {
      type: "string",
      label: "Type",
      description: "Type of new action to watch for",
      options: [
        "shortcut",
        "homekit",
      ],
    },
  },
  methods: {
    generateMeta(action) {
      return {
        id: action.id,
        summary: `${action.id}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const actions = this.actionType === "shortcut"
      ? await this.pushcut.listShortcuts()
      : await this.pushcut.listHomekitScenes();
    for (const action of actions) {
      const meta = this.generateMeta(action);
      this.$emit(action, meta);
    }
  },
};
