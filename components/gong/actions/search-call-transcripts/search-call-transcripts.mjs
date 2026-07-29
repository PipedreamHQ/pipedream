// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../gong.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "gong-search-call-transcripts",
  name: "Search Call Transcripts",
  description: "Find where a word or phrase was said across call transcripts. Returns one entry per matching sentence with the call's ID, "
  + "title and URL, the speaker's name and affiliation, the `hh:mm:ss` offset into the call, and the sentence itself, so you can quote "
  + "what was said and link straight to that moment. Use this to answer questions like \"which calls mentioned pricing\" or \"did anyone "
  + "bring up the competitor\". Narrow the search with a date range, a workspace, or specific **Call IDs**; the search itself runs over "
  + "the transcript text. Prefer this over **Get Call Transcripts** whenever you are looking for a keyword rather than reading a call "
  + "end to end - it scans the same transcripts but returns only the matching lines. Note that it fetches transcripts for every call "
  + `in the window in order to search them, so a narrow date range is much cheaper than a wide one. [See the documentation](${constants.DOCS_URL}#post-/v2/calls/transcript)`,
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "The word or phrase to search for. Matching is case-insensitive and matches anywhere in a sentence (e.g. `pricing` also matches `Pricing model`).",
    },
    wholeWord: {
      type: "boolean",
      label: "Whole Word Only",
      description: "Whether to require the keyword to appear as a whole word, so `AI` does not match `said`. Leave off to match substrings.",
      default: false,
      optional: true,
    },
    fromDateTime: {
      propDefinition: [
        app,
        "fromDateTime",
      ],
      description: "Only search calls that started on or after this date and time, in ISO-8601 format (e.g. `2026-01-01T00:00:00Z`).",
      optional: true,
    },
    toDateTime: {
      propDefinition: [
        app,
        "toDateTime",
      ],
      description: "Only search calls that started before this date and time, in ISO-8601 format (e.g. `2026-04-01T00:00:00Z`). The bound is exclusive.",
      optional: true,
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
      description: "Only search calls belonging to this workspace. Cannot be combined with **Call IDs**. Use the **List Workspace ID Options** action to discover workspace IDs.",
      optional: true,
    },
    callIds: {
      propDefinition: [
        app,
        "callIds",
      ],
      description: "Only search these calls. Cannot be combined with **Workspace ID**. Use **List Calls** to discover call IDs.",
      optional: true,
    },
    maxCalls: {
      type: "integer",
      label: "Max Calls To Search",
      description: `Maximum number of call transcripts to scan. Min ${constants.MIN_LIMIT}, max ${constants.MAX_LIMIT}. Raise this to widen the search.`,
      min: constants.MIN_LIMIT,
      max: constants.MAX_LIMIT,
      default: constants.DEFAULT_LIMIT,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of matching sentences to return. Min ${constants.MIN_LIMIT}, max ${constants.MAX_LIMIT}.`,
      min: constants.MIN_LIMIT,
      max: constants.MAX_LIMIT,
      default: constants.DEFAULT_LIMIT,
      optional: true,
    },
  },
  methods: {
    buildMatcher({
      keyword, wholeWord,
    }) {
      const needle = keyword.trim().toLowerCase();

      if (!wholeWord) {
        return (text) => text.toLowerCase().includes(needle);
      }

      const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(`(?<!\\w)${escaped}(?!\\w)`, "i");
      return (text) => pattern.test(text);
    },
    async getCallIndex({
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
        {
          title: call.metaData?.title,
          url: call.metaData?.url,
          started: call.metaData?.started,
          speakers: Object.fromEntries((call.parties || [])
            .filter(({ speakerId }) => speakerId)
            .map(({
              speakerId, name, emailAddress, affiliation,
            }) => [
              speakerId,
              {
                name,
                emailAddress,
                affiliation,
              },
            ])),
        },
      ]));
    },
  },
  async run({ $: step }) {
    const {
      app,
      keyword,
      wholeWord,
      fromDateTime,
      toDateTime,
      workspaceId,
      callIds,
      maxCalls,
      limit,
    } = this;

    if (!keyword?.trim()) {
      throw new ConfigurationError("`Keyword` must not be blank");
    }

    // Gong rejects this combination on /v2/calls/transcript with
    // "filter.workspaceId: must not provide both callIds and workspaceId".
    if (workspaceId && callIds?.length) {
      throw new ConfigurationError("Must not provide both `Call IDs` and `Workspace ID`");
    }

    const callTranscripts = await app.paginate({
      resourceFn: (args) => app.listCallTranscripts(args),
      resourceFnArgs: {
        step,
        data: {
          filter: {
            fromDateTime,
            toDateTime,
            workspaceId,
            callIds,
          },
        },
      },
      resourceName: "callTranscripts",
      max: maxCalls,
      cursorIn: "data",
    });

    if (!callTranscripts.length) {
      step.export("$summary", "No call transcripts found for the given filters");
      return [];
    }

    const callIndex = await this.getCallIndex({
      step,
      callIds: callTranscripts.map(({ callId }) => callId),
    });

    const matches = this.buildMatcher({
      keyword,
      wholeWord,
    });
    const results = [];

    search:
    for (const {
      callId, transcript,
    } of callTranscripts) {
      const call = callIndex[callId];

      for (const {
        speakerId, topic, sentences,
      } of transcript || []) {
        for (const sentence of sentences || []) {
          if (!matches(sentence.text || "")) {
            continue;
          }

          results.push({
            callId,
            callTitle: call?.title,
            callUrl: call?.url,
            callStarted: call?.started,
            speaker: call?.speakers?.[speakerId],
            speakerId,
            topic,
            startTimestamp: utils.millisToTimestamp(sentence.start),
            start: sentence.start,
            text: sentence.text,
          });

          if (results.length >= limit) {
            break search;
          }
        }
      }
    }

    const matchedCalls = new Set(results.map(({ callId }) => callId)).size;
    step.export(
      "$summary",
      `Found ${utils.pluralize(results.length, "match", "matches")} for "${keyword}" across ${utils.pluralize(matchedCalls, "call")} (searched ${utils.pluralize(callTranscripts.length, "transcript")})`,
    );

    return results;
  },
};
