import ringcentral from "../../ringcentral.app.mjs";
import fs from "fs";

export default {
  key: "ringcentral-download-recording",
  name: "Download Recording",
  description: "Gets a recording and downloads it to the /tmp directory. [See the documentation](https://developers.ringcentral.com/api-reference/Call-Recordings/readCallRecordingContent)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ringcentral,
    accountId: {
      propDefinition: [
        ringcentral,
        "accountId",
      ],
    },
    extensionId: {
      type: "string",
      label: "Extension ID",
      description: "Extension ID of the recording.",
      propDefinition: [
        ringcentral,
        "extensionId",
      ],
    },
    recordingId: {
      type: "string",
      label: "Recording ID",
      description: "Identifier of the recording to download",
      async options({ page }) {
        const { records } = await this.ringcentral.getUserCallLogRecords({
          accountId: this.accountId,
          extensionId: this.extensionId,
          params: {
            page: page + 1,
            dateFrom: "2016-01-01T00:00:00.000Z",
            recordingType: "All",
          },
        });
        return records?.map(({ recording }) => recording.id );
      },
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Filename for the new file in the /tmp directory",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    getRecording({
      accountId, recordingId, ...args
    }) {
      return this.ringcentral.makeRequest({
        url: `https://media.ringcentral.com/restapi/v1.0/account/${accountId}/recording/${recordingId}/content`,
        headers: {
          ...this.ringcentral.getHeaders(),
          Accept: "audio/mpeg",
        },
        responseType: "arraybuffer",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const result = await this.getRecording({
      accountId: this.accountId,
      recordingId: this.recordingId,
      $,
    });

    let tmpPath = this.filename.includes("/tmp")
      ? this.filename
      : `/tmp/${this.filename}`;
    if (!tmpPath.includes(".mp3")) {
      tmpPath = `${tmpPath}.mp3`;
    }

    fs.writeFileSync(tmpPath, result);

    $.export("$summary", `Successfully saved file to ${tmpPath}.`);

    return tmpPath;
  },
};
