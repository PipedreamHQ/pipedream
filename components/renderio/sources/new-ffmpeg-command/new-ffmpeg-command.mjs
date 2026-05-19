import renderio from "../../renderio.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import {
  getCommandId,
  getTimestamp,
  normalizeList,
} from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "renderio-new-ffmpeg-command",
  name: "New FFmpeg Command",
  description: "Emit new event when a new FFmpeg command is submitted. [See the documentation](https://renderio.dev/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    renderio,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the RenderIO API on this schedule.",
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
      const commandId = getCommandId(command);
      return {
        id: commandId,
        summary: `New FFmpeg command: ${commandId}`,
        ts: getTimestamp(command),
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let commands = [];

      const response = await this.renderio.listCommands({
        params: {
          limit: 100,
        },
      });

      for (const command of normalizeList(response, "commands")) {
        const ts = getTimestamp(command);
        if (ts > lastTs) {
          commands.push(command);
        }
      }

      commands.sort((a, b) => getTimestamp(a) - getTimestamp(b));

      if (max && commands.length > max) {
        commands = commands.slice(-max);
      }

      for (const command of commands) {
        this.$emit(command, this.generateMeta(command));
      }

      if (commands.length > 0) {
        this._setLastTs(getTimestamp(commands[commands.length - 1]));
      }
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
