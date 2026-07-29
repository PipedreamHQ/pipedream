// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../gong.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "gong-retrieve-transcripts-of-calls",
  name: "Get Call Transcripts",
  description: `Retrieve the full spoken transcript of one or more calls. Returns an array of \`{ callId, speakers, transcript }\` objects, where each transcript entry carries the speaker, the topic Gong assigned to that stretch of the call, and the sentences with their \`hh:mm:ss\` offset from the start of the call.

Pass **Call IDs** to transcribe specific calls (use **List Calls** or **Search Calls** to find them), or a date range to transcribe everything recorded in that window. Speaker IDs are resolved to participant names automatically, so you can tell the rep and the customer apart.

To find where a word or phrase was said without pulling whole transcripts back, use **Search Call Transcripts** instead. For summaries, topics, and next steps, use **Search Calls**.

Transcripts exist only for calls Gong has processed; a recently uploaded call may return nothing. Results are paginated internally, so one run returns up to **Limit** transcripts. [See the documentation](${constants.DOCS_URL}#post-/v2/calls/transcript)`,
  type: "action",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    fromDateTime: {
      propDefinition: [
        app,
        "fromDateTime",
      ],
      description: "Only transcribe calls that started on or after this date and time, in ISO-8601 format (e.g. `2026-01-01T00:00:00Z`).",
      optional: true,
    },
    toDateTime: {
      propDefinition: [
        app,
        "toDateTime",
      ],
      description: "Only transcribe calls that started before this date and time, in ISO-8601 format (e.g. `2026-04-01T00:00:00Z`). The bound is exclusive.",
      optional: true,
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
      description: "Only transcribe calls belonging to this workspace. Cannot be combined with **Call IDs**. Use the **List Workspace ID Options** action to discover workspace IDs.",
      optional: true,
    },
    callIds: {
      propDefinition: [
        app,
        "callIds",
      ],
      description: "Transcribe only these calls. Cannot be combined with **Workspace ID**. Use **List Calls** to discover call IDs.",
      optional: true,
    },
    resolveSpeakerNames: {
      type: "boolean",
      label: "Resolve Speaker Names",
      description: "Whether to look up each speaker's name, email, and `Internal` or `External` affiliation. Costs one extra request per batch of calls. Turn off to return raw speaker IDs only.",
      default: true,
      optional: true,
    },
    returnSimplifiedTranscript: {
      type: "boolean",
      label: "Return Simplified Transcript",
      description: "Whether to return one readable text block per call instead of the structured sentence arrays. Easier to read, but drops the per-sentence timing.",
      default: false,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of call transcripts to return. Min ${constants.MIN_LIMIT}, max ${constants.MAX_LIMIT}.`,
      min: constants.MIN_LIMIT,
      max: constants.MAX_LIMIT,
      default: constants.DEFAULT_LIMIT,
      optional: true,
    },
  },
  methods: {
    /**
     * Builds a `speakerId -> party` index for the given calls. Gong's transcript
     * payload identifies a speaker only by `speakerId`, which is distinct from
     * the party's `userId`, so the parties block of /calls/extensive is the only
     * way to attach a name to what was said.
     */
    async getSpeakersByCallId({
      step, callIds,
    }) {
      const calls = await this.app.paginate({
        resourceFn: (args) => this.app.listCallsExtensive(args),
        resourceFnArgs: {
          step,
          data: {
            filter: {
              callIds,
            },
            contentSelector: {
              exposedFields: {
                parties: true,
              },
            },
          },
        },
        resourceName: "calls",
        max: callIds.length,
        cursorIn: "data",
      });

      return Object.fromEntries((calls || []).map((call) => [
        call.metaData?.id,
        Object.fromEntries((call.parties || [])
          .filter(({ speakerId }) => speakerId)
          .map(({
            speakerId, name, emailAddress, affiliation, userId,
          }) => [
            speakerId,
            {
              name,
              emailAddress,
              affiliation,
              userId,
            },
          ])),
      ]));
    },
    formatTranscript({
      transcript, speakers,
    }) {
      return (transcript || []).map(({
        speakerId, topic, sentences,
      }) => ({
        speakerId,
        speaker: speakers?.[speakerId],
        topic,
        sentences: sentences?.map((sentence) => ({
          ...sentence,
          startTimestamp: utils.millisToTimestamp(sentence.start),
        })),
      }));
    },
    simplifyTranscript({
      transcript, speakers,
    }) {
      const lines = [];
      let currentTopic;

      for (const {
        speakerId, topic, sentences,
      } of transcript || []) {
        if (topic && topic !== currentTopic) {
          currentTopic = topic;
          lines.push(`\nTopic: ${topic}\n-------------------`);
        }

        const speaker = speakers?.[speakerId]?.name || `Speaker ${speakerId}`;
        const text = (sentences || []).map(({ text }) => text).join(" ");

        lines.push(`[${utils.millisToTimestamp(sentences?.[0]?.start)}] ${speaker}: ${text}`);
      }

      return lines.join("\n").trim();
    },
  },
  async run({ $: step }) {
    const {
      app,
      fromDateTime,
      toDateTime,
      workspaceId,
      callIds,
      resolveSpeakerNames,
      returnSimplifiedTranscript,
      limit,
    } = this;

    // Gong rejects this combination on /v2/calls/transcript with
    // "filter.workspaceId: must not provide both callIds and workspaceId".
    if (workspaceId && callIds?.length) {
      throw new ConfigurationError("Must not provide both `Call IDs` and `Workspace ID`");
    }

    // Built explicitly rather than by spreading the rest of `this`, which would
    // also sweep this component's methods into the request body.
    const filter = {
      fromDateTime,
      toDateTime,
      workspaceId,
      callIds,
    };

    const callTranscripts = await app.paginate({
      resourceFn: (args) => app.listCallTranscripts(args),
      resourceFnArgs: {
        step,
        data: {
          filter,
        },
      },
      resourceName: "callTranscripts",
      max: limit,
      cursorIn: "data",
    });

    const speakersByCallId = resolveSpeakerNames && callTranscripts.length
      ? await this.getSpeakersByCallId({
        step,
        callIds: callTranscripts.map(({ callId }) => callId),
      })
      : {};

    const results = callTranscripts.map(({
      callId, transcript,
    }) => {
      const speakers = speakersByCallId[callId];
      return {
        callId,
        speakers,
        transcript: returnSimplifiedTranscript
          ? this.simplifyTranscript({
            transcript,
            speakers,
          })
          : this.formatTranscript({
            transcript,
            speakers,
          }),
      };
    });

    step.export("$summary", `Retrieved ${utils.pluralize(results.length, "call transcript")}`);

    return results;
  },
};
