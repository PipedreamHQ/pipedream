import assemblyai from "../../assemblyai.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Transcription Completed",
  description: "Emit new event when a transcribed audio file from AssemblyAI is ready. [See the documentation](https://www.assemblyai.com/docs/api-reference/transcripts/list)",
  key: "assemblyai-new-transcription-completed",
  version: "0.1.1",
  type: "source",
  dedupe: "unique",
  props: {
    assemblyai,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const { transcripts } = await this.assemblyai.listTranscripts({
        params: {
          status: "completed",
          limit: 25,
        },
      });
      if (!transcripts.length) {
        return;
      }
      this._setLastId(transcripts[0].id);
      await this.emitTranscripts(transcripts);
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId");
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    emitEvent(transcript) {
      const meta = this.generateMeta(transcript);
      this.$emit(transcript, meta);
    },
    async emitTranscripts(transcripts) {
      for (const transcript of transcripts.reverse()) {
        const data = await this.assemblyai.getTranscript({
          transcriptId: transcript.id,
        });
        this.emitEvent(data);
      }
    },
    generateMeta(transcript) {
      return {
        id: transcript.id,
        summary: `New Transcript ID ${transcript.id}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const lastId = this._getLastId();
    const transcripts = await this.assemblyai.paginateTranscripts({
      params: {
        status: "completed",
        after_id: lastId,
      },
    });
    if (!transcripts.length) {
      return;
    }

    this._setLastId(transcripts[0].id);

    await this.emitTranscripts(transcripts);
  },
};
