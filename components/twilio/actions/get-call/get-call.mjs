import twilio from "../../twilio.app.mjs";
import { callToString } from "../../common/utils.mjs";

export default {
  key: "twilio-get-call",
  name: "Get Call",
  description: "Return call resource of an individual call. [See the documentation](https://www.twilio.com/docs/voice/api/call-resource#fetch-a-call-resource)",
  version: "0.1.5",
  type: "action",
  props: {
    twilio,
    sid: {
      propDefinition: [
        twilio,
        "sid",
      ],
      optional: false,
    },
    includeTranscripts: {
      type: "boolean",
      label: "Include Transcripts",
      description: "Set to `true` to include recording transcript(s) if available",
      optional: true,
    },
  },
  methods: {
    async getTranscripts(callSid) {
      const transcripts = [];
      const recordings = await this.twilio.listRecordings({
        callSid,
      });
      for (const recording of recordings) {
        const recordingTranscripts = await this.getRecordingTranscripts(recording.sid);
        if (recordingTranscripts?.length) {
          transcripts.push(...recordingTranscripts);
        }
      }
      return transcripts;
    },
    async getRecordingTranscripts(sourceSid) {
      const transcripts = await this.twilio.listTranscripts({
        sourceSid,
      });
      const results = [];
      for (const transcript of transcripts) {
        const {
          sentences, transcript: fullTranscript,
        } = await this.twilio.getSentences(transcript.sid);
        results.push({
          ...transcript,
          _version: undefined,
          sentences,
          transcript: fullTranscript,
        });
      }
      return results;
    },
  },
  async run({ $ }) {
    let resp = await this.twilio.getCall(this.sid);

    if (this.includeTranscripts) {
      const transcripts = await this.getTranscripts(this.sid);
      if (transcripts?.length) {
        resp = {
          ...resp,
          _version: undefined,
          transcripts,
        };
      }
    }

    $.export("$summary", `Successfully fetched the call, "${callToString(resp)}"`);
    return resp;
  },
};
