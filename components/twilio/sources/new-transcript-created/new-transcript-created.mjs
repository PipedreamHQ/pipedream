import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "twilio-new-transcript-created",
  name: "New Transcript Created",
  description: "Emit new event when a new call transcript is created",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    includeTranscriptText: {
      propDefinition: [
        common.props.twilio,
        "includeTranscriptText",
      ],
    },
  },
  methods: {
    ...common.methods,
    async listResults(...args) {
      const results = await this.twilio.listTranscripts(...args);
      if (!this.includeTranscriptText) {
        return results;
      }
      const transcripts = [];
      for (const result of results) {
        const {
          sentences, transcript,
        } = await this.twilio.getSentences(result.sid);
        transcripts.push({
          ...result,
          sentences,
          transcript,
        });
      }
      return transcripts;
    },
    generateMeta(transcript) {
      const {
        sid: id,
        dateCreated,
      } = transcript;
      return {
        id,
        summary: `New transcript ${id}`,
        ts: Date.parse(dateCreated),
      };
    },
  },
};
