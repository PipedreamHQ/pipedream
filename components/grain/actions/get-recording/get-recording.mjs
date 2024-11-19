import grain from "../../grain.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "grain-get-recording",
  name: "Get Recording",
  description: "Fetches a specific recording by its ID from Grain, optionally including the transcript and intelligence notes. [See the documentation](https://grainhq.notion.site/grain-public-api-877184aa82b54c77a875083c1b560de9)",
  version: "0.0.1",
  type: "action",
  props: {
    grain,
    recordId: {
      propDefinition: [
        grain,
        "recordId",
      ],
      async options({ page }) {
        const recordings = await this.grain.listRecordings({
          page,
        });
        return recordings.map((recording) => ({
          label: recording.title,
          value: recording.id,
        }));
      },
    },
    transcriptFormat: {
      propDefinition: [
        grain,
        "transcriptFormat",
      ],
      optional: true,
    },
    intelligenceNotesFormat: {
      propDefinition: [
        grain,
        "intelligenceNotesFormat",
      ],
      optional: true,
    },
    allowedIntelligenceNotes: {
      propDefinition: [
        grain,
        "allowedIntelligenceNotes",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.grain.fetchRecording({
      recordId: this.recordId,
      transcriptFormat: this.transcriptFormat,
      intelligenceNotesFormat: this.intelligenceNotesFormat,
      allowedIntelligenceNotes: this.allowedIntelligenceNotes,
    });

    $.export("$summary", `Successfully fetched recording with ID ${this.recordId}`);
    return response;
  },
};
