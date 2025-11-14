import app from "../../gong.app.mjs";

export default {
  key: "gong-retrieve-transcripts-of-calls",
  name: "Retrieve Transcripts Of Calls",
  description: "Retrieve transcripts of calls. [See the documentation](https://us-66463.app.gong.io/settings/api/documentation#post-/v2/calls/transcript)",
  type: "action",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    fromDateTime: {
      optional: true,
      propDefinition: [
        app,
        "fromDateTime",
      ],
    },
    toDateTime: {
      optional: true,
      propDefinition: [
        app,
        "toDateTime",
      ],
    },
    workspaceId: {
      optional: true,
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
    callIds: {
      propDefinition: [
        app,
        "callIds",
      ],
    },
    returnSimplifiedTranscript: {
      type: "boolean",
      label: "Return Simplified Transcript",
      description: "If true, returns a simplified version of the transcript with normalized speaker IDs and formatted timestamps",
      optional: true,
      default: false,
    },
  },
  methods: {
    retrieveTranscriptsOfCalls(args = {}) {
      return this.app.post({
        path: "/calls/transcript",
        ...args,
      });
    },

    millisToTimestamp(millis) {
      const totalSeconds = Math.floor(millis / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      return `[${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}]`;
    },

    simplifyTranscript(originalResponse) {
      const simplified = {
        ...originalResponse,
        callTranscripts: originalResponse.callTranscripts.map((callTranscript) => {
          // Create a map of unique speaker IDs to simplified names
          const speakerMap = new Map();
          let speakerCounter = 1;
          let currentSpeaker = null;
          let currentTopic = null;
          let formattedTranscript = "";

          // Process each sentence maintaining chronological order
          const allSentences = [];
          callTranscript.transcript.forEach((segment) => {
            segment.sentences.forEach((sentence) => {
              allSentences.push({
                ...sentence,
                speakerId: segment.speakerId,
                topic: segment.topic,
              });
            });
          });

          // Sort by start time
          allSentences.sort((a, b) => a.start - b.start);

          // Process sentences
          allSentences.forEach((sentence) => {
            // Map speaker ID to simplified name
            if (!speakerMap.has(sentence.speakerId)) {
              speakerMap.set(sentence.speakerId, `Speaker ${speakerCounter}`);
              speakerCounter++;
            }

            const speaker = speakerMap.get(sentence.speakerId);
            const timestamp = this.millisToTimestamp(sentence.start);

            // Handle topic changes
            if (sentence.topic !== currentTopic) {
              currentTopic = sentence.topic;
              if (currentTopic) {
                formattedTranscript += `\nTopic: ${currentTopic}\n-------------------\n\n`;
              }
            }

            // Add speaker name only if it changes
            if (speaker !== currentSpeaker) {
              currentSpeaker = speaker;
              formattedTranscript += `\n${speaker}:\n`;
            }

            // Add timestamp and text
            formattedTranscript += `${timestamp} ${sentence.text}\n`;
          });

          return {
            callId: callTranscript.callId,
            formattedTranscript: formattedTranscript.trim(),
          };
        }),
      };

      return simplified;
    },
  },

  async run({ $: step }) {
    const {
      retrieveTranscriptsOfCalls,
      returnSimplifiedTranscript,
      simplifyTranscript,
      ...filter
    } = this;

    const response = await retrieveTranscriptsOfCalls({
      step,
      data: {
        filter,
      },
      summary: (response) => `Successfully retrieved transcripts of calls with request ID \`${response.requestId}\`.`,
    });

    if (returnSimplifiedTranscript) {
      return simplifyTranscript(response);
    }

    return response;
  },
};
