import {
  INTELLIGENCE_NOTES_FORMAT_OPTIONS,
  TRANSCRIPT_FORMAT_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import grain from "../../grain.app.mjs";

export default {
  key: "grain-get-recording",
  name: "Get Recording",
  description: "Fetches a specific recording by its ID from Grain, optionally including the transcript and intelligence notes. [See the documentation](https://grainhq.notion.site/grain-public-api-877184aa82b54c77a875083c1b560de9)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    grain,
    recordId: {
      propDefinition: [
        grain,
        "recordId",
      ],
    },
    transcriptFormat: {
      type: "string",
      label: "Transcript Format",
      description: "Format for the transcript",
      options: TRANSCRIPT_FORMAT_OPTIONS,
      optional: true,
    },
    intelligenceNotesFormat: {
      type: "string",
      label: "Intelligence Notes Format",
      description: "Format for the intelligence notes",
      options: INTELLIGENCE_NOTES_FORMAT_OPTIONS,
      optional: true,
    },
    allowedIntelligenceNotes: {
      type: "string[]",
      label: "Allowed Intelligence Notes",
      description: "Whitelist of intelligence notes section titles",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.grain.fetchRecording({
      $,
      recordId: this.recordId,
      params: {
        transcript_format: this.transcriptFormat,
        intelligence_notes_format: this.intelligenceNotesFormat,
        allowed_intelligence_notes: parseObject(this.allowedIntelligenceNotes),
      },
    });

    $.export("$summary", `Successfully fetched recording with ID ${this.recordId}`);
    return response;
  },
};
