import twilio from "../../twilio.app.mjs";
import { omitEmptyStringValues } from "../../common/utils.mjs";

export default {
  key: "twilio-list-recording-transcriptions",
  name: "List Recording Transcriptions",
  description: "Return a set of transcriptions available for a recording. [See the docs](https://www.twilio.com/docs/voice/api/recording#fetch-a-recordings-transcriptions) for more information",
  version: "0.1.1",
  type: "action",
  props: {
    twilio,
    recordingID: {
      propDefinition: [
        twilio,
        "recordingID",
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
    const resp = await this.twilio.listRecordingTranscriptions(
      this.recordingID,
      omitEmptyStringValues({
        limit: this.limit,
      }),
    );
    $.export("$summary", `Successfully fetched ${resp.length} recording transcription${resp.length === 1
      ? ""
      : "s"} for the recording, "${this.recordingID}"`);
    return resp;
  },
};
