import rendi from "../../rendi.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "rendi-new-ffmpeg-command",
  name: "New FFmpeg Command",
  description: "Emit new event when a new FFmpeg command is submitted. [See the documentation](https://docs.rendi.dev/api-reference/endpoint/list-commands)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    rendi,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Trello API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    generateMeta(command) {
      return {
        id: command.command_id,
        summary: `New FFmpeg command: ${command.command_id}`,
        ts: Date.parse(command.created_at),
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      let commands = [];
      const results = await this.rendi.listCommands();
      for (const command of results) {
        const ts = Date.parse(command.created_at);
        if (ts > lastTs) {
          commands.push(command);
          maxTs = Math.max(maxTs, ts);
        }
      }

      if (max && commands.length > max) {
        commands = commands.slice(-1 * max);
      }

      commands.forEach((command) => {
        const meta = this.generateMeta(command);
        this.$emit(command, meta);
      });

      this._setLastTs(maxTs);
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
