import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import zoom from "../../zoom.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "zoom-get-meeting-transcript",
  name: "Get Meeting Transcript",
  description: "Get the transcript of a past meeting."
    + " A numeric meeting ID is resolved to its most recent ended instance first."
    + " Returns Zoom's meeting transcript when there is one, otherwise the meeting's cloud recording audio transcript."
    + " Fetches the VTT file server-side using your OAuth token and returns speaker-attributed plain text, the original authenticated URL, and the transcript `source` (`meeting_transcript` or `cloud_recording`)."
    + " [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/meeting-transcript/get/meetings/{meetingId}/transcript)",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    zoom,
    meetingId: {
      propDefinition: [
        zoom,
        "meetingId",
        () => ({
          type: "previous_meetings",
        }),
      ],
      description: "The past meeting to retrieve the transcript for. A numeric meeting ID returns the transcript of its most recent ended instance; to target an earlier occurrence of a recurring meeting, pass that instance's UUID. Only past meetings are listed.",
      optional: false,
    },
  },
  methods: {
    async getTranscriptSource({
      step, meetingUuid,
    }) {
      const {
        status, data: transcript,
      } = await this.zoom.getMeetingTranscript({
        step,
        meetingId: meetingUuid,
        returnFullResponse: true,
        validateStatus: utils.isSuccessOrNotFound,
      });

      if (status === 404 && transcript?.code !== constants.ERROR_CODES.TRANSCRIPT_NOT_FOUND) {
        throw new Error(`Zoom returned 404 (code ${transcript?.code}): ${transcript?.message}`);
      }

      if (status !== 404 && transcript?.can_download && transcript.download_url) {
        return {
          source: "meeting_transcript",
          url: transcript.download_url,
        };
      }
      const reason = status === 404
        ? undefined
        : transcript?.download_restriction_reason;

      const {
        status: recordingsStatus, data: recordings,
      } = await this.zoom.getMeetingRecordings({
        step,
        meetingId: meetingUuid,
        returnFullResponse: true,
        validateStatus: utils.isSuccessOrNotFound,
      });
      const transcriptFiles = recordingsStatus === 404
        ? []
        : (recordings?.recording_files ?? []).filter(({ file_type: fileType }) =>
          fileType === constants.RECORDING_FILE_TYPES.TRANSCRIPT);

      const completed = transcriptFiles.find(({ status }) =>
        status === constants.RECORDING_STATUS_COMPLETED);
      if (completed?.download_url) {
        return {
          source: "cloud_recording",
          url: completed.download_url,
        };
      }
      if (transcriptFiles.length || reason === constants.TRANSCRIPT_RESTRICTION_REASONS.NOT_READY) {
        throw new ConfigurationError("Transcript is still being processed. Please try again shortly.");
      }
      if (reason && reason !== constants.TRANSCRIPT_RESTRICTION_REASONS.NO_TRANSCRIPT_DATA) {
        throw new ConfigurationError(`Zoom does not allow this meeting's transcript to be downloaded (reason: ${reason}), and it has no cloud recording audio transcript.`);
      }
      throw new ConfigurationError(
        "No transcript found for this meeting. Zoom has neither a meeting transcript nor a cloud recording audio transcript for it.",
      );
    },
    fetchTranscriptContent({
      step, url,
    }) {
      return axios(step, {
        url,
        headers: this.zoom._getHeaders(),
        responseType: "text",
      });
    },
    parseVtt(vttContent) {
      const normalized = vttContent
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .trim();
      const blocks = normalized.split(/\n{2,}/);
      const result = [];
      for (const block of blocks) {
        const lines = block.trim().split("\n");
        if (lines[0]?.trim().startsWith("WEBVTT")) continue;

        const timestampIdx = lines.findIndex((l) => l.includes(" --> "));
        if (timestampIdx === -1) continue;

        const textLines = lines.slice(timestampIdx + 1);
        if (!textLines.length) continue;

        let currentSpeaker = null;
        const textParts = textLines
          .map((line) => {
            const speakerMatch = line.match(/<v\s+([^>]+)>/);
            if (speakerMatch) {
              currentSpeaker = speakerMatch[1].trim();
            }
            const cleanText = line.replace(/<[^>]+>/g, "").trim();
            if (!cleanText) {
              return null;
            }
            return currentSpeaker
              ? `${currentSpeaker}: ${cleanText}`
              : cleanText;
          })
          .filter((t) => t);

        if (!textParts.length) continue;

        result.push(...textParts);
      }
      return result.join("\n");
    },
  },
  async run({ $: step }) {
    const meetingUuid = await this.zoom.resolvePastMeetingUuid({
      step,
      meetingId: this.meetingId,
    });
    const {
      source, url: transcriptUrl,
    } = await this.getTranscriptSource({
      step,
      meetingUuid,
    });

    const vttContent = await this.fetchTranscriptContent({
      step,
      url: transcriptUrl,
    });

    const trimmed = vttContent?.trim() ?? "";
    if (!trimmed || trimmed === "WEBVTT") {
      throw new ConfigurationError(
        "Transcript is still being processed. Please try again shortly.",
      );
    }

    const transcriptText = this.parseVtt(vttContent);
    if (!transcriptText) {
      throw new ConfigurationError(
        "Transcript is still being processed. Please try again shortly.",
      );
    }

    step.export("$summary", `Retrieved transcript for meeting ${this.meetingId}`);
    return {
      meeting_uuid: meetingUuid,
      source,
      transcript_url: transcriptUrl,
      transcript_text: transcriptText,
    };
  },
};
