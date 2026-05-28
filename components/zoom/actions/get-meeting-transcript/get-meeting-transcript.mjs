import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-get-meeting-transcript",
  name: "Get Meeting Transcript",
  description: "Get the transcript of a past meeting. Fetches the VTT file server-side using your OAuth token and returns speaker-attributed plain text alongside the original authenticated URL. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/get/meetings/{meetingId}/transcript)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
      description: "The ID of a past meeting to retrieve the transcript for. Only meetings with cloud recording and audio transcription enabled will have transcripts available.",
      optional: false,
    },
  },
  methods: {
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
    let transcriptResponse;
    try {
      transcriptResponse = await this.zoom.getMeetingTranscript({
        step,
        meetingId: this.meetingId,
      });
    } catch (error) {
      if (error?.response?.status === 404 || error?.status === 404) {
        throw new ConfigurationError(
          "No recording found for this meeting. Ensure cloud recording was enabled before the meeting started.",
        );
      }
      throw error;
    }

    const transcriptUrl = transcriptResponse?.download_url;
    if (!transcriptUrl) {
      throw new ConfigurationError(
        "No transcript found for this meeting. Ensure audio transcription is enabled in the host's Zoom account settings before the meeting starts.",
      );
    }

    let vttContent;
    try {
      vttContent = await this.fetchTranscriptContent({
        step,
        url: transcriptUrl,
      });
    } catch (error) {
      if (error?.response?.status === 404 || error?.status === 404) {
        throw new ConfigurationError(
          transcriptUrl
            ? "Transcript is still being processed. Please try again shortly."
            : "Transcript file could not be retrieved. It may have expired or been deleted.",
        );
      }
      throw error;
    }

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
      transcript_url: transcriptUrl,
      transcript_text: transcriptText,
    };
  },
};
