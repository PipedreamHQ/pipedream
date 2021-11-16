const twilio = require("../../twilio.app.js");

module.exports = {
  key: "twilio-list-recording-transcriptions",
  name: "List Recording Transcriptions",
  description: "Return a set of transcriptions available for a recording. [See the docs](https://www.twilio.com/docs/voice/api/recording#fetch-a-recordings-transcriptions) for more information",
  version: "0.0.1",
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
  async run() {
    return this.twilio.listRecordingTranscriptions(this.recordingID, {
      limit: this.limit,
    });
  },
};
