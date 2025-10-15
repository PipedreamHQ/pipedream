import twilio from "../../twilio.app.mjs";

export default {
  key: "twilio-get-transcripts",
  name: "Get Transcripts",
  description: "Retrieves full transcripts for the specified transcript SIDs. [See the documentation](https://www.twilio.com/docs/voice/intelligence/api/transcript-sentence-resource#get-transcript-sentences)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    twilio,
    transcriptSids: {
      propDefinition: [
        twilio,
        "transcriptSids",
      ],
    },
  },
  async run({ $ }) {
    const transcripts = [];
    for (const sid of this.transcriptSids) {
      transcripts.push(await this.twilio.getTranscript(sid));
    }
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
    $.export("$summary", `Successfully fetched ${results.length} transcript${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
