import twilio from "../../twilio.app.mjs";
import { omitEmptyStringValues } from "../../common/utils.mjs";

export default {
  key: "twilio-list-transcripts",
  name: "List Transcripts",
  description: "Return a list of transcripts. [See the documentation](https://www.twilio.com/docs/voice/intelligence/api/transcript-resource#fetch-multiple-transcripts)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    twilio,
    includeTranscriptText: {
      propDefinition: [
        twilio,
        "includeTranscriptText",
      ],
    },
    limit: {
      propDefinition: [
        twilio,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    let results = await this.twilio.listTranscripts(
      omitEmptyStringValues({
        limit: this.limit,
      }),
    );
    if (this.includeTranscriptText) {
      const transcripts = [];
      for (const result of results) {
        const {
          sentences, transcript,
        } = await this.twilio.getSentences(result.sid);
        transcripts.push({
          ...result,
          _version: undefined,
          sentences,
          transcript,
        });
      }
      results = transcripts;
    }
    $.export("$summary", `Successfully fetched ${results.length} transcript${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
