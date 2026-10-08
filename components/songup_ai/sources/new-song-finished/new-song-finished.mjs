import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import songupAi from "../../songup_ai.app.mjs";

export default {
  key: "songup_ai-new-song-finished",
  name: "New Song Finished",
  description: "Emit new event when a song in your SongUp AI account is finished and ready to play, including songs made with **Create Song**. [See the documentation](https://www.songupai.com/developers)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    songupAi,
    db: "$.service.db",
    timer: {
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
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(song) {
      return {
        id: song.id,
        summary: `Song finished: ${song.title || song.id}`,
        ts: Date.parse(song.completed_at || song.created_at),
      };
    },
    async processEvent(limit) {
      const lastTs = this._getLastTs();
      const { songs } = await this.songupAi.listSongs({
        params: {
          status: "completed",
          limit,
          since: lastTs || undefined,
        },
      });
      if (!songs.length) return;
      this._setLastTs(Date.parse(songs[0].completed_at || songs[0].created_at));
      // The API lists newest first: emit oldest first.
      for (const song of songs.reverse()) {
        this.$emit(song, this.generateMeta(song));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(10);
    },
  },
  async run() {
    await this.processEvent(50);
  },
};
